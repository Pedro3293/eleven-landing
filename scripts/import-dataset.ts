/**
 * Importa vendor/exercises-dataset/data/exercises.json a la BD.
 * - Normaliza categorías/equipamiento, clasifica patrón de movimiento.
 * - Traduce el nombre a ES (glosario determinista); las instrucciones ES vienen del dataset.
 * - Verifica integridad: 1.324 registros, 0 rutas de media rotas, ES presente en todos.
 *
 * Uso: npm run db:import
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { translateExerciseName } from '../src/lib/dataset/translate-name';
import { classifyMovementPattern, isCompound } from '../src/lib/dataset/movement-pattern';

const DATASET_ROOT = join(process.cwd(), 'vendor', 'exercises-dataset');
const EXPECTED_COUNT = 1324;

interface DatasetExercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  target: string;
  muscle_group: string;
  secondary_muscles: string[];
  image: string;
  gif_url: string;
  attribution: string;
  instructions: Record<string, string>;
  instruction_steps: Record<string, string[]>;
}

async function main() {
  const prisma = new PrismaClient();
  const raw = readFileSync(join(DATASET_ROOT, 'data', 'exercises.json'), 'utf8');
  const data: DatasetExercise[] = JSON.parse(raw);

  console.log(`Dataset: ${data.length} ejercicios`);

  const errors: string[] = [];
  if (data.length !== EXPECTED_COUNT) {
    errors.push(`Se esperaban ${EXPECTED_COUNT} ejercicios, hay ${data.length}`);
  }

  let brokenMedia = 0;
  let missingEs = 0;
  const rows = data.map((ex) => {
    if (!existsSync(join(DATASET_ROOT, ex.image))) {
      brokenMedia++;
      errors.push(`Imagen rota: ${ex.id} ${ex.image}`);
    }
    if (!existsSync(join(DATASET_ROOT, ex.gif_url))) {
      brokenMedia++;
      errors.push(`GIF roto: ${ex.id} ${ex.gif_url}`);
    }
    const steps = ex.instruction_steps?.es?.length
      ? ex.instruction_steps.es
      : ex.instructions?.es
        ? [ex.instructions.es]
        : [];
    if (steps.length === 0) {
      missingEs++;
      errors.push(`Sin instrucciones ES: ${ex.id} ${ex.name}`);
    }
    const pattern = classifyMovementPattern(ex);
    return {
      id: ex.id,
      name: translateExerciseName(ex.name, ex.equipment),
      nameEn: ex.name,
      category: ex.category.trim().toLowerCase(),
      bodyPart: ex.body_part.trim().toLowerCase(),
      target: ex.target.trim().toLowerCase(),
      muscleGroup: (ex.muscle_group || ex.target).trim().toLowerCase(),
      secondaryMuscles: JSON.stringify(ex.secondary_muscles ?? []),
      equipment: ex.equipment.trim().toLowerCase(),
      movementPattern: pattern,
      isCompound: isCompound(pattern),
      instructionsEs: JSON.stringify(steps),
      imagePath: `/api/media/${ex.image}`,
      gifPath: `/api/media/${ex.gif_url}`,
      attribution: ex.attribution ?? '',
      source: 'dev-dataset',
    };
  });

  await prisma.$transaction(async (tx) => {
    await tx.exercise.deleteMany();
    // createMany por lotes (SQLite limita variables por sentencia)
    const chunk = 200;
    for (let i = 0; i < rows.length; i += chunk) {
      await tx.exercise.createMany({ data: rows.slice(i, i + chunk) });
    }
  });

  const count = await prisma.exercise.count();
  console.log(`Importados: ${count}/${EXPECTED_COUNT}`);
  console.log(`Media rota: ${brokenMedia} · Sin ES: ${missingEs}`);

  const patterns = await prisma.exercise.groupBy({ by: ['movementPattern'], _count: true });
  console.log('Patrones:', patterns.map((p) => `${p.movementPattern}=${p._count}`).join(' '));

  await prisma.$disconnect();

  if (errors.length > 0) {
    console.error(`\nVERIFICACIÓN FALLIDA (${errors.length} errores):`);
    errors.slice(0, 20).forEach((e) => console.error(' -', e));
    process.exit(1);
  }
  console.log('Verificación OK: importación completa e íntegra.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
