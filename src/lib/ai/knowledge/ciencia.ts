import type { KnowledgeEntry } from './types';

export const CIENCIA: KnowledgeEntry[] = [
  {
    id: 'hipertrofia',
    category: 'ciencia',
    title: 'Hipertrofia: cómo crece el músculo',
    keywords: ['hipertrofia', 'masa muscular', 'ganar musculo', 'crecer', 'volumen muscular', 'tension mecanica'],
    content: `El estímulo principal de la hipertrofia es la tensión mecánica acumulada con esfuerzo suficiente; el estrés metabólico y el daño muscular son secundarios.

Reglas prácticas con mejor respaldo:
- Volumen: ~10-20 series efectivas por grupo muscular y semana. Empezar por la parte baja y subir solo si se progresa y se recupera.
- Proximidad al fallo: la mayoría de series a RIR 0-3 (0-3 reps en recámara). El fallo ocasional sirve, pero es caro de recuperar.
- Rango de repeticiones: cualquier rango entre 5 y 30 reps genera hipertrofia similar si el esfuerzo iguala; 6-15 es lo más práctico.
- Frecuencia: tocar cada músculo ≥2 veces/semana reparte mejor el volumen que una sola paliza semanal.
- Progresión: doble progresión (subir reps dentro del rango y, al tocar techo, subir carga) es lo más simple y robusto.
- La técnica constante importa más que el ejercicio "perfecto": el ejercicio que puedes cargar progresivamente y sin molestias es el bueno.

Errores comunes: cambiar de ejercicios cada semana (no hay progresión medible), volumen basura lejos del fallo y descuidar sueño y proteína (~1,6-2,2 g/kg/día).`,
  },
  {
    id: 'fuerza',
    category: 'ciencia',
    title: 'Fuerza máxima: principios de entrenamiento',
    keywords: ['fuerza', 'fuerza maxima', '1rm', 'powerlifting', 'cargas pesadas', 'intensidad'],
    content: `La fuerza es una habilidad: mejora por adaptaciones neurales (coordinación, reclutamiento) además de por músculo. Por eso exige especificidad y práctica frecuente de los levantamientos.

Principios:
- Intensidad: la mayor parte del trabajo entre el 75-90% del 1RM (series de 1-6 reps). No hace falta testar el 1RM a menudo; estima con RPE.
- Series y descanso: 3-6 series por básico con 2-5 min de descanso; el descanso corto penaliza la carga.
- Frecuencia: cada patrón (sentadilla, empuje, tirón, bisagra) 2-3 veces/semana con variación de intensidad.
- Progresión: lineal para novatos (+2,5-5 kg por sesión mientras funcione); después, ondular intensidades o bloques.
- La técnica es parte del rendimiento: registrar vídeos y trabajar rangos completos con control.

Señales de estancamiento: fallar reps de forma repetida, RPE disparado con cargas habituales o dolor articular creciente. Respuesta correcta: deload (bajar ~40-50% el volumen una semana), no apretar más.`,
  },
  {
    id: 'resistencia',
    category: 'ciencia',
    title: 'Resistencia cardiovascular y zonas de entrenamiento',
    keywords: ['resistencia', 'cardio', 'aerobico', 'vo2max', 'zonas', 'correr', 'ciclismo', 'zona 2'],
    content: `La resistencia mejora con una mezcla de mucho trabajo fácil y poco trabajo duro (distribución ~80/20).

- Zona 2 (puedes hablar con frases completas): la base. Mejora la eficiencia mitocondrial y la recuperación. 2-4 sesiones/semana de 30-60 min si el objetivo es salud o base aeróbica.
- Trabajo de alta intensidad (intervalos, HIIT): 1-2 sesiones/semana bastan. Mejora el VO2max con series de 1-5 min duras con recuperaciones similares.
- Indicadores útiles sin laboratorio: frecuencia cardiaca (Z2 ≈ 60-70% de la FC máxima estimada), test del habla y RPE.
- Compatibilidad con fuerza: el cardio suave apenas interfiere; separa el cardio intenso de la pierna pesada ≥6 h si puedes.

Para perder grasa, el cardio suma gasto, pero la palanca principal es el déficit calórico sostenido; la fuerza protege el músculo durante el proceso.`,
  },
  {
    id: 'periodizacion',
    category: 'ciencia',
    title: 'Periodización, mesociclos y deload',
    keywords: ['periodizacion', 'mesociclo', 'deload', 'descarga', 'planificacion', 'bloques', 'fatiga'],
    content: `Periodizar es gestionar fatiga y estímulo a lo largo del tiempo, no una fórmula mágica.

- Mesociclo típico: 4-6 semanas de progresión (subiendo volumen o carga) + 1 semana de descarga.
- Deload bien hecho: mantener los ejercicios, recortar volumen al 50-60% y carga al 80-90%. No es semana de sofá: es práctica sin fatiga.
- Cuándo adelantar el deload: sueño peor, RPE inflado con cargas normales, molestias articulares que se acumulan, motivación en caída. Dos o más señales a la vez = descarga ya.
- Modelos: lineal (novatos), ondulante diaria (intermedios que entrenan un patrón varias veces/semana), bloques (avanzados con picos concretos).
- Lo que de verdad rompe el progreso no es "no periodizar", es la inconsistencia. Un plan mediocre cumplido 6 meses gana a uno perfecto abandonado en 3 semanas.`,
  },
  {
    id: 'rpe-rir',
    category: 'ciencia',
    title: 'RPE y RIR: medir el esfuerzo',
    keywords: ['rpe', 'rir', 'esfuerzo', 'fallo', 'intensidad percibida', 'autorregulacion'],
    content: `- RIR: repeticiones en recámara al terminar la serie. RPE: escala 1-10; RPE 8 = 2 en recámara (RIR 2), RPE 10 = fallo.
- Uso práctico: hipertrofia en RPE 7-9 la mayoría de series; fuerza pesada en RPE 7-9 con singles/doubles ocasionales a 9-9,5; técnica nueva a RPE ≤7.
- Calibración: la mayoría subestima su RIR al principio (dice 2 y le quedan 5). Llevar alguna serie al fallo técnico de vez en cuando en ejercicios seguros (máquinas, aislamiento) recalibra.
- Autorregulación: si el peso habitual sale a RPE 9 cuando suele ser 7, hoy no es el día: mantén carga o recorta series. El plan es el mapa; el RPE es el tráfico.
- En FORGE, registrar el RPE de las series alimenta directamente la generación de las siguientes sesiones.`,
  },
  {
    id: 'tempo-tut',
    category: 'ciencia',
    title: 'Tempo y tiempo bajo tensión (TUT)',
    keywords: ['tempo', 'tut', 'tiempo bajo tension', 'excentrica', 'concentrica', 'fase negativa'],
    content: `El tempo se anota como tres cifras: excéntrica-pausa-concéntrica (p. ej. 3-1-1 = bajar en 3 s, pausa de 1 s, subir en 1 s).

- La excéntrica controlada (2-4 s) mejora la técnica, aumenta la tensión por rep y es útil en hipertrofia y en rehabilitación de tendinopatías (las excéntricas lentas y pesadas son terapia estándar).
- La concéntrica se ejecuta con intención de mover rápido aunque la carga vaya lenta: mejor reclutamiento.
- El TUT no es un objetivo en sí: sirve como herramienta cuando no puedes añadir carga (calistenia, material limitado) o para pulir control. No sustituye a la sobrecarga progresiva.
- Pausas en el estiramiento (p. ej. press banca con pausa en pecho) eliminan el rebote y son oro para fuerza y control.`,
  },
  {
    id: 'recuperacion',
    category: 'ciencia',
    title: 'Recuperación: sueño, agujetas y sobreentrenamiento',
    keywords: ['recuperacion', 'sueno', 'dormir', 'agujetas', 'doms', 'sobreentrenamiento', 'descanso', 'fatiga cronica'],
    content: `El entrenamiento es el estímulo; la mejora ocurre al recuperarte.

- Sueño: 7-9 h. Es el "suplemento" más potente que existe: menos sueño = menos fuerza, peor composición corporal y más lesiones.
- Agujetas (DOMS): pico a las 24-72 h, normales con ejercicios nuevos o mucho énfasis excéntrico. No son indicador de sesión buena ni impedimento para entrenar suave; el movimiento ligero las alivia.
- Sobrecarga no funcional / sobreentrenamiento: rendimiento cayendo semanas, sueño alterado, FC en reposo elevada, irritabilidad, infecciones frecuentes. Respuesta: reducir drásticamente 1-2 semanas y revisar sueño, calorías y estrés vital.
- Ayudas que funcionan: dormir, comer suficiente (sobre todo proteína), pasos diarios, gestionar estrés. Ayudas sobrevaloradas: hielo rutinario (puede atenuar adaptaciones), masaje-pistola como solución mágica, suplementos "recovery".`,
  },
  {
    id: 'sobrecarga-progresiva',
    category: 'ciencia',
    title: 'Sobrecarga progresiva: la regla número uno',
    keywords: ['sobrecarga progresiva', 'progresion', 'subir peso', 'estancamiento', 'progresar'],
    content: `Sin hacer más con el tiempo (más carga, más reps, mejor técnica, más rango), no hay adaptación. Todo lo demás son detalles.

Formas de progresar, por orden de prioridad práctica:
1. Más repeticiones con la misma carga (dentro del rango objetivo).
2. Más carga con las mismas repeticiones (cuando tocas techo del rango).
3. Más series (subir volumen semanal, con cuidado).
4. Mejor ejecución: más rango, más control, menos impulso — cuenta como progreso real.
5. Variantes más difíciles (clave en calistenia: flexión → flexión declinada → arquera → a una mano).

Reglas: registra todo (sin datos no hay progresión, hay sensaciones); cambios pequeños y frecuentes (+2,5 kg gana a +10 kg una vez al mes); si llevas 3+ sesiones sin progresar en un ejercicio, revisa sueño/comida, baja 10% la carga y reconstruye.`,
  },
  {
    id: 'calentamiento',
    category: 'ciencia',
    title: 'Calentamiento y movilidad útiles',
    keywords: ['calentamiento', 'movilidad', 'estiramientos', 'warm up', 'series de aproximacion', 'flexibilidad'],
    content: `Un calentamiento útil prepara exactamente lo que vas a hacer; no es una clase de estiramientos.

- Estructura (5-10 min): 2-3 min de pulso (comba, bici, caminar rápido) → movilidad específica de la sesión (cadera/tobillo si hay sentadilla; hombro/torácica si hay press) → series de aproximación del primer ejercicio (con la barra vacía y subiendo, 2-4 series de pocas reps, sin fatigarse).
- Estiramiento estático largo antes de fuerza puede restar rendimiento agudo; mejor al final o en sesiones aparte si buscas flexibilidad.
- La movilidad que se mantiene es la que se entrena con carga en rango completo (sentadilla profunda, press con pausa, peso muerto rumano bien hecho).
- Dolor articular al calentar que desaparece al entrar en calor = luz amarilla: vigilar. Dolor que aumenta con las series = luz roja: cambiar de ejercicio hoy.`,
  },
  {
    id: 'nutricion-basica',
    category: 'ciencia',
    title: 'Nutrición deportiva básica (no clínica)',
    keywords: ['nutricion', 'proteina', 'creatina', 'comer', 'dieta', 'suplementos', 'hidratacion', 'deficit', 'superavit'],
    content: `Generalidades con consenso amplio (para pautas clínicas o patologías, derivar a dietista-nutricionista):

- Proteína: 1,6-2,2 g/kg/día repartida en 3-5 tomas. Es la base para ganar músculo y para conservarlo al perder grasa.
- Energía: ganar músculo pide superávit pequeño (+200-400 kcal); perder grasa, déficit moderado (300-500 kcal) manteniendo proteína alta y fuerza.
- Creatina monohidrato: 3-5 g/día, el suplemento con más evidencia para rendimiento de fuerza. Cafeína pre-entreno también funciona.
- Hidratación: orina clara como guía diaria; en sesiones largas o con calor, añade sales.
- Alrededor del entrenamiento: comer proteína + carbohidrato en las horas previas o posteriores; la "ventana anabólica" es mucho más ancha de lo que se decía.
- Nada de esto sustituye consejo médico o dietético individualizado, especialmente con patologías metabólicas.`,
  },
];
