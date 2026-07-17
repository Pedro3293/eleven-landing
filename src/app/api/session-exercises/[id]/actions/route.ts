import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOrCreateUserId } from '@/lib/auth/session';
import { parseBody, withErrorHandling } from '@/lib/api-helpers';
import { substituteSchema } from '@/lib/schemas';
import { addSet, getAlternatives, setExerciseStatus, substituteExercise } from '@/lib/services/plan-service';

const actionSchema = z.object({
  action: z.enum(['skip', 'unskip', 'done', 'add-set', 'substitute']),
  newExerciseId: substituteSchema.shape.newExerciseId,
});

export const POST = withErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const body = await parseBody(req, actionSchema);
  switch (body.action) {
    case 'skip':
      return NextResponse.json(await setExerciseStatus(userId, id, 'skipped'));
    case 'unskip':
      return NextResponse.json(await setExerciseStatus(userId, id, 'pending'));
    case 'done':
      return NextResponse.json(await setExerciseStatus(userId, id, 'done'));
    case 'add-set':
      return NextResponse.json(await addSet(userId, id));
    case 'substitute':
      return NextResponse.json(await substituteExercise(userId, id, body.newExerciseId));
  }
});

/** GET → alternativas de sustitución para este ejercicio. */
export const GET = withErrorHandling(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const userId = await getOrCreateUserId();
  const { id } = await params;
  const alternatives = await getAlternatives(userId, id);
  return NextResponse.json({
    alternatives: alternatives.map((a) => ({
      id: a.id,
      name: a.name,
      equipment: a.equipment,
      target: a.target,
      imageUrl: a.imageUrl,
    })),
  });
});
