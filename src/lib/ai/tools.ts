/**
 * Tools del agente sobre los servicios de dominio (DESCRIBE §4.5).
 * Todas operan con el userId de la sesión autenticada: el agente no puede
 * tocar datos de otros usuarios por construcción.
 */
import type Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/db';
import { exerciseRepository } from '@/lib/repository';
import {
  addSet,
  computeRecentFeedback,
  getActivePlan,
  getAlternatives,
  getSessionDetail,
  parsePlanState,
  setExerciseStatus,
  substituteExercise,
} from '@/lib/services/plan-service';
import { getMethodology } from '@/lib/engine/methodologies';
import { searchKnowledge, type KnowledgeCategory } from '@/lib/ai/knowledge';

export const TOOL_DEFINITIONS: Anthropic.Tool[] = [
  {
    name: 'get_profile',
    description: 'Lee el perfil del usuario: objetivo, experiencia, lesiones, equipamiento, disponibilidad.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'update_profile',
    description: 'Actualiza campos del perfil. Solo los campos incluidos.',
    input_schema: {
      type: 'object',
      properties: {
        goal: { type: 'string', enum: ['fuerza', 'hipertrofia', 'perdida_grasa', 'salud_general', 'rendimiento'] },
        injuries: { type: 'array', items: { type: 'string' }, description: 'Zonas a proteger: hombro, codo, muñeca, cuello, espalda_baja, espalda_alta, cadera, rodilla, tobillo' },
        healthConditions: { type: 'array', items: { type: 'string' }, description: 'Condiciones de salud declaradas: hipotiroidismo, hipertiroidismo, diabetes-tipo-1, diabetes-tipo-2, hipertension, asma, obesidad, osteoporosis, artrosis, lumbalgia, cardiopatia, anemia, fibromialgia, embarazo' },
        equipment: { type: 'array', items: { type: 'string' } },
        daysPerWeek: { type: 'integer', minimum: 1, maximum: 7 },
        minutesPerSession: { type: 'integer', minimum: 15, maximum: 240 },
        bodyweightKg: { type: 'number' },
      },
      required: [],
    },
  },
  {
    name: 'get_plan',
    description: 'Lee el plan activo: metodología, días por semana, sesiones completadas y progresión por ejercicio.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_current_session',
    description: 'Lee la sesión en curso o planificada, con sus ejercicios, series objetivo y series registradas.',
    input_schema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_history',
    description: 'Historial reciente: últimas sesiones completadas y feedback (RPE medio, molestias).',
    input_schema: { type: 'object', properties: { limit: { type: 'integer', maximum: 20 } }, required: [] },
  },
  {
    name: 'search_knowledge',
    description:
      'Consulta la base de conocimiento del entrenador: ciencias del deporte (hipertrofia, fuerza, periodización, RPE, recuperación...), metodologías, acondicionamiento (HIIT/EMOM/AMRAP, cardio+fuerza) y condiciones de salud que afectan al rendimiento (hipotiroidismo, diabetes, hipertensión, asma, osteoporosis, artrosis, lumbalgia, cardiopatías, anemia, fibromialgia, embarazo, tendinopatías...). Úsala SIEMPRE antes de responder sobre estos temas y cita sus pautas.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Tema o pregunta, p.ej. "diabetes tipo 1" o "cómo progresar en dominadas"' },
        category: { type: 'string', enum: ['ciencia', 'metodologia', 'acondicionamiento', 'salud'] },
      },
      required: ['query'],
    },
  },
  {
    name: 'explain_exercise',
    description: 'Busca un ejercicio del catálogo por nombre (ES o EN) y devuelve técnica, músculos y equipamiento.',
    input_schema: {
      type: 'object',
      properties: { query: { type: 'string', description: 'Nombre o parte del nombre' } },
      required: ['query'],
    },
  },
  {
    name: 'get_alternatives',
    description: 'Alternativas viables (mismo patrón/músculo, respetando material y lesiones) para un ejercicio de la sesión en curso.',
    input_schema: {
      type: 'object',
      properties: { sessionExerciseId: { type: 'string' } },
      required: ['sessionExerciseId'],
    },
  },
  {
    name: 'substitute_exercise',
    description: 'Sustituye un ejercicio de la sesión en curso. Si no se indica newExerciseId, elige la mejor alternativa automáticamente.',
    input_schema: {
      type: 'object',
      properties: {
        sessionExerciseId: { type: 'string' },
        newExerciseId: { type: 'string' },
      },
      required: ['sessionExerciseId'],
    },
  },
  {
    name: 'adjust_session',
    description: 'Ajusta la sesión en curso: saltar un ejercicio, reactivarlo o añadirle una serie.',
    input_schema: {
      type: 'object',
      properties: {
        sessionExerciseId: { type: 'string' },
        action: { type: 'string', enum: ['skip', 'unskip', 'add_set'] },
      },
      required: ['sessionExerciseId', 'action'],
    },
  },
];

