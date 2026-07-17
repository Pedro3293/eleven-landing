/**
 * Capa de abstracción de la fuente de ejercicios (Gate 0 / DESCRIBE §3).
 * TODA lectura de ejercicios pasa por aquí: ni la UI ni el motor conocen el dataset.
 * Cambiar de fuente = implementar otro adaptador, sin tocar consumidores.
 */
import type { MovementPattern } from '@/lib/dataset/movement-pattern';

export interface ExerciseDTO {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  bodyPart: string;
  target: string;
  muscleGroup: string;
  secondaryMuscles: string[];
  equipment: string;
  movementPattern: MovementPattern;
  isCompound: boolean;
  /** Pasos de ejecución en español. */
  instructions: string[];
  imageUrl: string;
  gifUrl: string;
  attribution: string;
}

export interface ExerciseFilter {
  pattern?: MovementPattern | MovementPattern[];
  target?: string | string[];
  muscleGroup?: string | string[];
  bodyPart?: string | string[];
  category?: string | string[];
  /** Equipamiento disponible: solo se devuelven ejercicios realizables con él. */
  equipmentIn?: string[];
  /** Zonas lesionadas: se excluyen ejercicios que las cargan (target o secundarios). */
  excludeInjuries?: string[];
  isCompound?: boolean;
  search?: string;
  limit?: number;
}

export interface ExerciseRepository {
  getById(id: string): Promise<ExerciseDTO | null>;
  getByIds(ids: string[]): Promise<ExerciseDTO[]>;
  find(filter: ExerciseFilter): Promise<ExerciseDTO[]>;
  count(): Promise<number>;
  /** Alternativas al ejercicio dado con el mismo patrón y músculo objetivo compatible. */
  findAlternatives(exerciseId: string, opts?: { equipmentIn?: string[]; excludeInjuries?: string[]; limit?: number }): Promise<ExerciseDTO[]>;
}
