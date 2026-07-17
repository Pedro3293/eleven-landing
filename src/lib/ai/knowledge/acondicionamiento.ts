import type { KnowledgeEntry } from './types';

export const ACONDICIONAMIENTO: KnowledgeEntry[] = [
  {
    id: 'capacidades-fisicas',
    category: 'acondicionamiento',
    title: 'Capacidades físicas básicas y cómo se entrenan',
    keywords: ['capacidades fisicas', 'condicion fisica', 'acondicionamiento', 'fitness general', 'preparacion fisica'],
    content: `Las capacidades básicas y su estímulo principal:

- Fuerza: cargas altas con pocas reps (ver entrada de fuerza). Es la capacidad "madre": mejora a casi todas las demás y protege frente a lesiones y fragilidad.
- Resistencia cardiovascular: base aeróbica (Z2) + intervalos ocasionales.
- Resistencia muscular: series largas (15-30 reps), circuitos y densidad (más trabajo en menos tiempo).
- Velocidad/potencia: gestos rápidos con recuperación completa (saltos, esprints, cargadas); se entrena fresco, al principio de la sesión.
- Flexibilidad/movilidad: rango completo con carga + estiramientos específicos donde falte rango.
- Coordinación/equilibrio: patrones nuevos, trabajo unilateral, calistenia.

Para salud general, el mínimo eficaz semanal: 2 sesiones de fuerza + 150 min de actividad aeróbica moderada + pasos diarios. FORGE cubre la fuerza y la parte metabólica; caminar va por tu cuenta.`,
  },
  {
    id: 'hiit-modos',
    category: 'acondicionamiento',
    title: 'HIIT, EMOM, AMRAP y Tabata: qué es cada cosa',
    keywords: ['hiit', 'emom', 'amrap', 'tabata', 'intervalos', 'metabolico', 'circuito', 'wod'],
    content: `- HIIT: intervalos duros (RPE 8-9) con recuperaciones. Formato clásico: 4-6 × 2-4 min duros / 2-3 min suaves. Muy eficiente para VO2max; 1-2 veces/semana es suficiente y más satura la recuperación.
- EMOM ("cada minuto, al minuto"): haces X reps al empezar cada minuto y descansas lo que sobre. Autorregula la densidad: si llegas justo al minuto, la carga era alta. Ideal para técnica bajo fatiga controlada.
- AMRAP: máximas rondas de un circuito en un tiempo fijo. Mide y motiva (marca a batir), pero cuida la técnica cuando aparece la fatiga.
- Tabata (protocolo real): 8 × 20 s a intensidad casi máxima / 10 s descanso = 4 min brutales. La mayoría de "tabatas" de gimnasio son intervalos suaves con ese nombre; la versión real solo tiene sentido con ejercicios simples y seguros (bici, esprint, burpees limpios).

Regla general: la intensidad alta se gana; primero base aeróbica y técnica, luego intervalos.`,
  },
  {
    id: 'cardio-fuerza',
    category: 'acondicionamiento',
    title: 'Combinar cardio y fuerza (interferencia)',
    keywords: ['cardio y pesas', 'interferencia', 'concurrente', 'combinar', 'cardio despues de pesas'],
    content: `El "efecto interferencia" existe pero se exagera: con volúmenes recreativos, el cardio bien colocado apenas resta fuerza o músculo, y suma salud y capacidad de trabajo.

Cómo ordenarlo:
- Prioridad del día primero: si toca pierna pesada, el cardio intenso ese día no, o después y suave.
- Cardio suave (Z2): en cualquier momento; incluso ayuda a recuperar entre sesiones de fuerza.
- Cardio intenso (HIIT): separado de la fuerza de pierna ≥6 h, o en día propio.
- Misma sesión: fuerza primero, cardio después (el orden inverso degrada las cargas).
- Andar mucho no interfiere con nada: es la mejor herramienta de gasto diario que existe.

Si el objetivo es rendimiento en resistencia (carrera, ciclismo), invierte la prioridad: la fuerza pasa a 2 sesiones/semana de mantenimiento pesadas y cortas.`,
  },
  {
    id: 'perdida-grasa',
    category: 'acondicionamiento',
    title: 'Entrenamiento para pérdida de grasa',
    keywords: ['perder grasa', 'definicion', 'adelgazar', 'quemar', 'deficit', 'recomposicion'],
    content: `La grasa se pierde con déficit calórico sostenido; el entrenamiento decide QUÉ pierdes (grasa vs. músculo) y cuánto sube tu gasto.

Prioridades en déficit:
1. Fuerza con cargas: mantener (o subir) los pesos es la señal que conserva el músculo. El volumen puede bajar un poco; la intensidad no.
2. Proteína alta (2-2,2 g/kg en déficit) y sueño.
3. Actividad diaria (pasos) como palanca de gasto principal: barata de recuperar.
4. Cardio como complemento: Z2 y algún intervalo; no compensa una dieta sin control.

Avisos: en déficits largos baja algo el rendimiento — es normal, no un fallo del plan; los RPE suben con las mismas cargas, autorregula; descargas algo más frecuentes ayudan. La "recomposición" (ganar músculo perdiendo grasa) es muy real en novatos y en quienes vuelven tras parón.`,
  },
];
