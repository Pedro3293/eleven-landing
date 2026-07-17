import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { chatMessageSchema } from '@/lib/schemas';
import { getOrCreateThread, runAgent } from '@/lib/ai/agent';
import { prisma } from '@/lib/db';

export const POST = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const body = await parseBody(req, chatMessageSchema);
  const thread = await getOrCreateThread(userId, body.context);
  const reply = await runAgent(userId, thread.id, body.message);
  return NextResponse.json(reply);
});

/** Historial del hilo del contexto dado (?context=global|session:<id>). */
export const GET = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const context = new URL(req.url).searchParams.get('context') ?? 'global';
  const thread = await prisma.chatThread.findFirst({
    where: { userId, context },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } },
  });
  return NextResponse.json({
    messages: (thread?.messages ?? []).map((m) => ({ id: m.id, role: m.role, content: m.content, createdAt: m.createdAt })),
  });
});
