import type { MethodologyConfig } from '../types';

/** Torso / Pierna, equilibrio entre fuerza e hipertrofia. */
export const upperLower: MethodologyConfig = {
  id: 'upper-lower',
  name: 'Torso · Pierna',
  description:
    'Alternas días de torso y de pierna. Frecuencia 2 por músculo con sesiones compactas: el mejor equilibrio fuerza-hipertrofia con 4 días.',
  daysPerWeekOptions: [2, 4],
  goals: ['fuerza', 'hipertrofia', 'rendimiento', 'salud_general'],
  experiences: ['intermedio', 'avanzado'],
  days: [
    {
      key: 'upper',
      title: 'Torso',
      slots: [
        { role: 'main', patterns: ['push_h'], preferCompound: true, sets: 4, repsMin: 5, repsMax: 8, restSeconds: 180 },
        { role: 'main', patterns: ['pull_h'], preferCompound: true, sets: 4, repsMin: 6, repsMax: 10, restSeconds: 150 },
        { role: 'secondary', patterns: ['push_v'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120, optional: true },
        { role: 'secondary', patterns: ['pull_v'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120 },
        { role: 'accessory', patterns: ['isolation'], targets: ['biceps', 'triceps'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75, optional: true },
      ],
    },
    {
      key: 'lower',
      title: 'Pierna',
      slots: [
        { role: 'main', patterns: ['squat'], preferCompound: true, sets: 4, repsMin: 5, repsMax: 8, restSeconds: 180 },
        { role: 'main', patterns: ['hinge'], preferCompound: true, sets: 3, repsMin: 6, repsMax: 10, restSeconds: 180 },
        { role: 'secondary', patterns: ['lunge'], sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120, optional: true },
        { role: 'accessory', patterns: ['isolation'], targets: ['calves', 'hamstrings'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75 },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, optional: true },
      ],
    },
  ],
  progression: { type: 'double', incrementUpperKg: 2.5, incrementLowerKg: 5, failThreshold: 2, backoffFactor: 0.9 },
  deload: { everySessions: 16, volumeFactor: 0.6, intensityFactor: 0.85 },
  checkIns: { daily: false, weekly: true, mesocycleWeeks: 6 },
};
