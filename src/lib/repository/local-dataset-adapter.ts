/**
 * Adaptador de ExerciseRepository sobre la tabla Exercise (importada del dataset dev).
 * El filtrado por lesión se aplica en memoria (reglas de injury-map); el resto en SQL.
 */
import type { PrismaClient, Exercise as ExerciseRow } from '@prisma/client';
import type { MovementPattern } from '@/lib/dataset/movement-pattern';
import type { ExerciseDTO, ExerciseFilter, ExerciseRepository } from './exercise-repository';
import { conflictsWithInjuries } from './injury-map';

function toDTO(row: ExerciseRow): ExerciseDTO {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.nameEn,
    category: row.category,
    bodyPart: row.bodyPart,
    target: row.target,
    muscleGroup: row.muscleGroup,
    secondaryMuscles: JSON.parse(row.secondaryMuscles) as string[],
    equipment: row.equipment,
    movementPattern: row.movementPattern as MovementPattern,
    isCompound: row.isCompound,
    instructions: JSON.parse(row.instructionsEs) as string[],
    imageUrl: row.imagePath,
    gifUrl: row.gifPath,
    attribution: row.attribution,
  };
}

const arr = (v: string | string[] | undefined): string[] | undefined =>
  v === undefined ? undefined : Array.isArray(v) ? v : [v];

export class LocalDatasetAdapter implements ExerciseRepository {
  constructor(private readonly db: PrismaClient) {}

  async getById(id: string): Promise<ExerciseDTO | null> {
    const row = await this.db.exercise.findUnique({ where: { id } });
    return row ? toDTO(row) : null;
  }

  async getByIds(ids: string[]): Promise<ExerciseDTO[]> {
    const rows = await this.db.exercise.findMany({ where: { id: { in: ids } } });
    const byId = new Map(rows.map((r) => [r.id, toDTO(r)]));
    return ids.map((id) => byId.get(id)).filter((e): e is ExerciseDTO => Boolean(e));
  }

  async find(filter: ExerciseFilter): Promise<ExerciseDTO[]> {
    const patterns = arr(filter.pattern);
    const rows = await this.db.exercise.findMany({
      where: {
        ...(patterns ? { movementPattern: { in: patterns } } : {}),
        ...(arr(filter.target) ? { target: { in: arr(filter.target) } } : {}),
        ...(arr(filter.muscleGroup) ? { muscleGroup: { in: arr(filter.muscleGroup) } } : {}),
        ...(arr(filter.bodyPart) ? { bodyPart: { in: arr(filter.bodyPart) } } : {}),
        ...(arr(filter.category) ? { category: { in: arr(filter.category) } } : {}),
        ...(filter.equipmentIn ? { equipment: { in: filter.equipmentIn } } : {}),
        ...(filter.isCompound !== undefined ? { isCompound: filter.isCompound } : {}),
        ...(filter.search
          ? { OR: [{ name: { contains: filter.search } }, { nameEn: { contains: filter.search } }] }
          : {}),
      },
      orderBy: { id: 'asc' },
    });

    let result = rows.map(toDTO);
    if (filter.excludeInjuries?.length) {
      result = result.filter((e) => !conflictsWithInjuries(e, filter.excludeInjuries!));
    }
    return filter.limit ? result.slice(0, filter.limit) : result;
  }

  async count(): Promise<number> {
    return this.db.exercise.count();
  }

  async findAlternatives(
    exerciseId: string,
    opts: { equipmentIn?: string[]; excludeInjuries?: string[]; limit?: number } = {},
  ): Promise<ExerciseDTO[]> {
    const base = await this.getById(exerciseId);
    if (!base) return [];
    const candidates = await this.find({
      pattern: base.movementPattern,
      equipmentIn: opts.equipmentIn,
      excludeInjuries: opts.excludeInjuries,
    });
    const scored = candidates
      .filter((c) => c.id !== base.id)
      .map((c) => ({
        c,
        score:
          (c.target === base.target ? 4 : 0) +
          (c.muscleGroup === base.muscleGroup ? 2 : 0) +
          (c.bodyPart === base.bodyPart ? 1 : 0) +
          (c.isCompound === base.isCompound ? 1 : 0),
      }))
      .filter((s) => s.score >= 2)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, opts.limit ?? 6).map((s) => s.c);
  }
}
