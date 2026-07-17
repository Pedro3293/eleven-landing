import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { withErrorHandling } from '@/lib/api-helpers';
import { getSessionDetail } from '@/lib/services/plan-service';
import { serializeSession } from '@/lib/services/serialize';

export const GET = withErrorHandling(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const session = await getSessionDetail(userId, id);
  return NextResponse.json(serializeSession(session));
});
