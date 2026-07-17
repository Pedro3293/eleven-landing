import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getOrCreateUserId } from '@/lib/auth/session';
import { withErrorHandling } from '@/lib/api-helpers';
import { DomainError } from '@/lib/services/plan-service';
import { config } from '@/lib/config';
import { prisma } from '@/lib/db';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

/** Subida de foto de progreso a storage privado (nunca /public). */
export const POST = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!(file instanceof File)) throw new DomainError('Falta el archivo (campo "file").');
  if (file.size === 0 || file.size > MAX_BYTES) throw new DomainError('La imagen debe pesar entre 1 byte y 10 MB.');
  const ext = ALLOWED[file.type];
  if (!ext) throw new DomainError('Formato no soportado: usa JPG, PNG o WebP.');

  const pose = typeof form?.get('pose') === 'string' ? String(form.get('pose')).slice(0, 20) : null;
  const checkInId = typeof form?.get('checkInId') === 'string' ? String(form.get('checkInId')) : null;

  const dir = join(config.privateStorageRoot, 'photos', userId);
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));

  const photo = await prisma.progressPhoto.create({
    data: {
      userId,
      path: join('photos', userId, name),
      pose,
      checkInId: checkInId || null,
    },
  });
  return NextResponse.json({ id: photo.id, url: `/api/photos/${photo.id}` });
});

export const GET = withErrorHandling(async () => {
  const userId = await getOrCreateUserId();
  const photos = await prisma.progressPhoto.findMany({
    where: { userId },
    orderBy: { takenAt: 'desc' },
    take: 60,
  });
  return NextResponse.json({
    photos: photos.map((p) => ({ id: p.id, url: `/api/photos/${p.id}`, takenAt: p.takenAt, pose: p.pose })),
  });
});
