import { describe, expect, it } from 'vitest';
import { generateSession, effectiveEquipment, estimateMinutes } from '@/lib/engine/session-generator';
import { fullbodyLineal } from '@/lib/engine/methodologies/fullbody-lineal';
import { ppl } from '@/lib/engine/methodologies/ppl';
import { calistenia } from '@/lib/engine/methodologies/calistenia';
import type { PlanState, ProfileInput } from '@/lib/engine/types';
import { MemoryRepository, makeCatalog } from './helpers/memory-repository';

const repo = new MemoryRepository(makeCatalog());

const baseProfile: ProfileInput = {
  goal: 'hipertrofia',
  experience: 'intermedio',
  injuries: [],
  equipment: ['barbell', 'dumbbell', 'cable', 'leverage machine'],
  daysPerWeek: 3,
  minutesPerSession: 75,
};

const emptyState = (): PlanState => ({
  daysPerWeek: 3,
  slotExercises: {},
  progress: {},
  completedSessions: 0,
});

describe('generateSession — determinismo', () => {
  it('misma semilla y estado ⇒ sesión idéntica', async () => {
    const input = { config: ppl, profile: baseProfile, state: emptyState(), seed: 'plan1:1', sessionIndex: 1 };
    const a = await generateSession(repo, input);
    const b = await generateSession(repo, input);
    expect(a).toEqual(b);
  });

  it('semillas distintas pueden variar la selección pero nunca el esquema', async () => {
    const a = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 's1', sessionIndex: 1 });
    const b = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 's2', sessionIndex: 1 });
    expect(a.exercises.map((e) => e.role)).toEqual(b.exercises.map((e) => e.role));
  });

  it('recorre el ciclo de días con el índice de sesión', async () => {
    const s1 = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'x', sessionIndex: 1 });
    const s2 = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'x', sessionIndex: 2 });
    const s4 = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'x', sessionIndex: 4 });
    expect(s1.dayKey).toBe('push');
    expect(s2.dayKey).toBe('pull');
    expect(s4.dayKey).toBe('push');
  });
});

