import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { finishSessionSchema } from '@/lib/schemas';
import { finishSession } from '@/lib/services/plan-service';
import { serializeSession } from '@/lib/services/serialize';

export const POST = withErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const body = await parseBody(req, finishSessionSchema);
  const session = await finishSession(userId, id, body);
  return NextResponse.json(serializeSession(session));
});
