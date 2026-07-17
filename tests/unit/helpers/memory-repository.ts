/** ExerciseRepository en memoria para tests del motor (sin BD). */
import type { ExerciseDTO, ExerciseFilter, ExerciseRepository } from '@/lib/repository/exercise-repository';
import { conflictsWithInjuries } from '@/lib/repository/injury-map';
import type { MovementPattern } from '@/lib/dataset/movement-pattern';

let auto = 0;

export function makeExercise(partial: Partial<ExerciseDTO> & { movementPattern: MovementPattern }): ExerciseDTO {
  auto++;
  return {
    id: partial.id ?? String(auto).padStart(4, '0'),
    name: partial.name ?? `Ejercicio ${auto}`,
    nameEn: partial.nameEn ?? `exercise ${auto}`,
    category: partial.category ?? 'chest',
    bodyPart: partial.bodyPart ?? 'chest',
    target: partial.target ?? 'pectorals',
    muscleGroup: partial.muscleGroup ?? 'chest',
    secondaryMuscles: partial.secondaryMuscles ?? [],
    equipment: partial.equipment ?? 'barbell',
    movementPattern: partial.movementPattern,
    isCompound: partial.isCompound ?? true,
    instructions: partial.instructions ?? ['Paso uno.', 'Paso dos.'],
    imageUrl: partial.imageUrl ?? '/api/media/images/x.jpg',
    gifUrl: partial.gifUrl ?? '/api/media/videos/x.gif',
    attribution: partial.attribution ?? '',
  };
}

export class MemoryRepository implements ExerciseRepository {
  constructor(private exercises: ExerciseDTO[]) {}

  async getById(id: string): Promise<ExerciseDTO | null> {
    return this.exercises.find((e) => e.id === id) ?? null;
  }

  async getByIds(ids: string[]): Promise<ExerciseDTO[]> {
    return ids
      .map((id) => this.exercises.find((e) => e.id === id))
      .filter((e): e is ExerciseDTO => Boolean(e));
  }

  async find(filter: ExerciseFilter): Promise<ExerciseDTO[]> {
    const arr = (v: string | string[] | undefined) =>
      v === undefined ? undefined : Array.isArray(v) ? v : [v];
    let out = this.exercises.filter((e) => {
      const patterns = arr(filter.pattern);
      if (patterns && !patterns.includes(e.movementPattern)) return false;
      if (arr(filter.target) && !arr(filter.target)!.includes(e.target)) return false;
      if (arr(filter.muscleGroup) && !arr(filter.muscleGroup)!.includes(e.muscleGroup)) return false;
      if (arr(filter.bodyPart) && !arr(filter.bodyPart)!.includes(e.bodyPart)) return false;
      if (arr(filter.category) && !arr(filter.category)!.includes(e.category)) return false;
      if (filter.equipmentIn && !filter.equipmentIn.includes(e.equipment)) return false;
      if (filter.isCompound !== undefined && e.isCompound !== filter.isCompound) return false;
      if (filter.search && !e.name.includes(filter.search) && !e.nameEn.includes(filter.search)) return false;
      return true;
    });
    if (filter.excludeInjuries?.length) {
      out = out.filter((e) => !conflictsWithInjuries(e, filter.excludeInjuries!));
    }
    return filter.limit ? out.slice(0, filter.limit) : out;
  }

  async count(): Promise<number> {
    return this.exercises.length;
  }

  async findAlternatives(
    exerciseId: string,
    opts: { equipmentIn?: string[]; excludeInjuries?: string[]; limit?: number } = {},
  ): Promise<ExerciseDTO[]> {
    const base = await this.getById(exerciseId);
    if (!base) return [];
    const list = await this.find({
      pattern: base.movementPattern,
      equipmentIn: opts.equipmentIn,
      excludeInjuries: opts.excludeInjuries,
    });
    return list.filter((e) => e.id !== base.id).slice(0, opts.limit ?? 6);
  }
}

