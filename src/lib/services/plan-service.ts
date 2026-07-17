/**
 * Servicios de dominio: perfil, plan y ciclo de vida de sesiones.
 * Usados por las API routes y por las tools del agente de IA.
 */
import { prisma } from '@/lib/db';
import { exerciseRepository } from '@/lib/repository';
import { generateSession } from '@/lib/engine/session-generator';
import { getMethodology } from '@/lib/engine/methodologies';
import { assignMethodology, closestDays } from '@/lib/engine/assign-methodology';
import { applyProgression, initialProgressState } from '@/lib/engine/progression';
import type { PlanState, ProfileInput, RecentFeedback } from '@/lib/engine/types';
import type { MovementPattern } from '@/lib/dataset/movement-pattern';
import type { Prisma } from '@prisma/client';

export class DomainError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

export function parsePlanState(json: string): PlanState {
  const raw = JSON.parse(json) as Partial<PlanState>;
  return {
    daysPerWeek: raw.daysPerWeek ?? 3,
    slotExercises: raw.slotExercises ?? {},
    progress: raw.progress ?? {},
    completedSessions: raw.completedSessions ?? 0,
  };
}

export function profileToInput(profile: {
  goal: string;
  experience: string;
  injuries: string;
  healthConditions?: string;
  equipment: string;
  daysPerWeek: number;
  minutesPerSession: number;
  bodyweightKg: number | null;
}): ProfileInput {
  return {
    goal: profile.goal as ProfileInput['goal'],
    experience: profile.experience as ProfileInput['experience'],
    injuries: JSON.parse(profile.injuries) as string[],
    healthConditions: JSON.parse(profile.healthConditions ?? '[]') as string[],
    equipment: JSON.parse(profile.equipment) as string[],
    daysPerWeek: profile.daysPerWeek,
    minutesPerSession: profile.minutesPerSession,
    bodyweightKg: profile.bodyweightKg,
  };
}

export interface CreatePlanArgs {
  displayName: string;
  profile: ProfileInput;
  /** Si no se indica, se asigna automáticamente. */
  methodologyId?: string;
}

export async function createProfileAndPlan(userId: string, args: CreatePlanArgs) {
  const { profile } = args;
  const methodologyId = args.methodologyId ?? assignMethodology(profile).methodology.id;
  const config = getMethodology(methodologyId);
  if (!config) throw new DomainError(`Metodología desconocida: ${methodologyId}`, 404);

  const state: PlanState = {
    daysPerWeek: closestDays(config, profile.daysPerWeek),
    slotExercises: {},
    progress: {},
    completedSessions: 0,
  };

  return prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: args.displayName,
        goal: profile.goal,
        experience: profile.experience,
        injuries: JSON.stringify(profile.injuries),
        healthConditions: JSON.stringify(profile.healthConditions ?? []),
        equipment: JSON.stringify(profile.equipment),
        daysPerWeek: profile.daysPerWeek,
        minutesPerSession: profile.minutesPerSession,
        bodyweightKg: profile.bodyweightKg ?? null,
      },
      update: {
        displayName: args.displayName,
        goal: profile.goal,
        experience: profile.experience,
        injuries: JSON.stringify(profile.injuries),
        healthConditions: JSON.stringify(profile.healthConditions ?? []),
        equipment: JSON.stringify(profile.equipment),
        daysPerWeek: profile.daysPerWeek,
        minutesPerSession: profile.minutesPerSession,
        bodyweightKg: profile.bodyweightKg ?? null,
      },
    });
    await tx.plan.updateMany({ where: { userId, status: 'active' }, data: { status: 'archived' } });
    return tx.plan.create({
      data: {
        userId,
        methodologyId,
        name: config.name,
        config: JSON.stringify(state),
        status: 'active',
      },
      include: { methodology: true },
    });
  });
}

export async function getActivePlan(userId: string) {
  return prisma.plan.findFirst({
    where: { userId, status: 'active' },
    include: { methodology: true },
  });
}

/** Feedback reciente para modular la generación (RPE de sets + dolor de check-ins). */
export async function computeRecentFeedback(userId: string): Promise<RecentFeedback> {
  const since = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [logs, checkIns] = await Promise.all([
    prisma.setLog.findMany({
      where: { sessionExercise: { session: { userId } }, completedAt: { gte: since }, rpe: { not: null } },
      select: { rpe: true },
      take: 200,
    }),
    prisma.checkIn.findMany({ where: { userId, date: { gte: since } }, select: { data: true } }),
  ]);
  const rpes = logs.map((l) => l.rpe!).filter((r) => r > 0);
  const avgRpe = rpes.length ? rpes.reduce((a, b) => a + b, 0) / rpes.length : undefined;

  const painZones = new Set<string>();
  let energySum = 0;
  let energyCount = 0;
  for (const c of checkIns) {
    try {
      const data = JSON.parse(c.data) as { dolor?: string[]; energia?: number };
      data.dolor?.forEach((z) => painZones.add(z));
      if (typeof data.energia === 'number') {
        energySum += data.energia;
        energyCount++;
      }
    } catch {
      // check-in con formato antiguo: se ignora
    }
  }
  return {
    avgRpe,
    painZones: [...painZones],
    avgEnergy: energyCount ? energySum / energyCount : undefined,
  };
}

