import { NextResponse } from 'next/server';
import { z } from 'zod';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { config } from '@/lib/config';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { DomainError } from '@/lib/services/plan-service';
import { getOrCreateUserId } from '@/lib/auth/session';

/** Exportación completa de datos (GDPR): descarga JSON. */
export const GET = withErrorHandling(async () => {
  const userId = await getOrCreateUserId();
  const [user, profile, plans, sessions, checkIns, photos, threads] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, createdAt: true } }),
    prisma.profile.findUnique({ where: { userId } }),
    prisma.plan.findMany({ where: { userId }, include: { methodology: { select: { name: true } } } }),
    prisma.session.findMany({
      where: { userId },
      include: { exercises: { include: { exercise: { select: { name: true } }, setLogs: true } } },
    }),
    prisma.checkIn.findMany({ where: { userId } }),
    prisma.progressPhoto.findMany({ where: { userId }, select: { id: true, takenAt: true, pose: true, note: true } }),
    prisma.chatThread.findMany({ where: { userId }, include: { messages: true } }),
  ]);
  const payload = { exportadoEl: new Date().toISOString(), user, profile, plans, sessions, checkIns, fotos: photos, chats: threads };
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="forge-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
});

const deleteSchema = z.object({ confirm: z.literal('ELIMINAR') });

/** Borrado de cuenta y de todos los datos, incluidas fotos en disco (GDPR). */
export const POST = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const body = await parseBody(req, deleteSchema).catch(() => null);
  if (!body) throw new DomainError('Escribe ELIMINAR para confirmar el borrado definitivo.');

  await prisma.user.delete({ where: { id: userId } }); // cascade borra el resto
  await rm(join(config.privateStorageRoot, 'photos', userId), { recursive: true, force: true });
  const store = await cookies();
  store.delete('forge_session');
  return NextResponse.json({ ok: true });
});
