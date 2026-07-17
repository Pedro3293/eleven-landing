import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { withErrorHandling } from '@/lib/api-helpers';
import { getOrGenerateNextSession } from '@/lib/services/plan-service';

export const POST = withErrorHandling(async () => {
  const userId = await getOrCreateUserId();
  const session = await getOrGenerateNextSession(userId);
  return NextResponse.json({ sessionId: session.id, status: session.status });
});
