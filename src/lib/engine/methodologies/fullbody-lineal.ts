import type { MethodologyConfig } from '../types';

/** Full-Body para principiantes con progresión lineal clásica. */
export const fullbodyLineal: MethodologyConfig = {
  id: 'fullbody-lineal',
  name: 'Full-Body progresión lineal',
  description:
    'Tres sesiones de cuerpo completo por semana alrededor de los básicos. Añades peso cada sesión que completas: la forma más rápida de progresar cuando empiezas.',
  daysPerWeekOptions: [2, 3],
  goals: ['fuerza', 'salud_general', 'hipertrofia', 'perdida_grasa'],
  experiences: ['principiante'],
  days: [
    {
      key: 'fullbody-a',
      title: 'Cuerpo completo A',
      slots: [
        { role: 'main', patterns: ['squat'], preferCompound: true, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 150 },
        { role: 'main', patterns: ['push_h'], preferCompound: true, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 150 },
        { role: 'secondary', patterns: ['pull_h'], preferCompound: true, sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120 },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, optional: true },
      ],
    },
    {
      key: 'fullbody-b',
      title: 'Cuerpo completo B',
      slots: [
        { role: 'main', patterns: ['hinge'], preferCompound: true, sets: 3, repsMin: 5, repsMax: 8, restSeconds: 180 },
        { role: 'main', patterns: ['push_v', 'push_h'], preferCompound: true, sets: 3, repsMin: 6, repsMax: 10, restSeconds: 150 },
        { role: 'secondary', patterns: ['pull_v', 'pull_h'], preferCompound: true, sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60, optional: true },
      ],
    },
  ],
  progression: { type: 'linear', incrementUpperKg: 2.5, incrementLowerKg: 5, failThreshold: 3, backoffFactor: 0.9 },
  deload: { everySessions: 12, volumeFactor: 0.6, intensityFactor: 0.85 },
  checkIns: { daily: false, weekly: true, mesocycleWeeks: 8 },
};