/** Catálogo sintético con cobertura de todos los patrones y varios equipamientos. */
export function makeCatalog(): ExerciseDTO[] {
  return [
    makeExercise({ id: 'sq-bb', movementPattern: 'squat', equipment: 'barbell', target: 'quads', muscleGroup: 'quadriceps', bodyPart: 'upper legs' }),
    makeExercise({ id: 'sq-bw', movementPattern: 'squat', equipment: 'body weight', target: 'quads', muscleGroup: 'quadriceps', bodyPart: 'upper legs' }),
    makeExercise({ id: 'sq-db', movementPattern: 'squat', equipment: 'dumbbell', target: 'quads', muscleGroup: 'quadriceps', bodyPart: 'upper legs' }),
    makeExercise({ id: 'hg-bb', movementPattern: 'hinge', equipment: 'barbell', target: 'glutes', muscleGroup: 'hamstrings', bodyPart: 'upper legs', secondaryMuscles: ['lower back'] }),
    makeExercise({ id: 'hg-bw', movementPattern: 'hinge', equipment: 'body weight', target: 'glutes', muscleGroup: 'glutes', bodyPart: 'upper legs' }),
    makeExercise({ id: 'lg-bw', movementPattern: 'lunge', equipment: 'body weight', target: 'quads', muscleGroup: 'quadriceps', bodyPart: 'upper legs' }),
    makeExercise({ id: 'ph-bb', movementPattern: 'push_h', equipment: 'barbell', target: 'pectorals', muscleGroup: 'chest', bodyPart: 'chest' }),
    makeExercise({ id: 'ph-bw', movementPattern: 'push_h', equipment: 'body weight', target: 'pectorals', muscleGroup: 'chest', bodyPart: 'chest' }),
    makeExercise({ id: 'ph-db', movementPattern: 'push_h', equipment: 'dumbbell', target: 'pectorals', muscleGroup: 'chest', bodyPart: 'chest' }),
    makeExercise({ id: 'pv-bb', movementPattern: 'push_v', equipment: 'barbell', target: 'delts', muscleGroup: 'shoulders', bodyPart: 'shoulders' }),
    makeExercise({ id: 'pv-db', movementPattern: 'push_v', equipment: 'dumbbell', target: 'delts', muscleGroup: 'shoulders', bodyPart: 'shoulders' }),
    makeExercise({ id: 'plh-bb', movementPattern: 'pull_h', equipment: 'barbell', target: 'upper back', muscleGroup: 'upper back', bodyPart: 'back' }),
    makeExercise({ id: 'plh-bw', movementPattern: 'pull_h', equipment: 'body weight', target: 'upper back', muscleGroup: 'upper back', bodyPart: 'back' }),
    makeExercise({ id: 'plv-bw', movementPattern: 'pull_v', equipment: 'body weight', target: 'lats', muscleGroup: 'lats', bodyPart: 'back' }),
    makeExercise({ id: 'plv-cb', movementPattern: 'pull_v', equipment: 'cable', target: 'lats', muscleGroup: 'lats', bodyPart: 'back' }),
    makeExercise({ id: 'co-bw', movementPattern: 'core', equipment: 'body weight', target: 'abs', muscleGroup: 'abdominals', bodyPart: 'waist', isCompound: false, category: 'waist' }),
    makeExercise({ id: 'co-bw2', movementPattern: 'core', equipment: 'body weight', target: 'abs', muscleGroup: 'core', bodyPart: 'waist', isCompound: false, category: 'waist' }),
    makeExercise({ id: 'iso-bi', movementPattern: 'isolation', equipment: 'dumbbell', target: 'biceps', muscleGroup: 'biceps', bodyPart: 'upper arms', isCompound: false }),
    makeExercise({ id: 'iso-tri', movementPattern: 'isolation', equipment: 'cable', target: 'triceps', muscleGroup: 'triceps', bodyPart: 'upper arms', isCompound: false }),
    makeExercise({ id: 'iso-ch', movementPattern: 'isolation', equipment: 'dumbbell', target: 'pectorals', muscleGroup: 'chest', bodyPart: 'chest', isCompound: false }),
    makeExercise({ id: 'iso-dl', movementPattern: 'isolation', equipment: 'dumbbell', target: 'delts', muscleGroup: 'deltoids', bodyPart: 'shoulders', isCompound: false }),
    makeExercise({ id: 'iso-ca', movementPattern: 'isolation', equipment: 'body weight', target: 'calves', muscleGroup: 'calves', bodyPart: 'lower legs', isCompound: false }),
    makeExercise({ id: 'iso-ha', movementPattern: 'isolation', equipment: 'leverage machine', target: 'hamstrings', muscleGroup: 'hamstrings', bodyPart: 'upper legs', isCompound: false }),
    makeExercise({ id: 'cd-bw', movementPattern: 'cardio', equipment: 'body weight', target: 'cardiovascular system', muscleGroup: 'core', bodyPart: 'cardio', category: 'cardio', isCompound: false }),
  ];
}
