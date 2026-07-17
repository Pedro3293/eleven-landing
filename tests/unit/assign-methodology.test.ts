import { describe, expect, it } from 'vitest';
import { assignMethodology, rankMethodologies, closestDays } from '@/lib/engine/assign-methodology';
import { getMethodology, METHODOLOGIES } from '@/lib/engine/methodologies';
import type { ProfileInput } from '@/lib/engine/types';

const base: ProfileInput = {
  goal: 'hipertrofia',
  experience: 'intermedio',
  injuries: [],
  equipment: ['barbell', 'dumbbell', 'cable'],
  daysPerWeek: 4,
  minutesPerSession: 60,
};

describe('assignMethodology', () => {
  it('principiante con gimnasio → full-body lineal', () => {
    const m = assignMethodology({ ...base, experience: 'principiante', goal: 'fuerza', daysPerWeek: 3 });
    expect(m.methodology.id).toBe('fullbody-lineal');
  });

  it('sin material → calistenia', () => {
    const m = assignMethodology({ ...base, equipment: [], goal: 'salud_general' });
    expect(m.methodology.id).toBe('calistenia');
  });

  it('intermedio hipertrofia 5-6 días → ppl o volumen, nunca full-body de principiante', () => {
    const m = assignMethodology({ ...base, daysPerWeek: 6 });
    expect(['ppl', 'hipertrofia-volumen']).toContain(m.methodology.id);
  });

  it('devuelve razones explicables', () => {
    const m = assignMethodology(base);
    expect(m.reasons.length).toBeGreaterThan(0);
  });

  it('el ranking cubre todas las metodologías', () => {
    expect(rankMethodologies(base)).toHaveLength(METHODOLOGIES.length);
  });
});

describe('closestDays', () => {
  it('elige la frecuencia soportada más cercana', () => {
    const ul = getMethodology('upper-lower')!;
    expect(closestDays(ul, 3)).toBeOneOf([2, 4]);
    expect(closestDays(ul, 5)).toBe(4);
    expect(closestDays(ul, 1)).toBe(2);
  });
});
