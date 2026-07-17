import { z } from 'zod';
import { INJURY_ZONES } from '@/lib/repository/injury-map';

export const GOALS = ['fuerza', 'hipertrofia', 'perdida_grasa', 'salud_general', 'rendimiento'] as const;
export const EXPERIENCES = ['principiante', 'intermedio', 'avanzado'] as const;

/** Equipamiento en vocabulario del dataset, agrupado para la UI. */
export const EQUIPMENT_OPTIONS: { key: string; label: string }[] = [
  { key: 'body weight', label: 'Peso corporal' },
  { key: 'dumbbell', label: 'Mancuernas' },
  { key: 'barbell', label: 'Barra y discos' },
  { key: 'ez barbell', label: 'Barra EZ' },
  { key: 'kettlebell', label: 'Kettlebell' },
  { key: 'band', label: 'Banda elástica' },
  { key: 'resistance band', label: 'Banda de resistencia' },
  { key: 'cable', label: 'Poleas' },
  { key: 'leverage machine', label: 'Máquinas de palanca' },
  { key: 'smith machine', label: 'Multipower' },
  { key: 'stability ball', label: 'Fitball' },
  { key: 'medicine ball', label: 'Balón medicinal' },
  { key: 'rope', label: 'Cuerda' },
  { key: 'wheel roller', label: 'Rueda abdominal' },
];

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, 'Dinos cómo llamarte').max(60),
  goal: z.enum(GOALS),
  experience: z.enum(EXPERIENCES),
  injuries: z.array(z.enum(INJURY_ZONES)).default([]),
  equipment: z.array(z.string().max(40)).max(30).default([]),
  daysPerWeek: z.number().int().min(1).max(7),
  minutesPerSession: z.number().int().min(15).max(240),
  bodyweightKg: z.number().min(25).max(400).nullish(),
  methodologyId: z.string().max(60).optional(),
});

export const finishSessionSchema = z.object({
  totalSeconds: z.number().int().min(0).max(24 * 3600).optional(),
  effectiveSeconds: z.number().int().min(0).max(24 * 3600).optional(),
  notes: z.string().max(2000).optional(),
});

export const logSetSchema = z.object({
  setIndex: z.number().int().min(0).max(50),
  reps: z.number().int().min(0).max(500),
  weightKg: z.number().min(0).max(1000).nullish(),
  rpe: z.number().min(1).max(10).nullish(),
  seconds: z.number().int().min(0).max(3600).nullish(),
  isWarmup: z.boolean().optional(),
});

export const substituteSchema = z.object({
  newExerciseId: z.string().max(10).optional(),
});

export const checkInSchema = z.object({
  type: z.enum(['daily', 'weekly', 'mesocycle']),
  data: z.object({
    energia: z.number().int().min(1).max(5).optional(),
    sueno: z.number().int().min(1).max(5).optional(),
    dolor: z.array(z.enum(INJURY_ZONES)).optional(),
    pesoKg: z.number().min(25).max(400).optional(),
    adherencia: z.number().int().min(1).max(5).optional(),
    medidas: z.record(z.string().max(30), z.number().min(0).max(400)).optional(),
    notas: z.string().max(1000).optional(),
  }),
});

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1).max(4000),
  context: z.string().max(120).default('global'),
});
