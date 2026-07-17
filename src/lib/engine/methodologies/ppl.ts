import type { MethodologyConfig } from '../types';

/** Push / Pull / Legs con doble progresión. */
export const ppl: MethodologyConfig = {
  id: 'ppl',
  name: 'Push · Pull · Legs',
  description:
    'El split clásico de empuje, tirón y pierna. Cada músculo se trabaja con volumen alto y una frecuencia que escala con tus días disponibles (3 a 6 por semana).',
  daysPerWeekOptions: [3, 4, 5, 6],
  goals: ['hipertrofia', 'fuerza', 'rendimiento'],
  experiences: ['intermedio', 'avanzado'],
  days: [
    {
      key: 'push',
      title: 'Empuje',
      slots: [
        { role: 'main', patterns: ['push_h'], preferCompound: true, sets: 4, repsMin: 6, repsMax: 10, restSeconds: 150 },
        { role: 'secondary', patterns: ['push_v'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120 },
        { role: 'accessory', patterns: ['isolation'], targets: ['pectorals'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 90 },
        { role: 'accessory', patterns: ['isolation'], targets: ['delts'], sets: 3, repsMin: 12, repsMax: 15, restSeconds: 75, optional: true },
        { role: 'accessory', patterns: ['isolation'], targets: ['triceps'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75, optional: true },
      ],
    },
    {
      key: 'pull',
      title: 'Tirón',
      slots: [
        { role: 'main', patterns: ['pull_v'], preferCompound: true, sets: 4, repsMin: 6, repsMax: 10, restSeconds: 150 },
        { role: 'secondary', patterns: ['pull_h'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120 },
        { role: 'accessory', patterns: ['isolation', 'pull_h'], targets: ['upper back', 'traps'], sets: 3, repsMin: 12, repsMax: 15, restSeconds: 90, optional: true },
        { role: 'accessory', patterns: ['isolation'], targets: ['biceps'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75 },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, optional: true },
      ],
    },
    {
      key: 'legs',
      title: 'Pierna',
      slots: [
        { role: 'main', patterns: ['squat'], preferCompound: true, sets: 4, repsMin: 6, repsMax: 10, restSeconds: 180 },
        { role: 'secondary', patterns: ['hinge'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 150 },
        { role: 'accessory', patterns: ['lunge'], sets: 3, repsMin: 10, repsMax: 12, restSeconds: 120, optional: true },
        { role: 'accessory', patterns: ['isolation'], targets: ['hamstrings', 'quads'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 90 },
        { role: 'accessory', patterns: ['isolation'], targets: ['calves'], sets: 4, repsMin: 12, repsMax: 20, restSeconds: 60, optional: true },
      ],
    },
  ],
  progression: { type: 'double', incrementUpperKg: 2.5, incrementLowerKg: 5, failThreshold: 2, backoffFactor: 0.9 },
  deload: { everySessions: 18, volumeFactor: 0.5, intensityFactor: 0.85 },
  checkIns: { daily: false, weekly: true, mesocycleWeeks: 6 },
};
