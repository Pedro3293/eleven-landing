import { NextResponse } from 'next/server';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { profileSchema } from '@/lib/schemas';
import { rankMethodologies } from '@/lib/engine/assign-methodology';

/** Devuelve el ranking de metodologías para el perfil (previo a confirmar el plan). */
export const POST = withErrorHandling(async (req: Request) => {
  const body = await parseBody(req, profileSchema.omit({ displayName: true }).extend({ displayName: profileSchema.shape.displayName.optional() }));
  const ranked = rankMethodologies({
    goal: body.goal,
    experience: body.experience,
    injuries: body.injuries,
    equipment: body.equipment,
    daysPerWeek: body.daysPerWeek,
    minutesPerSession: body.minutesPerSession,
  });
  return NextResponse.json({
    recommendations: ranked.slice(0, 3).map((r) => ({
      id: r.methodology.id,
      name: r.methodology.name,
      description: r.methodology.description,
      daysPerWeekOptions: r.methodology.daysPerWeekOptions,
      reasons: r.reasons,
    })),
  });
});
