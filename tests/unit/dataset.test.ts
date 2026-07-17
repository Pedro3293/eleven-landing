import { describe, expect, it } from 'vitest';
import { translateExerciseName } from '@/lib/dataset/translate-name';
import { classifyMovementPattern, isCompound } from '@/lib/dataset/movement-pattern';
import { conflictsWithInjuries } from '@/lib/repository/injury-map';

describe('translateExerciseName', () => {
  it('traduce movimientos núcleo con equipamiento como sufijo', () => {
    expect(translateExerciseName('barbell bench press', 'barbell')).toBe('Press de banca con barra');
    expect(translateExerciseName('dumbbell bent over row', 'dumbbell')).toBe('Remo inclinado con mancuernas');
    expect(translateExerciseName('cable lat pulldown', 'cable')).toBe('Jalón al pecho en polea');
  });

  it('no confunde "hammer" (agarre) con la máquina Hammer', () => {
    expect(translateExerciseName('dumbbell hammer curl', 'dumbbell')).toBe('Curl martillo con mancuernas');
  });

  it('es determinista', () => {
    const a = translateExerciseName('barbell full squat', 'barbell');
    expect(a).toBe(translateExerciseName('barbell full squat', 'barbell'));
  });

  it('conserva términos desconocidos en vez de inventar', () => {
    expect(translateExerciseName('kipping muscle up', 'body weight')).toContain('muscle-up');
  });
});

describe('classifyMovementPattern', () => {
  const ex = (name: string, target = 'pectorals', category = 'chest') => ({
    name, target, category, equipment: 'barbell', muscleGroup: target,
  });

  it('clasifica los patrones fundamentales', () => {
    expect(classifyMovementPattern(ex('barbell full squat', 'quads', 'upper legs'))).toBe('squat');
    expect(classifyMovementPattern(ex('barbell deadlift', 'glutes', 'upper legs'))).toBe('hinge');
    expect(classifyMovementPattern(ex('dumbbell lunge', 'quads', 'upper legs'))).toBe('lunge');
    expect(classifyMovementPattern(ex('barbell bench press'))).toBe('push_h');
    expect(classifyMovementPattern(ex('barbell military press', 'delts', 'shoulders'))).toBe('push_v');
    expect(classifyMovementPattern(ex('barbell bent over row', 'upper back', 'back'))).toBe('pull_h');
    expect(classifyMovementPattern(ex('pull-up', 'lats', 'back'))).toBe('pull_v');
    expect(classifyMovementPattern(ex('crunch', 'abs', 'waist'))).toBe('core');
    expect(classifyMovementPattern(ex('run', 'cardiovascular system', 'cardio'))).toBe('cardio');
    expect(classifyMovementPattern(ex('dumbbell biceps curl', 'biceps', 'upper arms'))).toBe('isolation');
  });

  it('aperturas y elevaciones son aislamiento aunque toquen pecho/hombro', () => {
    expect(classifyMovementPattern(ex('dumbbell fly'))).toBe('isolation');
    expect(classifyMovementPattern(ex('dumbbell lateral raise', 'delts', 'shoulders'))).toBe('isolation');
  });

  it('isCompound coincide con los patrones multiarticulares', () => {
    expect(isCompound('squat')).toBe(true);
    expect(isCompound('isolation')).toBe(false);
    expect(isCompound('core')).toBe(false);
  });
});

describe('conflictsWithInjuries', () => {
  const shoulderPress = { target: 'delts', muscleGroup: 'shoulders', secondaryMuscles: ['triceps'], movementPattern: 'push_v' as const };
  const squat = { target: 'quads', muscleGroup: 'quadriceps', secondaryMuscles: ['glutes'], movementPattern: 'squat' as const };

  it('bloquea por músculo y por patrón', () => {
    expect(conflictsWithInjuries(shoulderPress, ['hombro'])).toBe(true);
    expect(conflictsWithInjuries(squat, ['rodilla'])).toBe(true);
    expect(conflictsWithInjuries(squat, ['hombro'])).toBe(false);
  });

  it('los secundarios también cuentan', () => {
    expect(conflictsWithInjuries(shoulderPress, ['codo'])).toBe(true);
  });

  it('zona desconocida no bloquea nada', () => {
    expect(conflictsWithInjuries(squat, ['zona-inventada'])).toBe(false);
  });
});
