/**
 * Ajustes conservadores del generador según condiciones de salud declaradas (D-12).
 * Complementan (no sustituyen) el criterio médico: el detalle educativo vive en
 * la base de conocimiento y el agente lo comunica.
 */
import type { ExerciseDTO } from '@/lib/repository/exercise-repository';

export interface ConditionAdjustments {
  /** Multiplicador de descansos (≥1 = más descanso). */
  restFactor: number;
  /** Recorta una serie del trabajo no principal (mismo mecanismo que la fatiga alta). */
  conservativeVolume: boolean;
  /** Excluye ejercicios concretos incompatibles con alguna condición. */
  excludeExercise: (ex: ExerciseDTO) => boolean;
  /** Avisos breves para mostrar en la sesión generada. */
  notes: string[];
}

const LONGER_REST = new Set(['hipertension', 'cardiopatia']);
const LOWER_VOLUME = new Set(['hipotiroidismo', 'fibromialgia', 'anemia', 'embarazo', 'cardiopatia', 'hipertiroidismo']);

/** Flexión de columna con carga externa: contraindicada con osteoporosis. */
function isLoadedSpinalFlexion(ex: ExerciseDTO): boolean {
  return ex.movementPattern === 'core' && !['body weight', 'assisted'].includes(ex.equipment);
}

const CONDITION_NOTES: Record<string, string> = {
  hipertension: 'Hipertensión: espira en el esfuerzo (sin Valsalva) y respeta los descansos completos.',
  cardiopatia: 'Cardiopatía: mantente en las intensidades autorizadas por tu cardiólogo; para ante cualquier síntoma.',
  'diabetes-tipo-1': 'Diabetes tipo 1: mide la glucemia antes de empezar y ten carbohidrato rápido a mano.',
  'diabetes-tipo-2': 'Diabetes tipo 2: si usas insulina o sulfonilureas, vigila señales de hipoglucemia.',
  asma: 'Asma: calienta 10-15 min progresivos y ten el inhalador de rescate cerca.',
  osteoporosis: 'Osteoporosis: técnica impecable y sin flexiones de tronco con carga.',
  embarazo: 'Embarazo: RPE ≤7, sin Valsalva; cualquier señal de alarma, detente y consulta.',
  hipotiroidismo: 'Hipotiroidismo: autorregula por RPE; los días de fatiga alta, recorta sin culpa.',
  hipertiroidismo: 'Hipertiroidismo: vigila pulso y calor; progresión suave hasta control médico estable.',
  anemia: 'Anemia: intensidad moderada y descansos completos hasta corregir la causa.',
  fibromialgia: 'Fibromialgia: dosifica por debajo del límite; la consistencia gana a la intensidad.',
};

export function getConditionAdjustments(conditions: string[]): ConditionAdjustments {
  const set = new Set(conditions);
  const hasOsteoporosis = set.has('osteoporosis');
  return {
    restFactor: [...set].some((c) => LONGER_REST.has(c)) ? 1.25 : 1,
    conservativeVolume: [...set].some((c) => LOWER_VOLUME.has(c)),
    excludeExercise: (ex) => hasOsteoporosis && isLoadedSpinalFlexion(ex),
    notes: [...set].map((c) => CONDITION_NOTES[c]).filter(Boolean),
  };
}
