/**
 * Sesión de usuario con cookie firmada (HMAC-SHA256). Sin dependencias externas.
 * En la primera visita se auto-provisiona un usuario anónimo (D-11); el alta con
 * email/contraseña reclama esa cuenta manteniendo sus datos.
 */
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { config } from '@/lib/config';

const COOKIE = 'forge_session';
const MAX_AGE = 60 * 60 * 24 * 365;

function sign(value: string): string {
  return createHmac('sha256', config.authSecret).update(value).digest('base64url');
}

export function sealToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ uid: userId, iat: Date.now() })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function unsealToken(token: string): string | null {
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { uid?: string };
    return typeof data.uid === 'string' ? data.uid : null;
  } catch {
    return null;
  }
}

/** Usuario actual o null (no crea nada). */
export async function getCurrentUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  const uid = unsealToken(token);
  if (!uid) return null;
  const exists = await prisma.user.findUnique({ where: { id: uid }, select: { id: true } });
  return exists ? uid : null;
}

/** Usuario actual, creándolo (anónimo) si no existe. Solo en route handlers/server actions. */
export async function getOrCreateUserId(): Promise<string> {
  const existing = await getCurrentUserId();
  if (existing) return existing;
  const user = await prisma.user.create({
    data: { email: `anon-${randomUUID()}@forge.local`, passwordHash: '' },
  });
  const store = await cookies();
  store.set(COOKIE, sealToken(user.id), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
  return user.id;
}