describe('generateSession — filtros', () => {
  it('solo usa equipamiento disponible', async () => {
    const profile = { ...baseProfile, equipment: [] };
    const s = await generateSession(repo, { config: fullbodyLineal, profile, state: emptyState(), seed: 'q', sessionIndex: 1 });
    const exs = await repo.getByIds(s.exercises.map((e) => e.exerciseId));
    for (const e of exs) expect(e.equipment).toBe('body weight');
  });

  it('excluye ejercicios que cargan zonas lesionadas', async () => {
    const profile = { ...baseProfile, injuries: ['hombro'] };
    const s = await generateSession(repo, { config: ppl, profile, state: emptyState(), seed: 'q', sessionIndex: 1 });
    const exs = await repo.getByIds(s.exercises.map((e) => e.exerciseId));
    for (const e of exs) {
      expect(e.movementPattern).not.toBe('push_v');
      expect(['delts', 'shoulders', 'deltoids']).not.toContain(e.target);
    }
  });

  it('las molestias del feedback reciente también excluyen', async () => {
    const s = await generateSession(repo, {
      config: ppl,
      profile: baseProfile,
      state: emptyState(),
      seed: 'q',
      sessionIndex: 3, // pierna
      feedback: { painZones: ['rodilla'] },
    });
    const exs = await repo.getByIds(s.exercises.map((e) => e.exerciseId));
    for (const e of exs) {
      expect(['squat', 'lunge']).not.toContain(e.movementPattern);
      expect(['quads', 'quadriceps', 'hamstrings']).not.toContain(e.target);
    }
  });

  it('no repite el mismo ejercicio dentro de una sesión', async () => {
    const s = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'q', sessionIndex: 1 });
    const ids = s.exercises.map((e) => e.exerciseId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('calistenia se limita a peso corporal aunque haya gimnasio', async () => {
    const s = await generateSession(repo, { config: calistenia, profile: baseProfile, state: emptyState(), seed: 'q', sessionIndex: 2 });
    const exs = await repo.getByIds(s.exercises.map((e) => e.exerciseId));
    for (const e of exs) expect(e.equipment).toBe('body weight');
  });
});

describe('generateSession — consistencia y progresión aplicada', () => {
  it('reutiliza el ejercicio del slot si sigue siendo viable', async () => {
    const state = emptyState();
    state.slotExercises['push:0'] = 'ph-db';
    const s = await generateSession(repo, { config: ppl, profile: baseProfile, state, seed: 'otra', sessionIndex: 1 });
    expect(s.exercises[0].exerciseId).toBe('ph-db');
  });

  it('abandona el ejercicio del slot si ya no hay equipamiento', async () => {
    const state = emptyState();
    state.slotExercises['fullbody-a:0'] = 'sq-bb';
    const profile = { ...baseProfile, equipment: ['dumbbell'] };
    const s = await generateSession(repo, { config: fullbodyLineal, profile, state, seed: 'z', sessionIndex: 1 });
    expect(s.exercises[0].exerciseId).not.toBe('sq-bb');
  });

  it('usa la carga del estado de progresión', async () => {
    const state = emptyState();
    state.slotExercises['fullbody-a:0'] = 'sq-bb';
    state.progress['sq-bb'] = { weightKg: 80, reps: 5, consecutiveFails: 0 };
    const s = await generateSession(repo, { config: fullbodyLineal, profile: baseProfile, state, seed: 'z', sessionIndex: 1 });
    expect(s.exercises[0].targetWeightKg).toBe(80);
  });
});

describe('generateSession — deload y autorregulación', () => {
  it('aplica deload en la sesión que toca (volumen e intensidad)', async () => {
    const state = emptyState();
    state.completedSessions = 11; // deload cada 12 → la sesión 12 es descarga (día B del ciclo)
    state.slotExercises['fullbody-b:0'] = 'hg-bb';
    state.progress['hg-bb'] = { weightKg: 100, reps: 5, consecutiveFails: 0 };
    const s = await generateSession(repo, { config: fullbodyLineal, profile: baseProfile, state, seed: 'd', sessionIndex: 12 });
    expect(s.isDeload).toBe(true);
    expect(s.title).toContain('Descarga');
    expect(s.exercises[0].sets).toBe(Math.max(1, Math.round(3 * 0.6)));
    expect(s.exercises[0].targetWeightKg).toBe(85); // 100 × 0.85
  });

  it('con RPE alto recorta series accesorias pero no el trabajo principal', async () => {
    const normal = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'f', sessionIndex: 1 });
    const fatigued = await generateSession(repo, { config: ppl, profile: baseProfile, state: emptyState(), seed: 'f', sessionIndex: 1, feedback: { avgRpe: 9.5 } });
    const mainN = normal.exercises.find((e) => e.role === 'main')!;
    const mainF = fatigued.exercises.find((e) => e.role === 'main')!;
    expect(mainF.sets).toBe(mainN.sets);
    const accN = normal.exercises.filter((e) => e.role !== 'main');
    const accF = fatigued.exercises.filter((e) => e.role !== 'main');
    expect(accF.reduce((s, e) => s + e.sets, 0)).toBeLessThan(accN.reduce((s, e) => s + e.sets, 0));
  });
});

describe('generateSession — presupuesto de tiempo', () => {
  it('descarta slots opcionales cuando la sesión no cabe', async () => {
    const short = { ...baseProfile, minutesPerSession: 30 };
    const long = { ...baseProfile, minutesPerSession: 120 };
    const sShort = await generateSession(repo, { config: ppl, profile: short, state: emptyState(), seed: 't', sessionIndex: 1 });
    const sLong = await generateSession(repo, { config: ppl, profile: long, state: emptyState(), seed: 't', sessionIndex: 1 });
    expect(sShort.exercises.length).toBeLessThan(sLong.exercises.length);
    // los principales nunca se descartan
    expect(sShort.exercises.some((e) => e.role === 'main')).toBe(true);
  });

  it('estimateMinutes cuenta modos por tiempo con su duración', () => {
    const mins = estimateMinutes([
      { exerciseId: 'x', slotIndex: 0, role: 'main', pattern: 'cardio', sets: 8, repsMin: 1, repsMax: 1, targetWeightKg: null, restSeconds: 10, mode: 'tabata', modeSeconds: 240 },
    ]);
    expect(mins).toBe(Math.round((240 + 90) / 60));
  });
});

describe('effectiveEquipment', () => {
  it('siempre incluye peso corporal', () => {
    expect(effectiveEquipment(ppl, { ...baseProfile, equipment: ['barbell'] })).toContain('body weight');
  });
});
