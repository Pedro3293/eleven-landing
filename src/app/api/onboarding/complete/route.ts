import { NextResponse } from 'next/server';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { profileSchema } from '@/lib/schemas';
import { createProfileAndPlan } from '@/lib/services/plan-service';

export const POST = withErrorHandling(async (req: Request) => {
  const userId = await getOrCreateUserId();
  const body = await parseBody(req, profileSchema);
  const plan = await createProfileAndPlan(userId, {
    displayName: body.displayName,
    methodologyId: body.methodologyId,
    profile: {
      goal: body.goal,
      experience: body.experience,
      injuries: body.injuries,
      equipment: body.equipment,
      daysPerWeek: body.daysPerWeek,
      minutesPerSession: body.minutesPerSession,
      bodyweightKg: body.bodyweightKg ?? null,
    },
  });
  return NextResponse.json({ planId: plan.id, methodology: plan.methodology.name });
});
