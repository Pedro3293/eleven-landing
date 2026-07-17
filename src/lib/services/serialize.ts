/** DTOs de sesión para el player (tipos compartidos cliente-servidor). */
import type { Prisma } from '@prisma/client';

type SessionWithDetail = Prisma.SessionGetPayload<{
  include: {
    exercises: { include: { exercise: true; setLogs: true } };
  };
}>;

export interface SetLogDTO {
  id: string;
  setIndex: number;
  reps: number;
  weightKg: number | null;
  rpe: number | null;
  seconds: number | null;
  isWarmup: boolean;
}

export interface SessionExerciseDTO {
  id: string;
  order: number;
  role: string;
  pattern: string;
  targetSets: number;
  targetRepsMin: number;
  targetRepsMax: number;
  targetWeightKg: number | null;
  restSeconds: number;
  tempo: string | null;
  mode: string;
  modeSeconds: number | null;
  status: string;
  substituted: boolean;
  exercise: {
    id: string;
    name: string;
    equipment: string;
    target: string;
    instructions: string[];
    imageUrl: string;
    gifUrl: string;
    attribution: string;
  };
  setLogs: SetLogDTO[];
}

export interface SessionDTO {
  id: string;
  index: number;
  dayKey: string;
  title: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  totalSeconds: number | null;
  effectiveSeconds: number | null;
  exercises: SessionExerciseDTO[];
}

export function serializeSession(s: SessionWithDetail): SessionDTO {
  return {
    id: s.id,
    index: s.index,
    dayKey: s.dayKey,
    title: s.title,
    status: s.status,
    startedAt: s.startedAt?.toISOString() ?? null,
    finishedAt: s.finishedAt?.toISOString() ?? null,
    totalSeconds: s.totalSeconds,
    effectiveSeconds: s.effectiveSeconds,
    exercises: s.exercises.map((se) => ({
      id: se.id,
      order: se.order,
      role: se.role,
      pattern: se.pattern,
      targetSets: se.targetSets,
      targetRepsMin: se.targetRepsMin,
      targetRepsMax: se.targetRepsMax,
      targetWeightKg: se.targetWeightKg,
      restSeconds: se.restSeconds,
      tempo: se.tempo,
      mode: se.mode,
      modeSeconds: se.modeSeconds,
      status: se.status,
      substituted: Boolean(se.substitutedFromId),
      exercise: {
        id: se.exercise.id,
        name: se.exercise.name,
        equipment: se.exercise.equipment,
        target: se.exercise.target,
        instructions: JSON.parse(se.exercise.instructionsEs) as string[],
        imageUrl: se.exercise.imagePath,
        gifUrl: se.exercise.gifPath,
        attribution: se.exercise.attribution,
      },
      setLogs: se.setLogs.map((l) => ({
        id: l.id,
        setIndex: l.setIndex,
        reps: l.reps,
        weightKg: l.weightKg,
        rpe: l.rpe,
        seconds: l.seconds,
        isWarmup: l.isWarmup,
      })),
    })),
  };
}
