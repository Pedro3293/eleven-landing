import type { MethodologyConfig } from '../types';

/** Hipertrofia por volumen con doble progresión y trabajo bajo tensión. */
export const hipertrofiaVolumen: MethodologyConfig = {
  id: 'hipertrofia-volumen',
  name: 'Hipertrofia por volumen',
  description:
    'Volumen alto por grupo muscular con doble progresión: primero subes repeticiones, luego carga. Tempo controlado y descansos cortos para maximizar el estímulo.',
  daysPerWeekOptions: [3, 4, 5],
  goals: ['hipertrofia', 'perdida_grasa'],
  experiences: ['intermedio', 'avanzado'],
  days: [
    {
      key: 'pecho-espalda',
      title: 'Pecho y espalda',
      slots: [
        { role: 'main', patterns: ['push_h'], preferCompound: true, sets: 4, repsMin: 8, repsMax: 12, restSeconds: 105, tempo: '3-0-1' },
        { role: 'main', patterns: ['pull_h'], preferCompound: true, sets: 4, repsMin: 8, repsMax: 12, restSeconds: 105, tempo: '3-0-1' },
        { role: 'accessory', patterns: ['isolation'], targets: ['pectorals'], sets: 3, repsMin: 12, repsMax: 15, restSeconds: 75, tempo: '3-1-1' },
        { role: 'accessory', patterns: ['isolation', 'pull_v'], targets: ['lats', 'upper back'], sets: 3, repsMin: 12, repsMax: 15, restSeconds: 75, optional: true },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 12, repsMax: 20, restSeconds: 60, optional: true },
      ],
    },
    {
      key: 'pierna',
      title: 'Pierna completa',
      slots: [
        { role: 'main', patterns: ['squat'], preferCompound: true, sets: 4, repsMin: 8, repsMax: 12, restSeconds: 120, tempo: '3-0-1' },
        { role: 'secondary', patterns: ['hinge'], preferCompound: true, sets: 3, repsMin: 10, repsMax: 12, restSeconds: 120 },
        { role: 'accessory', patterns: ['isolation'], targets: ['quads', 'hamstrings'], sets: 3, repsMin: 12, repsMax: 15, restSeconds: 90, tempo: '3-1-1' },
        { role: 'accessory', patterns: ['isolation'], targets: ['calves'], sets: 4, repsMin: 15, repsMax: 20, restSeconds: 60, optional: true },
        { role: 'accessory', patterns: ['lunge'], sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90, optional: true },
      ],
    },
    {
      key: 'hombro-brazo',
      title: 'Hombro y brazo',
      slots: [
        { role: 'main', patterns: ['push_v'], preferCompound: true, sets: 4, repsMin: 8, repsMax: 12, restSeconds: 105 },
        { role: 'accessory', patterns: ['isolation'], targets: ['delts'], sets: 4, repsMin: 12, repsMax: 15, restSeconds: 75, tempo: '2-1-1' },
        { role: 'accessory', patterns: ['isolation'], targets: ['biceps'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75 },
        { role: 'accessory', patterns: ['isolation'], targets: ['triceps'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 75 },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 12, repsMax: 20, restSeconds: 60, optional: true },
      ],
    },
  ],
  progression: { type: 'double', incrementUpperKg: 2, incrementLowerKg: 4, failThreshold: 2, backoffFactor: 0.92 },
  deload: { everySessions: 15, volumeFactor: 0.5, intensityFactor: 0.8 },
  checkIns: { daily: true, weekly: true, mesocycleWeeks: 5 },
};
