/**
 * Generación procedural de sesiones (DESCRIBE §4.3).
 * Determinista: misma semilla + mismo estado ⇒ misma sesión. La sesión generada se
 * persiste; la semilla queda guardada en Session.seed.
 *
 * El generador es puro respecto a la BD: recibe un ExerciseRepository (inyectable en tests).
 */
import type { ExerciseDTO, ExerciseRepository } from '@/lib/repository/exercise-repository';
import { createRng } from './rng';
import { isDeloadSession, initialProgressState } from './progression';
import { getConditionAdjustments, type ConditionAdjustments } from './condition-adjustments';
import type {
  ExerciseSlot,
  GeneratedExercise,
  GeneratedSession,
  MethodologyConfig,
  PlanState,
  ProfileInput,
  RecentFeedback,
} from './types';

/** Segundos estimados de trabajo por serie (aprox. para presupuesto de tiempo). */
const WORK_SECONDS_PER_SET = 40;
/** Overhead por ejercicio (preparación, cambio de estación). */
const SETUP_SECONDS = 90;

export interface GenerateSessionInput {
  config: MethodologyConfig;
  profile: ProfileInput;
  state: PlanState;
  seed: string;
  feedback?: RecentFeedback;
  /** Índice de sesión (1-based) que se va a generar. */
  sessionIndex: number;
}

export async function generateSession(
  repo: ExerciseRepository,
  input: GenerateSessionInput,
): Promise<GeneratedSession> {
  const { config, profile, state, seed, feedback, sessionIndex } = input;
  const rng = createRng(seed);

  const day = config.days[(sessionIndex - 1) % config.days.length];
  const deload = isDeloadSession(config, state.completedSessions);

  // Lesiones activas = perfil + molestias recientes de check-ins
  const injuries = [...new Set([...profile.injuries, ...(feedback?.painZones ?? [])])];
  const conditions = getConditionAdjustments(profile.healthConditions ?? []);
  const highFatigue =
    (feedback?.avgRpe ?? 0) >= 9 || (feedback?.avgEnergy ?? 5) <= 2 || conditions.conservativeVolume;

  const exercises: GeneratedExercise[] = [];
  const usedIds = new Set<string>();

  for (let slotIndex = 0; slotIndex < day.slots.length; slotIndex++) {
    const slot = day.slots[slotIndex];
    const chosen = await pickExercise(repo, { config, profile, state, day: day.key, slot, slotIndex, rng, injuries, usedIds, conditions });
    if (!chosen) continue; // sin candidato viable (material/lesión): el slot se omite

    usedIds.add(chosen.id);
    const progress = state.progress[chosen.id] ?? initialProgressState(slot);

    let sets = slot.sets;
    let weight = progress.weightKg;
    if (deload) {
      sets = Math.max(1, Math.round(sets * config.deload.volumeFactor));
      if (weight != null) weight = round25(weight * config.deload.intensityFactor);
    } else if (highFatigue && slot.role !== 'main') {
      sets = Math.max(1, sets - 1); // autorregulación: recorta volumen accesorio
    }

    exercises.push({
      exerciseId: chosen.id,
      slotIndex,
      role: slot.role,
      pattern: chosen.movementPattern,
      sets,
      repsMin: slot.repsMin,
      repsMax: slot.repsMax,
      targetWeightKg: weight,
      restSeconds: Math.round((slot.restSeconds * conditions.restFactor) / 5) * 5,
      tempo: slot.tempo,
      mode: slot.mode ?? 'straight',
      modeSeconds: slot.modeSeconds,
    });
  }

  // Presupuesto de tiempo: descartar opcionales (de atrás hacia delante) hasta caber
  let estimated = estimateMinutes(exercises);
  if (estimated > profile.minutesPerSession) {
    for (let i = exercises.length - 1; i >= 0 && estimated > profile.minutesPerSession; i--) {
      if (day.slots[exercises[i].slotIndex].optional) {
        exercises.splice(i, 1);
        estimated = estimateMinutes(exercises);
      }
    }
  }

  return {
    dayKey: day.key,
    title: deload ? `${day.title} · Descarga` : day.title,
    seed,
    exercises,
    isDeload: deload,
    estimatedMinutes: estimated,
  };
}

interface PickContext {
  config: MethodologyConfig;
  profile: ProfileInput;
  state: PlanState;
  day: string;
  slot: ExerciseSlot;
  slotIndex: number;
  rng: ReturnType<typeof createRng>;
  injuries: string[];
  usedIds: Set<string>;
  conditions: ConditionAdjustments;
}

async function pickExercise(repo: ExerciseRepository, ctx: PickContext): Promise<ExerciseDTO | null> {
  const { profile, state, day, slot, slotIndex, rng, injuries, usedIds, conditions } = ctx;
  const slotKey = `${day}:${slotIndex}`;
  const equipmentIn = effectiveEquipment(ctx.config, profile);

  // 1. Consistencia: mismo ejercicio que la última vez si sigue siendo viable
  const previousId = state.slotExercises[slotKey];
  if (previousId && !usedIds.has(previousId)) {
    const prev = await repo.getById(previousId);
    if (
      prev &&
      equipmentIn.includes(prev.equipment) &&
      !conditions.excludeExercise(prev) &&
      (await repo.find({ pattern: prev.movementPattern, equipmentIn: [prev.equipment], excludeInjuries: injuries, limit: 1000 })).some((e) => e.id === prev.id)
    ) {
      return prev;
    }
  }

  // 2. Candidatos por patrón (en orden de preferencia declarado)
  for (const pattern of slot.patterns) {
    let candidates = await repo.find({
      pattern,
      equipmentIn,
      excludeInjuries: injuries,
    });
    candidates = candidates.filter((c) => !usedIds.has(c.id) && !conditions.excludeExercise(c));
    if (slot.targets?.length) {
      // Sin candidatos del músculo pedido, el slot no se rellena con otra cosa:
      // mejor omitirlo que meter un ejercicio que no toca (p.ej. bíceps en día de empuje).
      candidates = candidates.filter((c) => slot.targets!.includes(c.target) || slot.targets!.includes(c.muscleGroup));
    }
    if (slot.preferCompound) {
      const compound = candidates.filter((c) => c.isCompound);
      if (compound.length > 0) candidates = compound;
    }
    if (candidates.length === 0) continue;

    // Determinista: orden estable por id + elección seeded entre los primeros
    candidates.sort((a, b) => a.id.localeCompare(b.id));
    const pool = candidates.slice(0, Math.min(candidates.length, 8));
    return rng.pick(pool) ?? null;
  }
  return null;
}

/** Equipamiento efectivo: el del perfil (+ peso corporal siempre disponible). */
export function effectiveEquipment(config: MethodologyConfig, profile: ProfileInput): string[] {
  if (config.bodyweightOnly) {
    const allowed = ['body weight', 'band', 'resistance band', 'assisted', 'rope'];
    return ['body weight', ...profile.equipment.filter((e) => allowed.includes(e))];
  }
  return [...new Set(['body weight', ...profile.equipment])];
}

export function estimateMinutes(exercises: GeneratedExercise[]): number {
  let seconds = 0;
  for (const ex of exercises) {
    if (ex.mode !== 'straight' && ex.modeSeconds) {
      seconds += ex.modeSeconds + SETUP_SECONDS;
    } else {
      seconds += ex.sets * (WORK_SECONDS_PER_SET + ex.restSeconds) + SETUP_SECONDS;
    }
  }
  return Math.round(seconds / 60);
}

function round25(kg: number): number {
  return Math.max(0, Math.round(kg / 2.5) * 2.5);
}