/** Ejecuta una tool y devuelve el resultado serializable (string JSON). */
export async function executeTool(userId: string, name: string, input: Record<string, unknown>): Promise<string> {
  switch (name) {
    case 'get_profile': {
      const p = await prisma.profile.findUnique({ where: { userId } });
      if (!p) return JSON.stringify({ error: 'Sin perfil: el usuario no ha completado el onboarding.' });
      return JSON.stringify({
        nombre: p.displayName,
        objetivo: p.goal,
        experiencia: p.experience,
        lesiones: JSON.parse(p.injuries),
        condicionesDeSalud: JSON.parse(p.healthConditions),
        equipamiento: JSON.parse(p.equipment),
        diasPorSemana: p.daysPerWeek,
        minutosPorSesion: p.minutesPerSession,
        pesoKg: p.bodyweightKg,
      });
    }
    case 'update_profile': {
      const data: Record<string, unknown> = {};
      if (input.goal) data.goal = String(input.goal);
      if (input.injuries) data.injuries = JSON.stringify(input.injuries);
      if (input.healthConditions) data.healthConditions = JSON.stringify(input.healthConditions);
      if (input.equipment) data.equipment = JSON.stringify(input.equipment);
      if (typeof input.daysPerWeek === 'number') data.daysPerWeek = input.daysPerWeek;
      if (typeof input.minutesPerSession === 'number') data.minutesPerSession = input.minutesPerSession;
      if (typeof input.bodyweightKg === 'number') data.bodyweightKg = input.bodyweightKg;
      if (Object.keys(data).length === 0) return JSON.stringify({ error: 'Nada que actualizar' });
      await prisma.profile.update({ where: { userId }, data });
      return JSON.stringify({ ok: true, actualizado: Object.keys(data) });
    }
    case 'get_plan': {
      const plan = await getActivePlan(userId);
      if (!plan) return JSON.stringify({ error: 'Sin plan activo' });
      const state = parsePlanState(plan.config);
      const config = getMethodology(plan.methodologyId);
      return JSON.stringify({
        metodologia: plan.methodology.name,
        descripcion: plan.methodology.description,
        diasPorSemana: state.daysPerWeek,
        sesionesCompletadas: state.completedSessions,
        estructuraDias: config?.days.map((d) => d.title),
        progresionPorEjercicio: state.progress,
      });
    }
    case 'get_current_session': {
      const open = await prisma.session.findFirst({
        where: { userId, status: { in: ['planned', 'in_progress'] } },
        orderBy: { index: 'desc' },
      });
      if (!open) return JSON.stringify({ error: 'No hay sesión en curso ni planificada' });
      const detail = await getSessionDetail(userId, open.id);
      return JSON.stringify({
        sessionId: detail.id,
        titulo: detail.title,
        estado: detail.status,
        ejercicios: detail.exercises.map((e) => ({
          sessionExerciseId: e.id,
          nombre: e.exercise.name,
          estado: e.status,
          seriesObjetivo: e.targetSets,
          reps: `${e.targetRepsMin}-${e.targetRepsMax}`,
          cargaSugeridaKg: e.targetWeightKg,
          descansoSeg: e.restSeconds,
          modo: e.mode,
          seriesRegistradas: e.setLogs.map((l) => ({ reps: l.reps, kg: l.weightKg, rpe: l.rpe })),
        })),
      });
    }
    case 'get_history': {
      const limit = Math.min(Number(input.limit) || 5, 20);
      const sessions = await prisma.session.findMany({
        where: { userId, status: 'completed' },
        orderBy: { finishedAt: 'desc' },
        take: limit,
        include: { exercises: { include: { exercise: { select: { name: true } }, setLogs: true } } },
      });
      const feedback = await computeRecentFeedback(userId);
      return JSON.stringify({
        feedbackReciente: feedback,
        sesiones: sessions.map((s) => ({
          titulo: s.title,
          fecha: s.finishedAt,
          duracionSeg: s.totalSeconds,
          ejercicios: s.exercises.map((e) => ({
            nombre: e.exercise.name,
            series: e.setLogs.map((l) => `${l.reps}x${l.weightKg ?? 'bw'}${l.rpe ? `@${l.rpe}` : ''}`),
          })),
        })),
      });
    }
    case 'search_knowledge': {
      const entries = searchKnowledge(String(input.query ?? ''), {
        category: input.category as KnowledgeCategory | undefined,
        limit: 3,
      });
      if (entries.length === 0) return JSON.stringify({ resultado: 'Sin entradas para esa consulta; responde con tu criterio general y prudencia.' });
      return JSON.stringify(entries.map((e) => ({ titulo: e.title, categoria: e.category, contenido: e.content })));
    }
    case 'explain_exercise': {
      const results = await exerciseRepository.find({ search: String(input.query ?? ''), limit: 3 });
      if (results.length === 0) return JSON.stringify({ error: 'Sin resultados para esa búsqueda' });
      return JSON.stringify(
        results.map((e) => ({
          id: e.id,
          nombre: e.name,
          nombreEn: e.nameEn,
          musculoObjetivo: e.target,
          secundarios: e.secondaryMuscles,
          equipamiento: e.equipment,
          patron: e.movementPattern,
          tecnica: e.instructions,
        })),
      );
    }
    case 'get_alternatives': {
      const alts = await getAlternatives(userId, String(input.sessionExerciseId ?? ''));
      return JSON.stringify(alts.map((a) => ({ id: a.id, nombre: a.name, equipamiento: a.equipment, musculo: a.target })));
    }
    case 'substitute_exercise': {
      const updated = await substituteExercise(
        userId,
        String(input.sessionExerciseId ?? ''),
        input.newExerciseId ? String(input.newExerciseId) : undefined,
      );
      const ex = await exerciseRepository.getById(updated.exerciseId);
      return JSON.stringify({ ok: true, nuevoEjercicio: ex?.name });
    }
    case 'adjust_session': {
      const id = String(input.sessionExerciseId ?? '');
      const action = String(input.action ?? '');
      if (action === 'skip') await setExerciseStatus(userId, id, 'skipped');
      else if (action === 'unskip') await setExerciseStatus(userId, id, 'pending');
      else if (action === 'add_set') await addSet(userId, id);
      else return JSON.stringify({ error: 'Acción desconocida' });
      return JSON.stringify({ ok: true, action });
    }
    default:
      return JSON.stringify({ error: `Tool desconocida: ${name}` });
  }
}
