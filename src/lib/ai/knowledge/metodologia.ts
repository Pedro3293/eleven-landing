import type { KnowledgeEntry } from './types';

export const METODOLOGIA: KnowledgeEntry[] = [
  {
    id: 'met-fullbody',
    category: 'metodologia',
    title: 'Full-Body con progresión lineal (principiantes)',
    keywords: ['full body', 'fullbody', 'cuerpo completo', 'principiante', 'progresion lineal', 'empezar'],
    content: `Todo el cuerpo en cada sesión, 2-3 días/semana, alrededor de los básicos (sentadilla, empuje, tirón, bisagra) y añadiendo peso cada sesión completada.

Por qué funciona en novatos: las primeras adaptaciones son sobre todo neurales; practicar los patrones a menudo con carga creciente aprovecha la "ventana de novato" (progreso sesión a sesión durante meses).

Claves: pocos ejercicios y siempre los mismos; 3 series de 5-8 en los principales; añadir 2,5 kg (tren superior) o 5 kg (inferior) cuando se completan todas las series; si se falla 3 veces seguidas, bajar ~10% y reconstruir.

Cuándo salir: cuando la progresión lineal muere de verdad (tras deloads y sueño en orden), suele ser el momento de pasar a Torso-Pierna o PPL con doble progresión.`,
  },
  {
    id: 'met-ppl',
    category: 'metodologia',
    title: 'Push · Pull · Legs (PPL)',
    keywords: ['ppl', 'push pull legs', 'empuje tiron pierna', 'split', 'torso'],
    content: `Divide por función: empuje (pecho, hombro, tríceps), tirón (espalda, bíceps) y pierna. Escala de 3 a 6 días/semana repitiendo el ciclo.

Fortalezas: mucho volumen por músculo sin sesiones eternas; fácil de recuperar porque los músculos no se pisan entre días; muy flexible con la frecuencia (3 días = frecuencia 1, 6 días = frecuencia 2).

Claves: empezar cada día con un básico pesado (press, remo/dominada, sentadilla) y rellenar con accesorios en rangos 8-15; doble progresión en todo; con 3-4 días/semana priorizar los básicos porque la frecuencia por músculo es baja.

Para quién: intermedios con objetivo estético o mixto que disfrutan entrenando ≥4 días. Con solo 2-3 días disponibles, Torso-Pierna o Full-Body reparten mejor.`,
  },
  {
    id: 'met-upper-lower',
    category: 'metodologia',
    title: 'Torso · Pierna (Upper/Lower)',
    keywords: ['torso pierna', 'upper lower', 'torso', 'pierna', '4 dias'],
    content: `Alterna días de torso y de pierna, normalmente 4 días/semana (2+2), con frecuencia 2 por músculo — el punto dulce entre estímulo y recuperación para la mayoría de intermedios.

Claves: cada día abre con 1-2 básicos pesados (5-8 reps) y cierra con accesorios (8-15); un día de torso puede sesgar a empuje y el otro a tirón para gestionar fatiga; pierna incluye rodilla-dominante (sentadilla), cadera-dominante (peso muerto rumano/hip thrust) y gemelo.

Con 2 días/semana también funciona (1 torso + 1 pierna) como mínimo eficaz.

Para quién: casi todo el mundo a partir de intermedio; el mejor equilibrio fuerza-hipertrofia-tiempo con agenda realista.`,
  },
  {
    id: 'met-hipertrofia-volumen',
    category: 'metodologia',
    title: 'Hipertrofia por volumen con doble progresión',
    keywords: ['hipertrofia volumen', 'doble progresion', 'bodybuilding', 'estetica', 'volumen alto'],
    content: `Enfoque culturista: volumen alto por grupo (llegando a 15-20 series/semana en músculos prioritarios), rangos 8-15, tempos controlados y descansos moderados (60-105 s en accesorios).

Doble progresión en la práctica: rango 8-12 → empiezas con un peso a 8 reps; cada sesión intentas añadir reps; cuando haces 12 en todas las series, subes carga y vuelves a 8.

Claves: la primera serie del día en cada ejercicio es la de referencia para progresar; llevar los aislamientos cerca del fallo (RIR 0-1) es seguro y necesario; los mesociclos cortos (4-5 semanas) con descarga encajan bien porque el volumen fatiga.

Para quién: intermedios/avanzados con objetivo principalmente estético, buena tolerancia al volumen y ganas de registrar todo.`,
  },
  {
    id: 'met-calistenia',
    category: 'metodologia',
    title: 'Calistenia progresiva (peso corporal)',
    keywords: ['calistenia', 'peso corporal', 'sin material', 'dominadas', 'flexiones', 'en casa', 'street workout'],
    content: `Fuerza e hipertrofia sin material usando progresiones de dificultad en lugar de discos.

Progresión por variantes (ejemplos):
- Empuje: flexión en pared → inclinada → estándar → declinada → arquera → a una mano.
- Tirón: remo invertido con mesa → dominada asistida (banda/salto negativo) → dominada → lastrada/arquera.
- Pierna: sentadilla → zancada → búlgara → pistol asistida → pistol.
- Core: plancha → hollow hold → dragon flag progresiones.

Claves: cuando superas ~12-15 reps limpias de una variante, pasa a la siguiente en 3-6 reps; el tempo lento y las pausas son tu "carga extra"; los modos por tiempo (EMOM/AMRAP/Tabata) añaden densidad metabólica.

Para quién: cualquier nivel entrenando en casa o de viaje; también como bloque de mantenimiento. Límite práctico: la pierna se queda corta de estímulo pesado a nivel avanzado sin lastre.`,
  },
  {
    id: 'met-elegir',
    category: 'metodologia',
    title: 'Cómo elegir metodología (y cuándo cambiar)',
    keywords: ['elegir metodologia', 'que rutina', 'cambiar rutina', 'cual me conviene', 'mejor rutina'],
    content: `La mejor metodología es la que encaja con tus días reales, tu material y tu nivel — y que puedas cumplir 8+ semanas.

Guía rápida:
- Principiante: Full-Body lineal (2-3 días). Progreso máximo por sesión invertida.
- 2-4 días, objetivo mixto: Torso-Pierna.
- ≥4 días, objetivo estético: PPL o Hipertrofia por volumen.
- Sin material o viajes frecuentes: Calistenia progresiva.

Cuándo cambiar de verdad: tu disponibilidad cambió, tu objetivo cambió o llevas 6+ semanas sin progresar con sueño y comida en orden. Cuándo NO cambiar: aburrimiento a la segunda semana (eso se arregla con variantes de accesorios, no tirando el plan). En FORGE puedes pedir el cambio desde el chat y se regenera el plan conservando tu historial.`,
  },
];
