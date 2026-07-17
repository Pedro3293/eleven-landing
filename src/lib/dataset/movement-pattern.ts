/**
 * Clasificación heurística de patrón de movimiento a partir de los campos del dataset.
 * El motor de metodologías selecciona ejercicios por patrón, no por nombre.
 */

export type MovementPattern =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'push_h'
  | 'push_v'
  | 'pull_h'
  | 'pull_v'
  | 'core'
  | 'isolation'
  | 'cardio'
  | 'carry';

export interface DatasetExerciseLike {
  name: string;
  category: string;
  target: string;
  muscleGroup?: string;
  equipment: string;
}

const COMPOUND_PATTERNS: MovementPattern[] = [
  'squat', 'hinge', 'lunge', 'push_h', 'push_v', 'pull_h', 'pull_v', 'carry',
];

export function classifyMovementPattern(ex: DatasetExerciseLike): MovementPattern {
  const name = ex.name.toLowerCase();
  const target = (ex.target || '').toLowerCase();
  const category = (ex.category || '').toLowerCase();

  if (category === 'cardio' || /\b(run|running|sprint|jump rope|jacks|bike|elliptical|stepmill|ski ?erg|ergometer|burpee|mountain climber|high knees)\b/.test(name)) {
    return 'cardio';
  }
  if (/\b(farmer'?s? walk|carry|suitcase walk)\b/.test(name)) return 'carry';

  // Piernas
  if (/\b(lunge|split squat|step[ -]?up)\b/.test(name)) return 'lunge';
  if (/\b(squat|leg press|hack)\b/.test(name) && !/\bcalf\b/.test(name)) return 'squat';
  if (/\b(deadlift|good morning|hip thrust|hip raise|glute bridge|bridge|swing|rack pull|hyperextension|back extension|pull through|clean|snatch)\b/.test(name)) {
    return 'hinge';
  }

  // Core
  if (category === 'waist' || ['abs', 'obliques', 'spine'].includes(target)) return 'core';
  if (/\b(crunch|sit[ -]?up|plank|leg raise|knee raise|russian twist|rollout|dead bug|bird dog|v-up|scissors|flutter)\b/.test(name)) {
    return 'core';
  }

  // Tirones
  if (/\b(pull[ -]?up|chin[ -]?up|pulldown|pull[ -]?down)\b/.test(name)) return 'pull_v';
  if (/\b(row|face pull|rear delt|shrug|reverse fly)\b/.test(name)) return 'pull_h';

  // Empujes
  if (/\b(bench press|chest press|push[ -]?up|dip|fly|crossover|pullover|floor press)\b/.test(name) || target === 'pectorals') {
    // aperturas y pullover son de aislamiento, pero mantienen dirección de empuje horizontal
    if (/\b(fly|crossover|pullover)\b/.test(name)) return 'isolation';
    return 'push_h';
  }
  if (/\b(shoulder press|military press|overhead press|push press|arnold press|lateral raise|front raise)\b/.test(name) || target === 'delts') {
    if (/\braise\b/.test(name)) return 'isolation';
    return 'push_v';
  }

  return 'isolation';
}

export function isCompound(pattern: MovementPattern): boolean {
  return COMPOUND_PATTERNS.includes(pattern);
}