/** Devuelve la sesión activa (planned/in_progress) o genera y persiste la siguiente. */
export async function getOrGenerateNextSession(userId: string) {
  const open = await prisma.session.findFirst({
    where: { userId, status: { in: ['planned', 'in_progress'] } },
    orderBy: { index: 'desc' },
  });
  if (open) return open;

  const plan = await getActivePlan(userId);
  if (!plan) throw new DomainError('No hay plan activo. Completa el onboarding primero.', 404);
  const profileRow = await prisma.profile.findUnique({ where: { userId } });
  if (!profileRow) throw new DomainError('Falta el perfil.', 404);

  const config = getMethodology(plan.methodologyId);
  if (!config) throw new DomainError('Metodología no disponible.', 500);

  const state = parsePlanState(plan.config);
  const profile = profileToInput(profileRow);
  const feedback = await computeRecentFeedback(userId);
  const index = state.completedSessions + 1;
  const seed = `${plan.id}:${index}`;

  const generated = await generateSession(exerciseRepository, {
    config,
    profile,
    state,
    seed,
    feedback,
    sessionIndex: index,
  });
  if (generated.exercises.length === 0) {
    throw new DomainError('No hay ejercicios viables con tu equipamiento y limitaciones actuales.', 422);
  }

  return prisma.session.create({
    data: {
      userId,
      planId: plan.id,
      index,
      dayKey: generated.dayKey,
      title: generated.title,
      seed,
      status: 'planned',
      exercises: {
        create: generated.exercises.map((e, order) => ({
          exerciseId: e.exerciseId,
          order,
          role: e.role,
          pattern: e.pattern,
          targetSets: e.sets,
          targetRepsMin: e.repsMin,
          targetRepsMax: e.repsMax,
          targetWeightKg: e.targetWeightKg,
          restSeconds: e.restSeconds,
          tempo: e.tempo ?? null,
          mode: e.mode,
          modeSeconds: e.modeSeconds ?? null,
        })),
      },
    },
  });
}

const SESSION_INCLUDE = {
  exercises: {
    orderBy: { order: 'asc' },
    include: { exercise: true, setLogs: { orderBy: { setIndex: 'asc' } } },
  },
} satisfies Prisma.SessionInclude;

export async function getSessionDetail(userId: string, sessionId: string) {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
    include: SESSION_INCLUDE,
  });
  if (!session) throw new DomainError('Sesión no encontrada.', 404);
  return session;
}

export async function startSession(userId: string, sessionId: string) {
  const session = await prisma.session.findFirst({ where: { id: sessionId, userId } });
  if (!session) throw new DomainError('Sesión no encontrada.', 404);
  if (session.status === 'completed') throw new DomainError('La sesión ya está finalizada.', 409);
  return prisma.session.update({
    where: { id: sessionId },
    data: { status: 'in_progress', startedAt: session.startedAt ?? new Date() },
  });
}

export async function logSet(
  userId: string,
  sessionExerciseId: string,
  data: { setIndex: number; reps: number; weightKg?: number | null; rpe?: number | null; seconds?: number | null; isWarmup?: boolean },
) {
  const se = await prisma.sessionExercise.findFirst({
    where: { id: sessionExerciseId, session: { userId } },
    include: { session: { select: { status: true } } },
  });
  if (!se) throw new DomainError('Ejercicio de sesión no encontrado.', 404);
  if (se.session.status === 'completed') throw new DomainError('La sesión ya está finalizada.', 409);

  const existing = await prisma.setLog.findFirst({
    where: { sessionExerciseId, setIndex: data.setIndex },
  });
  if (existing) {
    return prisma.setLog.update({
      where: { id: existing.id },
      data: { reps: data.reps, weightKg: data.weightKg ?? null, rpe: data.rpe ?? null, seconds: data.seconds ?? null },
    });
  }
  return prisma.setLog.create({
    data: {
      sessionExerciseId,
      setIndex: data.setIndex,
      reps: data.reps,
      weightKg: data.weightKg ?? null,
      rpe: data.rpe ?? null,
      seconds: data.seconds ?? null,
      isWarmup: data.isWarmup ?? false,
    },
  });
}

