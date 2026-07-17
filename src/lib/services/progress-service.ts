/** Agregaciones para los dashboards de progreso (DESCRIBE §4.6). */
import { prisma } from '@/lib/db';

const WEEK_MS = 7 * 24 * 3600 * 1000;

function weekStart(d: Date): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // lunes=0
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export interface MuscleVolumeRow {
  muscleGroup: string;
  sets: number;
  volumeKg: number;
}

/** Series efectivas y volumen (kg×reps) por grupo muscular en las últimas `weeks` semanas. */
export async function volumeByMuscleGroup(userId: string, weeks = 4): Promise<MuscleVolumeRow[]> {
  const since = new Date(Date.now() - weeks * WEEK_MS);
  const logs = await prisma.setLog.findMany({
    where: { completedAt: { gte: since }, isWarmup: false, sessionExercise: { session: { userId, status: 'completed' } } },
    include: { sessionExercise: { include: { exercise: { select: { muscleGroup: true } } } } },
  });
  const acc = new Map<string, { sets: number; volumeKg: number }>();
  for (const l of logs) {
    const mg = l.sessionExercise.exercise.muscleGroup;
    const row = acc.get(mg) ?? { sets: 0, volumeKg: 0 };
    row.sets += 1;
    row.volumeKg += (l.weightKg ?? 0) * l.reps;
    acc.set(mg, row);
  }
  return [...acc.entries()]
    .map(([muscleGroup, v]) => ({ muscleGroup, ...v }))
    .sort((a, b) => b.sets - a.sets)
    .slice(0, 10);
}

export interface LoadPoint {
  date: string;
  topSetKg: number;
}

export interface LoadSeries {
  exerciseId: string;
  name: string;
  points: LoadPoint[];
}

/** Progresión de la mejor serie (kg) por ejercicio, para los `top` ejercicios más entrenados con carga. */
export async function loadProgression(userId: string, top = 4): Promise<LoadSeries[]> {
  const logs = await prisma.setLog.findMany({
    where: { isWarmup: false, weightKg: { gt: 0 }, sessionExercise: { session: { userId, status: 'completed' } } },
    include: {
      sessionExercise: {
        include: { exercise: { select: { id: true, name: true } }, session: { select: { finishedAt: true } } },
      },
    },
    orderBy: { completedAt: 'asc' },
  });

  const byExercise = new Map<string, { name: string; byDay: Map<string, number> }>();
  for (const l of logs) {
    const ex = l.sessionExercise.exercise;
    const date = (l.sessionExercise.session.finishedAt ?? l.completedAt).toISOString().slice(0, 10);
    const entry = byExercise.get(ex.id) ?? { name: ex.name, byDay: new Map() };
    entry.byDay.set(date, Math.max(entry.byDay.get(date) ?? 0, l.weightKg!));
    byExercise.set(ex.id, entry);
  }

  return [...byExercise.entries()]
    .map(([exerciseId, e]) => ({
      exerciseId,
      name: e.name,
      points: [...e.byDay.entries()].map(([date, topSetKg]) => ({ date, topSetKg })).sort((a, b) => a.date.localeCompare(b.date)),
    }))
    .sort((a, b) => b.points.length - a.points.length)
    .slice(0, top);
}

export interface AdherenceRow {
  week: string;
  completed: number;
  target: number;
}

/** Sesiones completadas por semana frente al objetivo del plan. */
export async function adherence(userId: string, weeks = 6): Promise<AdherenceRow[]> {
  const profile = await prisma.profile.findUnique({ where: { userId }, select: { daysPerWeek: true } });
  const target = profile?.daysPerWeek ?? 3;
  const since = weekStart(new Date(Date.now() - (weeks - 1) * WEEK_MS));
  const sessions = await prisma.session.findMany({
    where: { userId, status: 'completed', finishedAt: { gte: since } },
    select: { finishedAt: true },
  });
  const rows: AdherenceRow[] = [];
  for (let i = 0; i < weeks; i++) {
    const start = new Date(since.getTime() + i * WEEK_MS);
    const end = new Date(start.getTime() + WEEK_MS);
    const completed = sessions.filter((s) => s.finishedAt! >= start && s.finishedAt! < end).length;
    rows.push({ week: weekLabel(start), completed, target });
  }
  return rows;
}

export interface MetricPoint {
  date: string;
  value: number;
}

/** Evolución del peso corporal desde los check-ins (y el peso inicial del perfil). */
export async function bodyweightSeries(userId: string): Promise<MetricPoint[]> {
  const checkIns = await prisma.checkIn.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { date: true, data: true },
  });
  const points: MetricPoint[] = [];
  for (const c of checkIns) {
    try {
      const data = JSON.parse(c.data) as { pesoKg?: number };
      if (typeof data.pesoKg === 'number') {
        points.push({ date: c.date.toISOString().slice(0, 10), value: data.pesoKg });
      }
    } catch {
      // formato antiguo
    }
  }
  return points;
}

/** Racha: semanas seguidas (hasta hoy) cumpliendo el objetivo de sesiones. */
export async function currentStreak(userId: string): Promise<number> {
  const rows = await adherence(userId, 12);
  let streak = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i].completed >= rows[i].target) streak++;
    else if (i < rows.length - 1) break; // la semana en curso puede estar incompleta sin romper la racha
  }
  return streak;
}
