/**
 * Sirve los medios de ejercicios desde la fuente configurada (MEDIA_SOURCE).
 * Los componentes solo conocen URLs lógicas /api/media/...; el swap de fuente
 * no toca UI ni motor (Gate 0).
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, normalize } from 'node:path';
import { Readable } from 'node:stream';
import { config } from '@/lib/config';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const rel = normalize(path.join('/'));
  // Solo subcarpetas de media conocidas y sin escaparse de la raíz
  if (rel.startsWith('..') || rel.includes('\0') || !/^(images|videos)\//.test(rel)) {
    return new Response('No encontrado', { status: 404 });
  }
  const abs = join(config.mediaRoot, rel);
  if (!abs.startsWith(config.mediaRoot) || !existsSync(abs)) {
    return new Response('No encontrado', { status: 404 });
  }
  const ext = abs.slice(abs.lastIndexOf('.')).toLowerCase();
  const mime = MIME[ext];
  if (!mime) return new Response('No encontrado', { status: 404 });

  const size = statSync(abs).size;
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return new Response(stream, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