export async function setExerciseStatus(userId: string, sessionExerciseId: string, status: 'done' | 'skipped' | 'pending') {
  const se = await prisma.sessionExercise.findFirst({ where: { id: sessionExerciseId, session: { userId } } });
  if (!se) throw new DomainError('Ejercicio de sesión no encontrado.', 404);
  return prisma.sessionExercise.update({ where: { id: se.id }, data: { status } });
}

export async function addSet(userId: string, sessionExerciseId: string) {
  const se = await prisma.sessionExercise.findFirst({ where: { id: sessionExerciseId, session: { userId } } });
  if (!se) throw new DomainError('Ejercicio de sesión no encontrado.', 404);
  return prisma.sessionExercise.update({ where: { id: se.id }, data: { targetSets: se.targetSets + 1 } });
}

export async function getAlternatives(userId: string, sessionExerciseId: string) {
  const se = await prisma.sessionExercise.findFirst({
    where: { id: sessionExerciseId, session: { userId } },
  });
  if (!se) throw new DomainError('Ejercicio de sesión no encontrado.', 404);
  const profileRow = await prisma.profile.findUnique({ where: { userId } });
  const profile = profileRow ? profileToInput(profileRow) : null;
  return exerciseRepository.findAlternatives(se.exerciseId, {
    equipmentIn: profile ? ['body weight', ...profile.equipment] : undefined,
    excludeInjuries: profile?.injuries,
    limit: 8,
  });
}

export async function substituteExercise(userId: string, sessionExerciseId: string, newExerciseId?: string) {
  const se = await prisma.sessionExercise.findFirst({ where: { id: sessionExerciseId, session: { userId } } });
  if (!se) throw new DomainError('Ejercicio de sesión no encontrado.', 404);

  let targetId = newExerciseId;
  if (!targetId) {
    const alternatives = await getAlternatives(userId, sessionExerciseId);
    if (alternatives.length === 0) throw new DomainError('No hay alternativas viables.', 422);
    targetId = alternatives[0].id;
  }
  const target = await exerciseRepository.getById(targetId);
  if (!target) throw new DomainError('Ejercicio no encontrado.', 404);

  return prisma.sessionExercise.update({
    where: { id: se.id },
    data: {
      exerciseId: target.id,
      pattern: target.movementPattern,
      substitutedFromId: se.substitutedFromId ?? se.exerciseId,
      status: 'pending',
      // la carga previa no aplica a otro ejercicio
      targetWeightKg: null,
    },
  });
}

export async function finishSession(
  userId: string,
  sessionId: string,
  data: { totalSeconds?: number; effectiveSeconds?: number; notes?: string },
) {
  const session = await getSessionDetail(userId, sessionId);
  if (session.status === 'completed') return session;

  const plan = await prisma.plan.findUnique({ where: { id: session.planId }, include: { methodology: true } });
  if (!plan) throw new DomainError('Plan no encontrado.', 404);
  const config = getMethodology(plan.methodologyId);
  if (!config) throw new DomainError('Metodología no disponible.', 500);

  const state = parsePlanState(plan.config);
  const day = config.days.find((d) => d.key === session.dayKey);

  // Aplica progresión por ejercicio con series registradas y fija el ejercicio del slot
  for (const se of session.exercises) {
    const logs = se.setLogs.filter((l) => !l.isWarmup);
    const slotIndex = se.order;
    const slot = day?.slots[slotIndex];
    const slotKey = `${session.dayKey}:${slotIndex}`;
    if (se.status !== 'skipped' && logs.length > 0 && slot) {
      state.slotExercises[slotKey] = se.exerciseId;
      const prev = state.progress[se.exerciseId] ?? initialProgressState(slot);
      state.progress[se.exerciseId] = applyProgression(
        prev,
        config.progression,
        se.pattern as MovementPattern,
        { repsMin: se.targetRepsMin, repsMax: se.targetRepsMax },
        logs.map((l) => ({ reps: l.reps, weightKg: l.weightKg })),
      );
    }
  }
  state.completedSessions += 1;

  const [, , updated] = await prisma.$transaction([
    prisma.sessionExercise.updateMany({
      where: { sessionId, status: 'pending', setLogs: { some: {} } },
      data: { status: 'done' },
    }),
    prisma.plan.update({ where: { id: plan.id }, data: { config: JSON.stringify(state) } }),
    prisma.session.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        finishedAt: new Date(),
        totalSeconds: data.totalSeconds ?? null,
        effectiveSeconds: data.effectiveSeconds ?? null,
        notes: data.notes ?? null,
      },
      include: SESSION_INCLUDE,
    }),
  ]);
  return updated;
}
