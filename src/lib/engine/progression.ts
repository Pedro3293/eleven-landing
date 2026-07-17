/**
 * Reglas de progresión y deload. Funciones puras: reciben estado y devuelven estado nuevo.
 */
import type { ExerciseProgressState, MethodologyConfig, ProgressionRule } from './types';
import type { MovementPattern } from '@/lib/dataset/movement-pattern';

const LOWER_PATTERNS: MovementPattern[] = ['squat', 'hinge', 'lunge'];

export function incrementFor(rule: ProgressionRule, pattern: MovementPattern): number {
  return LOWER_PATTERNS.includes(pattern) ? rule.incrementLowerKg : rule.incrementUpperKg;
}

export interface SetResult {
  reps: number;
  weightKg: number | null;
}

/**
 * Aplica el resultado de un ejercicio completado al estado de progresión.
 * - linear: si todas las series llegan a repsMin → +peso la próxima; si no, cuenta fallo.
 * - double: si todas las series llegan a repsMax → +peso y reps=repsMin; si llegan a reps
 *   objetivo → reps+1; si no, cuenta fallo.
 * Tras failThreshold fallos consecutivos → carga × backoffFactor y contador a cero.
 */
export function applyProgression(
  state: ExerciseProgressState,
  rule: ProgressionRule,
  pattern: MovementPattern,
  slot: { repsMin: number; repsMax: number },
  results: SetResult[],
): ExerciseProgressState {
  if (results.length === 0) return state;

  const increment = incrementFor(rule, pattern);
  const weight = state.weightKg ?? results.find((r) => r.weightKg != null)?.weightKg ?? null;

  const allAt = (target: number) => results.every((r) => r.reps >= target);

  if (rule.type === 'linear') {
    if (allAt(slot.repsMin)) {
      return {
        weightKg: weight != null ? round25(weight + increment) : null,
        reps: slot.repsMin,
        consecutiveFails: 0,
      };
    }
    return failed({ ...state, weightKg: weight }, rule);
  }

  // doble progresión
  if (allAt(slot.repsMax)) {
    const bumped = weight != null && increment > 0 ? round25(weight + increment) : weight;
    // sin carga externa (calistenia): al tocar techo, sube el suelo de reps
    const nextReps = weight != null && increment > 0 ? slot.repsMin : Math.min(state.reps + 1, slot.repsMax);
    return { weightKg: bumped, reps: nextReps, consecutiveFails: 0 };
  }
  if (allAt(Math.min(state.reps, slot.repsMax))) {
    return { weightKg: weight, reps: Math.min(state.reps + 1, slot.repsMax), consecutiveFails: 0 };
  }
  return failed({ ...state, weightKg: weight }, rule);
}

function failed(state: ExerciseProgressState, rule: ProgressionRule): ExerciseProgressState {
  const fails = state.consecutiveFails + 1;
  if (fails >= rule.failThreshold) {
    return {
      weightKg: state.weightKg != null ? round25(state.weightKg * rule.backoffFactor) : null,
      reps: state.reps,
      consecutiveFails: 0,
    };
  }
  return { ...state, consecutiveFails: fails };
}

/** Redondea a múltiplos de 2.5 kg (discos estándar); nunca por debajo de 0. */
export function round25(kg: number): number {
  return Math.max(0, Math.round(kg / 2.5) * 2.5);
}

/** true si la sesión número `completedSessions + 1` toca deload. */
export function isDeloadSession(config: MethodologyConfig, completedSessions: number): boolean {
  const n = config.deload.everySessions;
  return n > 0 && completedSessions > 0 && (completedSessions + 1) % n === 0;
}

export function initialProgressState(slot: { repsMin: number }): ExerciseProgressState {
  return { weightKg: null, reps: slot.repsMin, consecutiveFails: 0 };
}
