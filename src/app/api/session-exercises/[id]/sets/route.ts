import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { logSetSchema } from '@/lib/schemas';
import { logSet } from '@/lib/services/plan-service';

export const POST = withErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const body = await parseBody(req, logSetSchema);
  const log = await logSet(userId, id, body);
  return NextResponse.json({ id: log.id, setIndex: log.setIndex });
});
