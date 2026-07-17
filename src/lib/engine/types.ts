import type { MovementPattern } from '@/lib/dataset/movement-pattern';

export type Goal = 'fuerza' | 'hipertrofia' | 'perdida_grasa' | 'salud_general' | 'rendimiento';
export type Experience = 'principiante' | 'intermedio' | 'avanzado';
export type SlotRole = 'main' | 'secondary' | 'accessory' | 'core';
export type SetMode = 'straight' | 'emom' | 'amrap' | 'tabata' | 'tut';

/** Hueco de ejercicio dentro de un día de metodología. El generador lo rellena. */
export interface ExerciseSlot {
  role: SlotRole;
  /** Patrones aceptables por orden de preferencia. */
  patterns: MovementPattern[];
  /** Músculos objetivo preferidos (vocabulario `target` del dataset). */
  targets?: string[];
  preferCompound?: boolean;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  /** Tempo excéntrica-pausa-concéntrica, p.ej. "3-1-1" (implica trabajo TUT). */
  tempo?: string;
  mode?: SetMode;
  /** Duración total en segundos para emom/amrap/tabata/tut. */
  modeSeconds?: number;
  /** Se descarta primero si la sesión no cabe en el tiempo disponible. */
  optional?: boolean;
}

export interface MethodologyDay {
  key: string;
  title: string;
  slots: ExerciseSlot[];
}

export interface ProgressionRule {
  /** lineal: +peso cada sesión completada · doble: reps hasta repsMax, luego +peso y reset. */
  type: 'linear' | 'double';
  /** Incremento de carga para tren superior / inferior (kg). */
  incrementUpperKg: number;
  incrementLowerKg: number;
  /** Fallos consecutivos que fuerzan reducción de carga (reset parcial). */
  failThreshold: number;
  /** Factor aplicado a la carga tras failThreshold fallos (p.ej. 0.9). */
  backoffFactor: number;
}

export interface DeloadRule {
  /** Cada cuántas sesiones completadas toca semana/sesión de descarga. */
  everySessions: number;
  /** Factor sobre series (0.6 = 60% del volumen). */
  volumeFactor: number;
  /** Factor sobre carga sugerida. */
  intensityFactor: number;
}

export interface CheckInCadence {
  daily: boolean;
  weekly: boolean;
  /** Semanas por mesociclo (check-in de mesociclo con fotos/tests). */
  mesocycleWeeks: number;
}

export interface MethodologyConfig {
  id: string;
  name: string;
  description: string;
  /** Frecuencias semanales soportadas; el plan elige la más cercana a la del perfil. */
  daysPerWeekOptions: number[];
  /** Ciclo de días. Con más días/semana que días de ciclo, el ciclo se repite. */
  days: MethodologyDay[];
  progression: ProgressionRule;
  deload: DeloadRule;
  checkIns: CheckInCadence;
  /** Apta para estos objetivos (para la asignación automática). */
  goals: Goal[];
  experiences: Experience[];
  /** true si funciona sin material (calistenia). */
  bodyweightOnly?: boolean;
}

/** Estado de progresión persistido por ejercicio dentro de Plan.config. */
export interface ExerciseProgressState {
  weightKg: number | null;
  /** Objetivo de reps actual (progresión doble). */
  reps: number;
  consecutiveFails: number;
}

/** Estado del plan persistido en Plan.config (JSON). */
export interface PlanState {
  daysPerWeek: number;
  /** Ejercicio elegido por slot (dayKey:slotIndex → exerciseId) para consistencia entre sesiones. */
  slotExercises: Record<string, string>;
  /** Estado de progresión por exerciseId. */
  progress: Record<string, ExerciseProgressState>;
  /** Sesiones completadas (para ciclo de días y deload). */
  completedSessions: number;
}

export interface ProfileInput {
  goal: Goal;
  experience: Experience;
  injuries: string[];
  /** Condiciones de salud declaradas (claves de la base de conocimiento de salud). */
  healthConditions?: string[];
  equipment: string[];
  daysPerWeek: number;
  minutesPerSession: number;
  bodyweightKg?: number | null;
}

/** Feedback reciente que modula la generación. */
export interface RecentFeedback {
  /** RPE medio de las últimas sesiones (1-10). */
  avgRpe?: number;
  /** Zonas con molestias reportadas en check-ins recientes. */
  painZones?: string[];
  /** Energía media reciente (1-5). */
  avgEnergy?: number;
}

export interface GeneratedSet {
  targetReps: number;
  targetWeightKg: number | null;
}

export interface GeneratedExercise {
  exerciseId: string;
  slotIndex: number;
  role: SlotRole;
  pattern: MovementPattern;
  sets: number;
  repsMin: number;
  repsMax: number;
  targetWeightKg: number | null;
  restSeconds: number;
  tempo?: string;
  mode: SetMode;
  modeSeconds?: number;
}

export interface GeneratedSession {
  dayKey: string;
  title: string;
  seed: string;
  exercises: GeneratedExercise[];
  isDeload: boolean;
  /** Duración estimada en minutos. */
  estimatedMinutes: number;
}
