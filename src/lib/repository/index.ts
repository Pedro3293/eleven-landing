import { prisma } from '@/lib/db';
import { LocalDatasetAdapter } from './local-dataset-adapter';
import type { ExerciseRepository } from './exercise-repository';

// Punto único de acceso a la fuente de ejercicios. El swap de fuente (Gate 0)
// se hace aquí cambiando el adaptador instanciado.
export const exerciseRepository: ExerciseRepository = new LocalDatasetAdapter(prisma);

export type { ExerciseDTO, ExerciseFilter, ExerciseRepository } from './exercise-repository';
