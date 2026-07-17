import { createReadStream, existsSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { Readable } from 'node:stream';
import { getOrCreateUserId } from '@/lib/auth/session';
import { withErrorHandling } from '@/lib/api-helpers';
import { config } from '@/lib/config';
import { prisma } from '@/lib/db';

const MIME: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

/** Sirve una foto de progreso SOLO a su propietario (storage privado, sin URLs públicas). */
export const GET = withErrorHandling(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const photo = await prisma.progressPhoto.findFirst({ where: { id, userId } });
  if (!photo) return new Response('No encontrado', { status: 404 });

  const rel = normalize(photo.path);
  const abs = join(config.privateStorageRoot, rel);
  if (rel.startsWith('..') || !abs.startsWith(config.privateStorageRoot) || !existsSync(abs)) {
    return new Response('No encontrado', { status: 404 });
  }
  const ext = abs.slice(abs.lastIndexOf('.') + 1).toLowerCase();
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new Response(stream, {
    headers: { 'Content-Type': MIME[ext] ?? 'application/octet-stream', 'Cache-Control': 'private, max-age=3600' },
  });
});
