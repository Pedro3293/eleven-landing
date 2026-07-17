import type { MethodologyConfig } from '../types';

/** Calistenia progresiva: solo peso corporal (y banda de asistencia). */
export const calistenia: MethodologyConfig = {
  id: 'calistenia',
  name: 'Calistenia progresiva',
  description:
    'Entrena en cualquier parte con tu peso corporal. Progresas por repeticiones, tempo y variantes más exigentes. Ideal en casa o de viaje.',
  daysPerWeekOptions: [3, 4],
  goals: ['salud_general', 'fuerza', 'hipertrofia', 'perdida_grasa', 'rendimiento'],
  experiences: ['principiante', 'intermedio', 'avanzado'],
  bodyweightOnly: true,
  days: [
    {
      key: 'empuje-core',
      title: 'Empuje y core',
      slots: [
        { role: 'main', patterns: ['push_h'], preferCompound: true, sets: 4, repsMin: 6, repsMax: 12, restSeconds: 120 },
        { role: 'secondary', patterns: ['push_v', 'push_h'], sets: 3, repsMin: 6, repsMax: 12, restSeconds: 120, optional: true },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 20, restSeconds: 60 },
        { role: 'core', patterns: ['core'], mode: 'tut', modeSeconds: 45, sets: 3, repsMin: 1, repsMax: 1, restSeconds: 60, optional: true },
      ],
    },
    {
      key: 'tiron-pierna',
      title: 'Tirón y pierna',
      slots: [
        { role: 'main', patterns: ['pull_v', 'pull_h'], preferCompound: true, sets: 4, repsMin: 4, repsMax: 10, restSeconds: 150 },
        { role: 'main', patterns: ['squat', 'lunge'], preferCompound: true, sets: 4, repsMin: 10, repsMax: 20, restSeconds: 90 },
        { role: 'secondary', patterns: ['hinge'], sets: 3, repsMin: 10, repsMax: 15, restSeconds: 90, optional: true },
        { role: 'core', patterns: ['core'], sets: 3, repsMin: 10, repsMax: 20, restSeconds: 60, optional: true },
      ],
    },
    {
      key: 'circuito',
      title: 'Circuito metabólico',
      slots: [
        { role: 'main', patterns: ['cardio'], mode: 'tabata', modeSeconds: 240, sets: 8, repsMin: 1, repsMax: 1, restSeconds: 10 },
        { role: 'secondary', patterns: ['squat', 'lunge'], mode: 'amrap', modeSeconds: 360, sets: 1, repsMin: 10, repsMax: 15, restSeconds: 0 },
        { role: 'core', patterns: ['core'], mode: 'emom', modeSeconds: 360, sets: 6, repsMin: 8, repsMax: 12, restSeconds: 0, optional: true },
      ],
    },
  ],
  progression: { type: 'double', incrementUpperKg: 0, incrementLowerKg: 0, failThreshold: 3, backoffFactor: 1 },
  deload: { everySessions: 15, volumeFactor: 0.6, intensityFactor: 1 },
  checkIns: { daily: false, weekly: true, mesocycleWeeks: 6 },
};
