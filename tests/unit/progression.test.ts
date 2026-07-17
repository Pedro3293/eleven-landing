import { describe, expect, it } from 'vitest';
import { applyProgression, initialProgressState, isDeloadSession, round25 } from '@/lib/engine/progression';
import { fullbodyLineal } from '@/lib/engine/methodologies/fullbody-lineal';
import type { ProgressionRule } from '@/lib/engine/types';

const linear: ProgressionRule = { type: 'linear', incrementUpperKg: 2.5, incrementLowerKg: 5, failThreshold: 3, backoffFactor: 0.9 };
const double: ProgressionRule = { type: 'double', incrementUpperKg: 2.5, incrementLowerKg: 5, failThreshold: 2, backoffFactor: 0.9 };
const slot = { repsMin: 5, repsMax: 8 };

describe('progresión lineal', () => {
  it('suma peso al completar (más en tren inferior)', () => {
    const s = { weightKg: 60, reps: 5, consecutiveFails: 0 };
    const done = [{ reps: 5, weightKg: 60 }, { reps: 5, weightKg: 60 }, { reps: 6, weightKg: 60 }];
    expect(applyProgression(s, linear, 'push_h', slot, done).weightKg).toBe(62.5);
    expect(applyProgression(s, linear, 'squat', slot, done).weightKg).toBe(65);
  });

  it('acumula fallos sin tocar la carga hasta el umbral', () => {
    const fail = [{ reps: 4, weightKg: 60 }, { reps: 3, weightKg: 60 }];
    let s: import('@/lib/engine/types').ExerciseProgressState = { weightKg: 60, reps: 5, consecutiveFails: 0 };
    s = applyProgression(s, linear, 'squat', slot, fail);
    expect(s).toMatchObject({ weightKg: 60, consecutiveFails: 1 });
    s = applyProgression(s, linear, 'squat', slot, fail);
    expect(s.consecutiveFails).toBe(2);
    s = applyProgression(s, linear, 'squat', slot, fail);
    // tercer fallo consecutivo → backoff 0.9 y contador a cero
    expect(s.weightKg).toBe(round25(60 * 0.9));
    expect(s.consecutiveFails).toBe(0);
  });

  it('un éxito resetea el contador de fallos', () => {
    const s = { weightKg: 60, reps: 5, consecutiveFails: 2 };
    const done = [{ reps: 5, weightKg: 60 }, { reps: 5, weightKg: 60 }];
    expect(applyProgression(s, linear, 'squat', slot, done).consecutiveFails).toBe(0);
  });
});

describe('doble progresión', () => {
  it('sube reps objetivo mientras no toque techo', () => {
    const s = { weightKg: 20, reps: 5, consecutiveFails: 0 };
    const done = [{ reps: 5, weightKg: 20 }, { reps: 5, weightKg: 20 }];
    const next = applyProgression(s, double, 'push_h', slot, done);
    expect(next).toMatchObject({ weightKg: 20, reps: 6 });
  });

  it('al tocar repsMax en todas las series: +peso y reps al mínimo', () => {
    const s = { weightKg: 20, reps: 8, consecutiveFails: 0 };
    const done = [{ reps: 8, weightKg: 20 }, { reps: 9, weightKg: 20 }];
    const next = applyProgression(s, double, 'push_h', slot, done);
    expect(next).toMatchObject({ weightKg: 22.5, reps: 5 });
  });

  it('sin carga externa (calistenia) progresa solo por reps', () => {
    const bw: ProgressionRule = { ...double, incrementUpperKg: 0, incrementLowerKg: 0 };
    const s = { weightKg: null, reps: 8, consecutiveFails: 0 };
    const done = [{ reps: 8, weightKg: null }, { reps: 8, weightKg: null }];
    const next = applyProgression(s, bw, 'push_h', slot, done);
    expect(next.weightKg).toBeNull();
    expect(next.reps).toBe(8); // techo del slot alcanzado: mantiene (variante superior vía sustitución)
  });

  it('captura la carga usada la primera vez que se registra', () => {
    const s = initialProgressState(slot);
    const done = [{ reps: 5, weightKg: 40 }, { reps: 5, weightKg: 40 }];
    const next = applyProgression(s, double, 'push_h', slot, done);
    expect(next.weightKg).toBe(40);
  });
});

describe('deload', () => {
  it('marca deload exactamente cada everySessions', () => {
    // everySessions=12 → la 12ª sesión (11 completadas) es descarga
    expect(isDeloadSession(fullbodyLineal, 11)).toBe(true);
    expect(isDeloadSession(fullbodyLineal, 10)).toBe(false);
    expect(isDeloadSession(fullbodyLineal, 0)).toBe(false);
    expect(isDeloadSession(fullbodyLineal, 23)).toBe(true);
  });
});

describe('round25', () => {
  it('redondea a múltiplos de 2.5 y no baja de 0', () => {
    expect(round25(61.3)).toBe(62.5);
    expect(round25(61.2)).toBe(60);
    expect(round25(58.7)).toBe(57.5);
    expect(round25(-3)).toBe(0);
  });
});
