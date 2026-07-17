import type { KnowledgeEntry } from './types';

/**
 * Condiciones de salud que afectan al rendimiento: cómo impactan y cómo adaptar
 * el entrenamiento. TODAS las entradas son educativas: el entrenamiento con
 * patología requiere autorización y seguimiento del médico que la trata.
 */
export const SALUD: KnowledgeEntry[] = [
  {
    id: 'hipotiroidismo',
    category: 'salud',
    title: 'Hipotiroidismo y entrenamiento',
    keywords: ['hipotiroidismo', 'tiroides', 'hashimoto', 'levotiroxina', 'eutirox', 'metabolismo lento'],
    content: `Qué notarás en el rendimiento: con hipotiroidismo no tratado o mal ajustado — fatiga desproporcionada, intolerancia al frío, recuperación lenta, dolores musculares, tendencia a ganar peso y frecuencia cardiaca baja. Con la medicación bien ajustada, el rendimiento puede ser prácticamente normal.

Cómo adaptar:
- La regla de oro es entrenar según el día real, no el planificado: usa el RPE y recorta volumen los días de fatiga alta (FORGE lo hace con tus check-ins).
- Fuerza 2-3 días/semana con volumen moderado + mucha actividad suave (pasos, Z2): combinación mejor tolerada que el alto volumen o el HIIT frecuente.
- Progresa más despacio de lo estándar y prioriza el sueño: la privación de sueño agrava los síntomas.
- Los calambres y dolores musculares persistentes con analítica desfasada son motivo de revisión, no de "apretar más".

Deriva SIEMPRE: el ajuste es médico (TSH/T4 y dosis). Si notas fatiga inusual sostenida, caída de rendimiento sin explicación o palpitaciones (posible sobredosificación), consulta a tu endocrino. FORGE no ajusta ni interpreta medicación.`,
  },
  {
    id: 'hipertiroidismo',
    category: 'salud',
    title: 'Hipertiroidismo y entrenamiento',
    keywords: ['hipertiroidismo', 'graves', 'tirotoxicosis', 'taquicardia', 'perdida de peso involuntaria'],
    content: `Qué notarás: taquicardia en reposo y esfuerzo, intolerancia al calor, pérdida de peso y masa muscular, temblor, ansiedad, fatiga precoz. El músculo puede debilitarse (miopatía tiroidea), sobre todo en muslos y hombros.

Cómo adaptar:
- Con hipertiroidismo NO controlado, el ejercicio intenso está desaconsejado: la frecuencia cardiaca ya va alta y el riesgo de arritmia aumenta. Hasta el control médico: actividad suave (caminar, movilidad) si el médico lo aprueba.
- Ya controlado: reintroducir fuerza de forma gradual empezando con cargas moderadas; la masa perdida se recupera, pero lleva meses.
- Evita entrenar con calor intenso y vigila la hidratación.
- El pulso es tu semáforo: si la FC de reposo sube semanas seguidas o notas palpitaciones al mínimo esfuerzo, para y consulta.

Deriva SIEMPRE: control endocrino imprescindible. Palpitaciones, dolor torácico o disnea desproporcionada = detener la sesión y consultar; si son intensos, urgencias.`,
  },
  {
    id: 'diabetes-tipo-1',
    category: 'salud',
    title: 'Diabetes tipo 1 y entrenamiento',
    keywords: ['diabetes tipo 1', 'dm1', 'insulina', 'hipoglucemia', 'glucemia', 'bomba de insulina'],
    content: `El ejercicio es muy beneficioso en DM1, pero exige gestionar la glucemia activamente porque el músculo consume glucosa durante y HASTA 24-48 h después (mayor sensibilidad a la insulina).

Claves prácticas (a pactar con tu endocrino/educador):
- Mide antes de entrenar. Orientación habitual: <90 mg/dl, toma carbohidrato antes de empezar; 90-250, adelante; >250 con cetonas, NO entrenes.
- El cardio continuo tiende a BAJAR la glucemia; la fuerza intensa y los intervalos pueden SUBIRLA transitoriamente. Muchas personas van mejor haciendo fuerza primero y cardio después.
- Lleva siempre carbohidrato rápido a mano. Hipoglucemia (temblor, sudor frío, confusión) = parar y tratar de inmediato.
- Vigila la hipoglucemia tardía (esa noche o al día siguiente), sobre todo tras sesiones largas o novedosas.
- La regularidad (mismo horario, sesiones parecidas) hace la glucemia mucho más predecible; FORGE ayuda porque las sesiones son consistentes y registradas.

Deriva SIEMPRE: pauta de insulina y ajustes por ejercicio son del equipo de diabetes. Esta app no da pautas de dosificación.`,
  },
  {
    id: 'diabetes-tipo-2',
    category: 'salud',
    title: 'Diabetes tipo 2 y entrenamiento',
    keywords: ['diabetes tipo 2', 'dm2', 'resistencia insulina', 'prediabetes', 'metformina', 'glucosa alta'],
    content: `El entrenamiento es TRATAMIENTO de primera línea en DM2: el músculo es el mayor consumidor de glucosa del cuerpo, y tanto la fuerza como el cardio mejoran la sensibilidad a la insulina y la HbA1c.

Cómo enfocar:
- Combinación ganadora: fuerza 2-3 días/semana + actividad aeróbica regular (150+ min/semana) + romper el sedentarismo (caminar 10-15 min tras las comidas baja los picos de glucosa de forma medible).
- No hace falta intensidad heroica: la consistencia manda. Empezar suave y progresar es más eficaz que sesiones extenuantes esporádicas.
- Si usas insulina o sulfonilureas, hay riesgo de hipoglucemia con el ejercicio: coordina horarios y mide (ver también la entrada de diabetes tipo 1).
- Con neuropatía periférica: revisa los pies a diario, calzado bien ajustado y prioriza opciones de bajo impacto si hay pérdida de sensibilidad.
- Con retinopatía avanzada: evita Valsalva y cargas máximas hasta el visto bueno del oftalmólogo.

Deriva SIEMPRE: ajuste de medicación, complicaciones (pies, ojos, riñón) y objetivos de glucemia son de tu equipo médico.`,
  },
  {
    id: 'hipertension',
    category: 'salud',
    title: 'Hipertensión arterial y entrenamiento',
    keywords: ['hipertension', 'tension alta', 'presion arterial', 'hta', 'tension arterial'],
    content: `El ejercicio regular BAJA la tensión (efecto comparable a un fármaco de primera línea: −5 a −8 mmHg de media), y la fuerza bien hecha es segura y recomendada en hipertensión controlada.

Cómo adaptar:
- Evita la maniobra de Valsalva prolongada (bloquear la respiración empujando): espira en el esfuerzo. Es el punto técnico más importante.
- Prefiere series de 8-15 reps con RPE ≤8 frente a máximos absolutos; evita isométricos largos con cargas altas y ejercicios cabeza abajo.
- Descansos completos entre series (la tensión sube con descansos muy cortos y series al fallo).
- Cardio Z2 frecuente: es de lo más eficaz que existe para la tensión de reposo.
- Entrena DESPUÉS de tomar tu medicación habitual, no en ayunas de fármaco; con betabloqueantes, la FC no sirve de guía — usa el RPE.

Señales de parar hoy: tensión de reposo ≥180/110, dolor de cabeza intenso, visión borrosa o dolor torácico → no entrenar y consultar (los dos últimos, urgencias). Con HTA no controlada, primero control médico, luego progresión.`,
  },
  {
    id: 'asma',
    category: 'salud',
    title: 'Asma y broncoconstricción por ejercicio',
    keywords: ['asma', 'broncoespasmo', 'inhalador', 'ventolin', 'ahogo', 'sibilancias', 'ejercicio frio'],
    content: `El asma bien controlada no impide entrenar a ningún nivel (hay medallistas olímpicos asmáticos). El broncoespasmo inducido por ejercicio aparece típicamente a los 5-15 min de esfuerzo intenso, especialmente con aire frío y seco.

Cómo adaptar:
- Calentamiento largo y progresivo (10-15 min): reduce mucho la incidencia del broncoespasmo ("periodo refractario").
- Lleva SIEMPRE el inhalador de rescate a la sesión; si tu médico te pautó usarlo preventivamente antes del ejercicio, hazlo.
- La fuerza con descansos se tolera mejor que el cardio continuo intenso; los intervalos cortos mejor que los esfuerzos largos.
- Aire frío: bufanda/braga sobre la boca o entrena indoor los días malos; evita entrenar fuerte durante crisis de polen si te afecta.
- Síntomas frecuentes al entrenar (tos, sibilancias, opresión) = el asma no está bien controlada → revisión médica de la pauta de base.

Crisis durante la sesión: parar, rescate, posición sentada. Si no revierte en minutos o hay labios azulados/dificultad para hablar → urgencias.`,
  },
  {
    id: 'obesidad',
    category: 'salud',
    title: 'Obesidad: entrenar con exceso de peso',
    keywords: ['obesidad', 'sobrepeso', 'imc alto', 'mucho peso', 'empezar con sobrepeso'],
    content: `El mejor plan es el que protege articulaciones y adherencia mientras el déficit hace su trabajo. El peso corporal ya es "carga": los progresos de fuerza relativa llegan rápido.

Cómo enfocar:
- Fuerza desde el día 1 (2-3 días/semana): conserva músculo en déficit, mejora la glucemia y la autonomía. Máquinas, poleas y mancuernas dan estabilidad y confianza al principio.
- Impacto bajo al empezar: caminar, bici, elíptica, natación; el impacto de correr llega mejor tras perder parte del peso y fortalecer pierna.
- Variantes: hay alternativa para todo (sentadilla al cajón, flexiones inclinadas, remo en máquina). En FORGE, pide sustituciones sin complejos: la buena ejecución manda.
- Progreso real más allá de la báscula: cargas, reps, perímetros, fotos, escalones sin ahogo. Regístralo todo.
- El calor y la sudoración castigan más: hidrata y usa descansos completos sin culpa.

Deriva: con IMC alto + otra patología (HTA, DM2, apnea del sueño) conviene chequeo médico antes de intensidades altas; el dietista-nutricionista es el aliado principal del proceso.`,
  },
  {
    id: 'osteoporosis',
    category: 'salud',
    title: 'Osteoporosis y salud ósea',
    keywords: ['osteoporosis', 'osteopenia', 'densidad osea', 'huesos', 'fractura', 'menopausia'],
    content: `El hueso responde a la carga: el entrenamiento de fuerza con cargas progresivas y el impacto moderado son de las pocas cosas que FRENAN y pueden revertir parcialmente la pérdida de densidad. El estudio LIFTMOR demostró que el levantamiento pesado supervisado es seguro y eficaz incluso en mujeres posmenopáusicas con osteoporosis.

Cómo adaptar:
- Prioriza ejercicios que cargan columna y cadera en compresión: sentadilla, peso muerto (patrón bisagra bien enseñado), prensa, press por encima de la cabeza.
- EVITA la flexión de columna cargada y con impulso (encogimientos con lastre, giros rusos con peso, máquinas de flexión de tronco): es el mecanismo típico de fractura vertebral.
- Añade trabajo de equilibrio y potencia suave (sentarse-levantarse rápido, subir escalones): prevenir caídas previene fracturas.
- El cardio sin carga (nadar, bici) es sano pero NO estimula el hueso: no puede ser lo único.
- Progresión más lenta de lo estándar y técnica impecable antes que carga.

Deriva SIEMPRE: con osteoporosis diagnosticada o fracturas previas, el plan de cargas debe tener el visto bueno de tu médico/reumatólogo, idealmente con fisioterapeuta al inicio.`,
  },
  {
    id: 'artrosis',
    category: 'salud',
    title: 'Artrosis y dolor articular crónico',
    keywords: ['artrosis', 'artritis', 'desgaste', 'rodilla desgastada', 'cartilago', 'dolor articular'],
    content: `El ejercicio es el tratamiento no farmacológico nº1 de la artrosis: el músculo fuerte descarga la articulación y el movimiento nutre el cartílago. El reposo prolongado EMPEORA la artrosis.

Cómo adaptar:
- Fortalece los músculos que cruzan la articulación dolorosa (artrosis de rodilla → cuádriceps e isquios; cadera → glúteos). Empieza con rangos cómodos y máquinas si dan seguridad.
- Regla del dolor aceptable: molestia ≤3-4/10 durante el ejercicio que vuelve a su nivel basal en <24 h = luz verde. Dolor que sube sesión a sesión = recorta rango/carga, no lo elimines todo.
- Los brotes existen: en días malos, baja a isométricos y movilidad; en días buenos, progresa.
- Bajo impacto para el volumen cardiovascular (bici, nadar, caminar), pero la carga progresiva de fuerza no es negociable.
- Perder un 5-10% de peso corporal reduce el dolor de rodilla de forma clínicamente relevante.

Deriva: dolor nocturno que no cede, bloqueo articular, derrame o deformidad progresiva → traumatólogo/reumatólogo. Fisioterapeuta para dosificar el inicio si el dolor manda.`,
  },
  {
    id: 'lumbalgia',
    category: 'salud',
    title: 'Dolor lumbar y entrenamiento',
    keywords: ['lumbalgia', 'lumbago', 'espalda baja', 'hernia', 'ciatica', 'dolor de espalda'],
    content: `El dolor lumbar inespecífico (la gran mayoría) mejora con movimiento y fuerza progresiva; el reposo en cama lo cronifica. Un lumbar fuerte es un lumbar protegido.

Cómo adaptar:
- En fase aguda: movimiento suave frecuente (caminar, gato-camello, movilidad de cadera). Evita solo lo que dispara el dolor, no todo.
- Al reconstruir: bisagra de cadera con progresión paciente (peso muerto rumano con poco peso, hip thrust, buenos días sin carga) + core anti-movimiento (planchas, press Pallof, bird dog) antes que flexiones de tronco repetidas.
- La sentadilla y el peso muerto NO son enemigos: mal dosificados hacen daño, bien progresados son la mejor protección. Vuelve a ellos gradualmente.
- Señal clave: el dolor que se centraliza (baja de la pierna hacia la espalda) es buena señal; el que se periferaliza (baja hacia el pie) pide revisión.

Deriva URGENTE si hay: pérdida de fuerza en pierna/pie, alteración de esfínteres, anestesia en silla de montar o dolor nocturno constante con fiebre/pérdida de peso. Ciática persistente >4-6 semanas → médico/fisioterapeuta.`,
  },
  {
    id: 'cardiopatia',
    category: 'salud',
    title: 'Cardiopatías: entrenar con enfermedad cardiovascular',
    keywords: ['cardiopatia', 'corazon', 'infarto', 'arritmia', 'insuficiencia cardiaca', 'stent', 'marcapasos', 'angina'],
    content: `Con enfermedad cardiovascular conocida (infarto previo, angina, insuficiencia, arritmias, valvulopatías), el ejercicio es beneficioso PERO debe prescribirse desde cardiología / rehabilitación cardiaca. FORGE solo acompaña dentro de los límites que te hayan marcado.

Principios generales que aplican casi siempre:
- Zona segura pactada: entrena en las intensidades autorizadas por tu cardiólogo (a menudo definidas por FC o RPE tras una ergometría). Con betabloqueantes, guíate por RPE, no por pulso.
- Progresión muy gradual, calentamiento y vuelta a la calma largos, evitar esfuerzos máximos súbitos, Valsalva e isométricos pesados salvo autorización.
- Hidratación y evitar calor extremo; no entrenar con infección febril (riesgo de miocarditis: también aplica a personas sanas).

DETÉN la sesión y busca atención si aparecen: dolor/opresión en pecho, brazo o mandíbula; disnea desproporcionada; palpitaciones sostenidas; mareo o síncope. Ante dolor torácico en curso: emergencias (112), no "aguantar la serie".

Esta entrada no sustituye la valoración cardiológica: sin autorización médica explícita, limita el trabajo a actividad suave.`,
  },
  {
    id: 'anemia',
    category: 'salud',
    title: 'Anemia y rendimiento',
    keywords: ['anemia', 'hierro', 'ferritina', 'hemoglobina', 'fatiga', 'palidez'],
    content: `La anemia (hemoglobina baja) reduce el transporte de oxígeno: notarás fatiga precoz, disnea con esfuerzos que antes eran fáciles, pulso alto para el mismo ritmo, palidez y a veces mareo. El déficit de hierro SIN anemia (ferritina baja) ya penaliza el rendimiento de resistencia.

Cómo adaptar:
- Con anemia significativa sin tratar: baja la intensidad a suave-moderada; el HIIT y las sesiones largas de cardio son las que más se resienten y más marean.
- La fuerza con descansos completos se tolera relativamente bien; recorta volumen y no persigas récords hasta corregir la causa.
- Población de riesgo en deporte: mujeres con menstruación abundante, corredores de fondo, dietas veganas/vegetarianas mal planificadas y donantes frecuentes.
- La mejora tras tratar es notable pero tarda semanas (la analítica va por delante de las sensaciones).

Deriva SIEMPRE: la anemia es un hallazgo, no un diagnóstico — la causa la estudia tu médico (ferropenia, pérdidas, B12...). No te suplementes hierro a ciegas: en exceso es perjudicial.`,
  },
  {
    id: 'fibromialgia',
    category: 'salud',
    title: 'Fibromialgia y fatiga crónica',
    keywords: ['fibromialgia', 'fatiga cronica', 'dolor generalizado', 'sensibilidad central'],
    content: `En fibromialgia, el ejercicio gradual es de las pocas intervenciones con evidencia consistente de mejora del dolor y la calidad de vida — pero dosificado, porque el "boom-bust" (pasarse un día bueno y pagar tres) es la trampa habitual.

Cómo adaptar:
- Empieza por DEBAJO de lo que puedes hacer (sí, aunque parezca poco) y progresa muy despacio: la tolerancia se construye sin brotes.
- Fuerza suave 2 días/semana (cargas ligeras, RPE ≤6-7, pocas series) + actividad aeróbica amable (caminar, agua templada, bici suave).
- Consistencia sobre intensidad: sesiones cortas frecuentes ganan a sesiones duras espaciadas.
- Los días de brote no son fracaso: reduce a movilidad y camina algo; retomar suave cuanto antes acorta el brote.
- Sueño y estrés son parte del tratamiento; los check-ins de energía y dolor en FORGE sirven para autorregular el plan.

Deriva: el diagnóstico y el manejo global (sueño, fármacos, terapia) son médicos (reumatología). Un fisioterapeuta con experiencia en dolor crónico ayuda mucho a dosificar.`,
  },
  {
    id: 'embarazo',
    category: 'salud',
    title: 'Embarazo y posparto',
    keywords: ['embarazo', 'embarazada', 'posparto', 'gestacion', 'suelo pelvico', 'diastasis'],
    content: `En embarazos sin contraindicación médica, el ejercicio (incluida la fuerza moderada) es seguro y recomendado: menos diabetes gestacional, mejor control de peso y mejor recuperación posparto.

Principios generales (siempre con el visto bueno de tu obstetra/matrona):
- Continuar es más fácil que empezar: quien ya entrenaba puede mantener versiones moderadas; quien empieza, hacerlo suave y progresivo.
- Evitar desde el 1er trimestre: deportes de contacto/caída, calor extremo, Valsalva intensa y máximos. Desde el 2º: ejercicio tumbada boca arriba prolongado si provoca mareo.
- RPE ≤7 y "test del habla" como guía; hidratación generosa.
- Suelo pélvico: trabajarlo durante y después; pesadez perineal o pérdidas de orina al entrenar = bajar impacto y consultar con fisioterapeuta de suelo pélvico.
- Posparto: retorno GRADUAL (semanas de caminar y core profundo antes de impacto o cargas exigentes); revisar diástasis abdominal.

Señales de parar y consultar: sangrado, contracciones regulares, pérdida de líquido, mareo intenso, dolor torácico o disminución de movimientos fetales.`,
  },
  {
    id: 'tendinopatia',
    category: 'salud',
    title: 'Tendinopatías (tendinitis crónicas)',
    keywords: ['tendinitis', 'tendinopatia', 'tendon', 'codo de tenista', 'hombro de nadador', 'rotuliano', 'aquiles', 'epicondilitis'],
    content: `Los tendones se adaptan a la carga, pero más despacio que el músculo: la tendinopatía suele aparecer al subir la carga más rápido de lo que el tendón tolera (o volver fuerte tras un parón).

Manejo con mejor evidencia:
- El reposo total NO cura la tendinopatía: la descondiciona. El tratamiento es CARGA progresiva dosificada.
- Fase sensible: isométricos (empujar sin movimiento 30-45 s × 4-5) alivian el dolor y mantienen el tendón trabajando.
- Reconstrucción: trabajo lento y pesado (excéntricas o tempo 3-0-3) 2-3 veces/semana, subiendo carga con la regla del dolor ≤3-4/10 que remite en 24 h.
- Reduce temporalmente lo que irrita (saltos, agarres máximos, rangos extremos), no lo elimines para siempre: reintrodúcelo gradualmente.
- Paciencia real: 6-12 semanas de trabajo consistente; los altibajos son parte del proceso.

Deriva: dolor que no mejora tras 4-6 semanas de carga bien dosificada, chasquido con pérdida súbita de fuerza (posible rotura) o dolor nocturno constante → fisioterapeuta/traumatólogo.`,
  },
];
