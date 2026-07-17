import { describe, expect, it } from 'vitest';
import { KNOWLEDGE_BASE, getConditionEntry, normalize, searchKnowledge } from '@/lib/ai/knowledge';
import { HEALTH_CONDITIONS } from '@/lib/schemas';
import { getConditionAdjustments } from '@/lib/engine/condition-adjustments';
import { makeExercise } from './helpers/memory-repository';

describe('base de conocimiento', () => {
  it('cubre las cuatro categorías con contenido sustancial', () => {
    for (const cat of ['ciencia', 'metodologia', 'acondicionamiento', 'salud'] as const) {
      const entries = KNOWLEDGE_BASE.filter((e) => e.category === cat);
      expect(entries.length).toBeGreaterThanOrEqual(4);
      for (const e of entries) expect(e.content.length).toBeGreaterThan(300);
    }
  });

  it('toda condición declarable del perfil tiene su entrada de salud', () => {
    for (const c of HEALTH_CONDITIONS) {
      if (c.key === 'artrosis' || c.key === 'lumbalgia') continue; // ids coinciden igualmente
      expect(getConditionEntry(c.key), c.key).toBeDefined();
    }
    expect(getConditionEntry('artrosis')).toBeDefined();
    expect(getConditionEntry('lumbalgia')).toBeDefined();
  });

  it('todas las entradas de salud derivan a profesionales', () => {
    for (const e of KNOWLEDGE_BASE.filter((e) => e.category === 'salud')) {
      expect(/deriva|consulta|médic|urgencias|profesional/i.test(e.content), e.id).toBe(true);
    }
  });
});

describe('searchKnowledge', () => {
  it('recupera condiciones por nombre natural con tildes', () => {
    expect(searchKnowledge('tengo hipotiroidismo, ¿cómo me afecta?')[0]?.id).toBe('hipotiroidismo');
    expect(searchKnowledge('soy diabético tipo 1 y uso insulina')[0]?.id).toBe('diabetes-tipo-1');
    expect(searchKnowledge('tensión alta')[0]?.id).toBe('hipertension');
  });

  it('recupera ciencia y metodología', () => {
    expect(searchKnowledge('cuánto volumen para hipertrofia')[0]?.id).toBe('hipertrofia');
    expect(searchKnowledge('qué es el RPE')[0]?.id).toBe('rpe-rir');
    expect(searchKnowledge('rutina push pull legs')[0]?.id).toBe('met-ppl');
    expect(searchKnowledge('qué es un emom', { category: 'acondicionamiento' })[0]?.id).toBe('hiit-modos');
  });

  it('filtra por categoría y devuelve vacío sin señal', () => {
    expect(searchKnowledge('hipotiroidismo', { category: 'metodologia' })).toHaveLength(0);
    expect(searchKnowledge('xyzzy prueba aleatoria')).toHaveLength(0);
  });

  it('normalize elimina tildes y signos', () => {
    expect(normalize('¿Cuánta TENSIÓN?')).toBe('cuanta tension');
  });
});

describe('getConditionAdjustments', () => {
  it('hipertensión alarga descansos; hipotiroidismo recorta volumen accesorio', () => {
    expect(getConditionAdjustments(['hipertension']).restFactor).toBeGreaterThan(1);
    expect(getConditionAdjustments(['hipotiroidismo']).conservativeVolume).toBe(true);
    expect(getConditionAdjustments([]).restFactor).toBe(1);
    expect(getConditionAdjustments([]).conservativeVolume).toBe(false);
  });

  it('osteoporosis excluye flexión de tronco con carga pero no el core corporal', () => {
    const adj = getConditionAdjustments(['osteoporosis']);
    const weightedCrunch = makeExercise({ movementPattern: 'core', equipment: 'cable' });
    const bwCrunch = makeExercise({ movementPattern: 'core', equipment: 'body weight' });
    const squat = makeExercise({ movementPattern: 'squat', equipment: 'barbell' });
    expect(adj.excludeExercise(weightedCrunch)).toBe(true);
    expect(adj.excludeExercise(bwCrunch)).toBe(false);
    expect(adj.excludeExercise(squat)).toBe(false);
  });

  it('genera notas visibles por condición', () => {
    const notes = getConditionAdjustments(['hipertension', 'asma']).notes;
    expect(notes.some((n) => n.includes('Valsalva'))).toBe(true);
    expect(notes.some((n) => n.includes('inhalador'))).toBe(true);
  });
});
