import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { DomainError } from '@/lib/services/plan-service';
import { getCurrentUserId, sealToken } from '@/lib/auth/session';
import { hashPassword, verifyPassword } from '@/lib/auth/password';

const authSchema = z.object({
  action: z.enum(['register', 'login', 'logout']),
  email: z.string().email('Email no válido').max(120).optional(),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(200).optional(),
});

async function setSessionCookie(userId: string) {
  const store = await cookies();
  store.set('forge_session', sealToken(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });
}

export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseBody(req, authSchema);

  if (body.action === 'logout') {
    const store = await cookies();
    store.delete('forge_session');
    return NextResponse.json({ ok: true });
  }

  if (!body.email || !body.password) throw new DomainError('Email y contraseña son obligatorios.');
  const email = body.email.toLowerCase().trim();

  if (body.action === 'register') {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new DomainError('Ya existe una cuenta con ese email. Inicia sesión.', 409);
    const passwordHash = await hashPassword(body.password);

    // Reclama la cuenta anónima actual (conserva plan, sesiones y fotos) — D-11
    const currentId = await getCurrentUserId();
    const current = currentId ? await prisma.user.findUnique({ where: { id: currentId } }) : null;
    if (current && current.email.endsWith('@forge.local')) {
      const user = await prisma.user.update({ where: { id: current.id }, data: { email, passwordHash } });
      await setSessionCookie(user.id);
      return NextResponse.json({ ok: true, claimed: true });
    }
    const user = await prisma.user.create({ data: { email, passwordHash } });
    await setSessionCookie(user.id);
    return NextResponse.json({ ok: true, claimed: false });
  }

  // login
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || !(await verifyPassword(body.password, user.passwordHash))) {
    throw new DomainError('Email o contraseña incorrectos.', 401);
  }
  await setSessionCookie(user.id);
  return NextResponse.json({ ok: true });
});
