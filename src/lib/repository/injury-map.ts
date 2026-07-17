/**
 * Mapa de zonas de lesión (vocabulario de producto, ES) → músculos/zonas del dataset
 * que cargan esa estructura. Un ejercicio se excluye si su target, muscle_group o
 * secundarios tocan la zona, o si su patrón la estresa de forma directa.
 */
import type { MovementPattern } from '@/lib/dataset/movement-pattern';

export const INJURY_ZONES = [
  'hombro',
  'codo',
  'muñeca',
  'cuello',
  'espalda_baja',
  'espalda_alta',
  'cadera',
  'rodilla',
  'tobillo',
] as const;

export type InjuryZone = (typeof INJURY_ZONES)[number];

export const INJURY_ZONE_LABELS: Record<InjuryZone, string> = {
  hombro: 'Hombro',
  codo: 'Codo',
  muñeca: 'Muñeca',
  cuello: 'Cuello',
  espalda_baja: 'Espalda baja',
  espalda_alta: 'Espalda alta',
  cadera: 'Cadera',
  rodilla: 'Rodilla',
  tobillo: 'Tobillo',
};

interface InjuryRule {
  /** valores de target/muscle_group/secondary_muscles que implican la zona */
  muscles: string[];
  /** patrones que estresan la zona aunque el músculo no aparezca listado */
  patterns?: MovementPattern[];
}

export const INJURY_RULES: Record<InjuryZone, InjuryRule> = {
  hombro: {
    muscles: ['delts', 'deltoids', 'shoulders', 'rotator cuff', 'rear deltoids', 'serratus anterior', 'levator scapulae'],
    patterns: ['push_v'],
  },
  codo: {
    muscles: ['triceps', 'biceps', 'brachialis', 'forearms'],
  },
  muñeca: {
    muscles: ['wrists', 'wrist extensors', 'wrist flexors', 'hands', 'grip muscles', 'forearms'],
  },
  cuello: {
    muscles: ['sternocleidomastoid', 'levator scapulae', 'traps', 'trapezius'],
  },
  espalda_baja: {
    muscles: ['lower back', 'spine'],
    patterns: ['hinge'],
  },
  espalda_alta: {
    muscles: ['upper back', 'rhomboids', 'lats', 'latissimus dorsi', 'traps', 'trapezius', 'back'],
  },
  cadera: {
    muscles: ['hip flexors', 'glutes', 'abductors', 'adductors', 'groin', 'inner thighs'],
    patterns: ['hinge', 'lunge'],
  },
  rodilla: {
    muscles: ['quads', 'quadriceps', 'hamstrings'],
    patterns: ['squat', 'lunge'],
  },
  tobillo: {
    muscles: ['calves', 'soleus', 'ankles', 'ankle stabilizers', 'shins', 'feet'],
    patterns: ['cardio'],
  },
};

/** true si el ejercicio debe excluirse para las zonas lesionadas dadas. */
export function conflictsWithInjuries(
  ex: { target: string; muscleGroup: string; secondaryMuscles: string[]; movementPattern: MovementPattern },
  injuries: string[],
): boolean {
  for (const zone of injuries) {
    const rule = INJURY_RULES[zone as InjuryZone];
    if (!rule) continue;
    if (rule.patterns?.includes(ex.movementPattern)) return true;
    const muscles = [ex.target, ex.muscleGroup, ...ex.secondaryMuscles].map((m) => m.toLowerCase());
    if (muscles.some((m) => rule.muscles.includes(m))) return true;
  }
  return false;
}
