/**
 * Traducción determinista de nombres de ejercicios EN → ES.
 * Estrategia: overrides exactos → frases (greedy, la más larga primero) → tokens sueltos.
 * Los términos de equipamiento y posición se recolocan como sufijos ("con mancuernas", "sentado").
 * Lo que no se reconoce se conserva tal cual (mejor un término EN que una traducción inventada).
 */

const EXACT: Record<string, string> = {
  '3/4 sit-up': 'Encogimiento 3/4',
  'air bike': 'Bicicleta de aire',
  'bear crawl': 'Desplazamiento del oso',
  'burpee': 'Burpee',
  'dead bug': 'Dead bug',
  'bird dog': 'Bird dog',
  'jumping jack': 'Jumping jacks',
  'mountain climber': 'Escaladores',
  'russian twist': 'Giro ruso',
  'superman': 'Superman',
  'inchworm': 'Oruga (inchworm)',
  'wall sit': 'Sentadilla isométrica en pared',
  'shoulder tap push-up': 'Flexión con toque de hombro',
  'dumbbell around pullover': 'Pullover circular con mancuernas',
  'farmers walk': 'Paseo del granjero',
  "farmer's walk": 'Paseo del granjero',
};

// Frases núcleo del movimiento (se aplican de más larga a más corta)
const PHRASES: [string, string][] = [
  ['bench press', 'press de banca'],
  ['chest press', 'press de pecho'],
  ['shoulder press', 'press de hombros'],
  ['military press', 'press militar'],
  ['overhead press', 'press por encima de la cabeza'],
  ['push press', 'push press'],
  ['floor press', 'press en el suelo'],
  ['pin press', 'press desde soportes'],
  ['jm press', 'press JM'],
  ['lat pulldown', 'jalón al pecho'],
  ['pulldown', 'jalón'],
  ['pull-up', 'dominada'],
  ['pull up', 'dominada'],
  ['chin-up', 'dominada supina'],
  ['chin up', 'dominada supina'],
  ['muscle up', 'muscle-up'],
  ['push-up', 'flexión de brazos'],
  ['push up', 'flexión de brazos'],
  ['pushdown', 'extensión en polea'],
  ['triceps extension', 'extensión de tríceps'],
  ['tricep extension', 'extensión de tríceps'],
  ['triceps dip', 'fondo de tríceps'],
  ['tricep dip', 'fondo de tríceps'],
  ['kickback', 'patada de tríceps'],
  ['skull crusher', 'press francés'],
  ['biceps curl', 'curl de bíceps'],
  ['bicep curl', 'curl de bíceps'],
  ['hammer curl', 'curl martillo'],
  ['preacher curl', 'curl en banco Scott'],
  ['concentration curl', 'curl concentrado'],
  ['drag curl', 'curl arrastrado'],
  ['zottman curl', 'curl Zottman'],
  ['spider curl', 'curl araña'],
  ['wrist curl', 'curl de muñeca'],
  ['reverse curl', 'curl invertido'],
  ['leg curl', 'curl femoral'],
  ['leg extension', 'extensión de cuádriceps'],
  ['leg press', 'prensa de piernas'],
  ['leg raise', 'elevación de piernas'],
  ['knee raise', 'elevación de rodillas'],
  ['calf raise', 'elevación de talones'],
  ['calf press', 'prensa de gemelos'],
  ['front raise', 'elevación frontal'],
  ['lateral raise', 'elevación lateral'],
  ['rear delt fly', 'apertura posterior'],
  ['rear delt row', 'remo para deltoide posterior'],
  ['rear delt', 'deltoide posterior'],
  ['delt raise', 'elevación de deltoides'],
  ['good morning', 'buenos días'],
  ['hip thrust', 'hip thrust'],
  ['hip raise', 'elevación de cadera'],
  ['hip abduction', 'abducción de cadera'],
  ['hip adduction', 'aducción de cadera'],
  ['hip extension', 'extensión de cadera'],
  ['hip circles', 'círculos de cadera'],
  ['glute bridge', 'puente de glúteos'],
  ['pelvic tilt', 'basculación pélvica'],
  ['deadlift', 'peso muerto'],
  ['romanian deadlift', 'peso muerto rumano'],
  ['stiff leg deadlift', 'peso muerto piernas rígidas'],
  ['straight leg deadlift', 'peso muerto piernas rectas'],
  ['sumo deadlift', 'peso muerto sumo'],
  ['rack pull', 'rack pull'],
  ['split squat', 'sentadilla búlgara'],
  ['hack squat', 'sentadilla hack'],
  ['front squat', 'sentadilla frontal'],
  ['goblet squat', 'sentadilla goblet'],
  ['overhead squat', 'sentadilla por encima de la cabeza'],
  ['pistol squat', 'sentadilla a una pierna'],
  ['sissy squat', 'sentadilla sissy'],
  ['jump squat', 'sentadilla con salto'],
  ['box squat', 'sentadilla al cajón'],
  ['zercher squat', 'sentadilla Zercher'],
  ['squat', 'sentadilla'],
  ['walking lunge', 'zancada caminando'],
  ['side lunge', 'zancada lateral'],
  ['lunge', 'zancada'],
  ['step up', 'subida al cajón'],
  ['step-up', 'subida al cajón'],
  ['bent over row', 'remo inclinado'],
  ['bent-over row', 'remo inclinado'],
  ['upright row', 'remo al mentón'],
  ['seated row', 'remo sentado'],
  ['t-bar row', 'remo en barra T'],
  ['low row', 'remo bajo'],
  ['high row', 'remo alto'],
  ['shotgun row', 'remo a un brazo en polea'],
  ['inverted row', 'remo invertido'],
  ['row', 'remo'],
  ['shrug', 'encogimiento de hombros'],
  ['pullover', 'pullover'],
  ['fly', 'apertura'],
  ['crossover', 'cruce de poleas'],
  ['crunch', 'encogimiento abdominal'],
  ['sit-up', 'incorporación abdominal (sit-up)'],
  ['sit up', 'incorporación abdominal (sit-up)'],
  ['v-up', 'V-up'],
  ['plank', 'plancha'],
  ['side bend', 'flexión lateral de tronco'],
  ['trunk rotation', 'rotación de tronco'],
  ['back extension', 'extensión lumbar'],
  ['hyperextension', 'hiperextensión'],
  ['reverse hyperextension', 'hiperextensión inversa'],
  ['dip', 'fondo'],
  ['dips', 'fondos'],
  ['clean and press', 'cargada y press'],
  ['clean and jerk', 'dos tiempos (clean & jerk)'],
  ['power clean', 'cargada de potencia'],
  ['hang clean', 'cargada colgante'],
  ['clean', 'cargada'],
  ['snatch', 'arrancada'],
  ['thruster', 'thruster'],
  ['swing', 'swing'],
  ['turkish get up', 'levantamiento turco'],
  ['get up', 'levantamiento'],
  ['windmill', 'molino'],
  ['halo', 'halo'],
  ['wood chop', 'leñador'],
  ['woodchop', 'leñador'],
  ['chop', 'leñador'],
  ['face pull', 'face pull'],
  ['straight arm pulldown', 'jalón con brazos rectos'],
  ['chest fly', 'apertura de pecho'],
  ['flyes', 'aperturas'],
  ['full squat', 'sentadilla profunda'],
  ['hip lift', 'elevación de cadera'],
  ['hip thrusts', 'hip thrust'],
  ['pin presses', 'press desde soportes'],
  ['presses', 'press'],
  ['hamstring stretch', 'estiramiento de isquios'],
  ['lat stretch', 'estiramiento de dorsal'],
  ['triceps stretch', 'estiramiento de tríceps'],
  ['piriformis stretch', 'estiramiento del piriforme'],
  ['adductor stretch', 'estiramiento de aductores'],
  ['abductor stretch', 'estiramiento de abductores'],
  ['calf stretch', 'estiramiento de gemelos'],
  ['chest stretch', 'estiramiento de pecho'],
  ['shoulder stretch', 'estiramiento de hombro'],
  ['quad stretch', 'estiramiento de cuádriceps'],
  ['quadriceps stretch', 'estiramiento de cuádriceps'],
  ['hip flexor stretch', 'estiramiento del flexor de cadera'],
  ['neck stretch', 'estiramiento de cuello'],
  ['back stretch', 'estiramiento de espalda'],
  ['spine stretch', 'estiramiento de columna'],
  ['glute stretch', 'estiramiento de glúteos'],
  ['groin stretch', 'estiramiento de aductores'],
  ['upward facing dog', 'perro boca arriba'],
  ['downward facing dog', 'perro boca abajo'],
  ['t bar row', 'remo en barra T'],
  ['outer', 'externo'],
  ['inner', 'interno'],
  ['forward', 'hacia delante'],
  ['backward', 'hacia atrás'],
  ['with support', 'con apoyo'],
  ['lift', 'elevación'],
  ['neck flexion', 'flexión de cuello'],
  ['neck extension', 'extensión de cuello'],
  ['neck rotation', 'rotación de cuello'],
  ['wrist rotation', 'rotación de muñeca'],
  ['wrist extension', 'extensión de muñeca'],
  ['external rotation', 'rotación externa'],
  ['internal rotation', 'rotación interna'],
  ['ankle circles', 'círculos de tobillo'],
  ['run', 'carrera'],
  ['running', 'carrera'],
  ['walk', 'caminata'],
  ['walking', 'caminata'],
  ['sprint', 'esprint'],
  ['jump rope', 'comba'],
  ['high knees', 'rodillas al pecho'],
  ['butt kicks', 'talones al glúteo'],
  ['box jump', 'salto al cajón'],
  ['broad jump', 'salto horizontal'],
  ['tuck jump', 'salto agrupado'],
  ['jump', 'salto'],
  ['stretch', 'estiramiento'],
  ['march', 'marcha'],
  ['hold', 'isométrico'],
  ['iron cross', 'cruz de hierro'],
  ['around the world', 'alrededor del mundo'],
  ['dead hang', 'suspensión pasiva'],
  ['hanging', 'en suspensión'],
  ['scissors', 'tijeras'],
  ['flutter kicks', 'patadas de crol'],
  ['hip flexor', 'flexor de cadera'],
  ['toe touch', 'toque de puntas'],
  ['heel touch', 'toque de talones'],
  ['ab wheel rollout', 'rueda abdominal'],
  ['rollout', 'rodamiento (rollout)'],
  ['roller', 'rueda'],
  ['bridge', 'puente'],
  ['rotation', 'rotación'],
  ['extension', 'extensión'],
  ['flexion', 'flexión'],
  ['raise', 'elevación'],
  ['curl', 'curl'],
  ['press', 'press'],
  ['twist', 'giro'],
  ['circles', 'círculos'],
  ['crawl', 'desplazamiento'],
  ['kick', 'patada'],
  ['pull', 'tirón'],
  ['push', 'empuje'],
  ['exercise', 'ejercicio'],
];

// Equipamiento → sufijo "con/en X". Se detectan como palabras iniciales o sueltas.
const EQUIPMENT: Record<string, string> = {
  'dumbbell': 'con mancuernas',
  'dumbbells': 'con mancuernas',
  'barbell': 'con barra',
  'ez barbell': 'con barra EZ',
  'ez bar': 'con barra EZ',
  'olympic barbell': 'con barra olímpica',
  'trap bar': 'con barra hexagonal',
  'cable': 'en polea',
  'lever': 'en máquina de palanca',
  'smith': 'en multipower',
  'sled': 'en trineo/prensa',
  'kettlebell': 'con kettlebell',
  'band': 'con banda elástica',
  'resistance band': 'con banda elástica',
  'medicine ball': 'con balón medicinal',
  'stability ball': 'sobre fitball',
  'exercise ball': 'sobre fitball',
  'bosu ball': 'sobre bosu',
  'wheel roller': 'con rueda abdominal',
  'roller': 'con rueda',
  'wheel': 'con rueda',
  'rope': 'con cuerda',
  'hammer': 'en máquina Hammer',
  'weighted': 'con lastre',
  'assisted': 'asistido',
  'bodyweight': 'con peso corporal',
  'suspension': 'en suspensión',
  'suspended': 'en suspensión',
  'olympic': 'olímpico',
};

// Posición/estilo → sufijo adjetivo
const MODIFIERS: Record<string, string> = {
  'seated': 'sentado',
  'standing': 'de pie',
  'lying': 'tumbado',
  'prone': 'boca abajo',
  'supine': 'boca arriba',
  'kneeling': 'de rodillas',
  'incline': 'inclinado',
  'decline': 'declinado',
  'flat': 'plano',
  'reverse': 'invertido',
  'reverse grip': 'con agarre invertido',
  'close grip': 'con agarre cerrado',
  'close-grip': 'con agarre cerrado',
  'wide grip': 'con agarre ancho',
  'wide-grip': 'con agarre ancho',
  'neutral grip': 'con agarre neutro',
  'mixed grip': 'con agarre mixto',
  'underhand': 'con agarre supino',
  'overhand': 'con agarre prono',
  'palm rotational': 'con rotación de muñeca',
  'alternate': 'alterno',
  'alternating': 'alterno',
  'single arm': 'a un brazo',
  'single-arm': 'a un brazo',
  'one arm': 'a un brazo',
  'one-arm': 'a un brazo',
  'two arm': 'a dos brazos',
  'two-arm': 'a dos brazos',
  'single leg': 'a una pierna',
  'single-leg': 'a una pierna',
  'one leg': 'a una pierna',
  'one-leg': 'a una pierna',
  'two leg': 'a dos piernas',
  'cross body': 'cruzado',
  'cross-body': 'cruzado',
  'behind the head': 'tras nuca',
  'behind neck': 'tras nuca',
  'behind the back': 'por detrás de la espalda',
  'behind back': 'por detrás de la espalda',
  'overhead': 'por encima de la cabeza',
  'bent over': 'inclinado',
  'bent-over': 'inclinado',
  'bent knee': 'con rodillas flexionadas',
  'straight leg': 'con piernas rectas',
  'straight arm': 'con brazos rectos',
  'straight bar': 'con barra recta',
  'v bar': 'con barra en V',
  'v. bar': 'con barra en V',
  'twisting': 'con giro',
  'weighted': 'lastrado',
  'side': 'lateral',
  'front': 'frontal',
  'rear': 'posterior',
  'low': 'bajo',
  'high': 'alto',
  'full': 'completo',
  'half': 'medio',
  'wide': 'ancho',
  'narrow': 'estrecho',
  'deep': 'profundo',
  'quick': 'rápido',
  'slow': 'lento',
  'isometric': 'isométrico',
  'jumping': 'con salto',
  'walking': 'caminando',
  'rocking': 'con balanceo',
  'modified': 'modificado',
  'self assisted': 'autoasistido',
  'self-assisted': 'autoasistido',
  'machine': 'en máquina',
  'narrow stance': 'con postura estrecha',
  'wide stance': 'con postura ancha',
  'exercise ball': 'sobre fitball',
  'stability ball': 'sobre fitball',
  'suspended': 'en suspensión',
  'twisted': 'con giro',
  'upright': 'erguido',
  'plate': 'con disco',
  'towel': 'con toalla',
  'chair': 'con silla',
  'bench': 'en banco',
  'floor': 'en el suelo',
  'wall': 'en pared',
  'parallel bars': 'en paralelas',
  'zigzag': 'en zigzag',
};

// Tokens sueltos de partes del cuerpo / misc para el núcleo
const TOKENS: Record<string, string> = {
  'chest': 'de pecho',
  'shoulder': 'de hombro',
  'shoulders': 'de hombros',
  'back': 'de espalda',
  'lat': 'dorsal',
  'lats': 'dorsales',
  'leg': 'de pierna',
  'legs': 'de piernas',
  'arm': 'de brazo',
  'arms': 'de brazos',
  'hip': 'de cadera',
  'waist': 'de cintura',
  'neck': 'de cuello',
  'wrist': 'de muñeca',
  'ankle': 'de tobillo',
  'calf': 'de gemelos',
  'calves': 'de gemelos',
  'glute': 'de glúteo',
  'glutes': 'de glúteos',
  'quad': 'de cuádriceps',
  'hamstring': 'de isquios',
  'triceps': 'de tríceps',
  'tricep': 'de tríceps',
  'biceps': 'de bíceps',
  'bicep': 'de bíceps',
  'forearm': 'de antebrazo',
  'forearms': 'de antebrazos',
  'ab': 'abdominal',
  'abs': 'abdominales',
  'abdominal': 'abdominal',
  'oblique': 'oblicuo',
  'obliques': 'oblicuos',
  'core': 'del core',
  'body': 'corporal',
  'upper': 'superior',
  'lower': 'inferior',
  'trunk': 'de tronco',
  'torso': 'de torso',
  'spine': 'de columna',
  'knee': 'de rodilla',
  'knees': 'de rodillas',
  'toe': 'de puntillas',
  'heel': 'de talón',
  'elbow': 'de codo',
  'up': 'arriba',
  'down': 'abajo',
  'to': 'a',
  'and': 'y',
  'with': 'con',
  'on': 'sobre',
};

const PAREN_NOTES: Record<string, string> = {
  'male': '',
  'female': '',
  'version 2': 'versión 2',
  'version 3': 'versión 3',
  'version 4': 'versión 4',
  'v. 2': 'versión 2',
  'v. 3': 'versión 3',
  'on stability ball': 'sobre fitball',
  'with stability ball': 'con fitball',
  'on bench': 'en banco',
  'with bench': 'con banco',
  'with arm blaster': 'con arm blaster',
  'with rope': 'con cuerda',
  'with towel': 'con toalla',
  'with chair': 'con silla',
  'with v-bar': 'con barra en V',
  'on floor': 'en el suelo',
  'on knees': 'de rodillas',
};

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const EQUIPMENT_KEYS = Object.keys(EQUIPMENT).sort((a, b) => b.length - a.length);
const MODIFIER_KEYS = Object.keys(MODIFIERS).sort((a, b) => b.length - a.length);
const SORTED_PHRASES = [...PHRASES].sort((a, b) => b[0].length - a[0].length);

// Tokens del nombre que corresponden a cada valor del campo `equipment` del dataset.
// Solo se extraen como equipamiento los tokens coherentes con ese campo; así "hammer curl"
// con mancuernas no pierde su "hammer" (que ahí es tipo de agarre, no máquina).
const EQUIPMENT_FIELD_TOKENS: Record<string, string[]> = {
  'dumbbell': ['dumbbell', 'dumbbells'],
  'barbell': ['barbell'],
  'ez barbell': ['ez barbell', 'ez bar'],
  'olympic barbell': ['olympic barbell', 'barbell', 'olympic'],
  'trap bar': ['trap bar'],
  'cable': ['cable'],
  'leverage machine': ['lever'],
  'smith machine': ['smith'],
  'sled machine': ['sled'],
  'hammer': ['hammer'],
  'kettlebell': ['kettlebell'],
  'band': ['band'],
  'resistance band': ['resistance band', 'band'],
  'medicine ball': ['medicine ball'],
  'stability ball': ['stability ball', 'exercise ball'],
  'bosu ball': ['bosu ball'],
  'wheel roller': ['wheel roller', 'roller', 'wheel'],
  'roller': ['roller'],
  'rope': ['rope'],
  'weighted': ['weighted'],
  'assisted': ['assisted'],
  'body weight': ['bodyweight'],
};

/**
 * Traduce un nombre de ejercicio del dataset a español. Determinista.
 * `equipment` (campo del dataset) limita qué tokens se interpretan como equipamiento.
 */
export function translateExerciseName(nameEn: string, equipment?: string): string {
  const lower = nameEn.toLowerCase().trim();
  if (EXACT[lower]) return EXACT[lower];

  // 1. Separar notas entre paréntesis
  const notes: string[] = [];
  let core = lower.replace(/\(([^)]*)\)/g, (_, note: string) => {
    const n = note.trim();
    const t = PAREN_NOTES[n];
    if (t !== undefined) {
      if (t) notes.push(t);
    } else {
      notes.push(translateFragment(n));
    }
    return ' ';
  });

  core = core.replace(/\s+/g, ' ').trim();

  // 2. Extraer equipamiento y modificadores (en cualquier posición, palabra completa)
  const allowedEquipment = equipment
    ? (EQUIPMENT_FIELD_TOKENS[equipment.toLowerCase().trim()] ?? [])
    : EQUIPMENT_KEYS;
  const suffixes: string[] = [];
  for (const key of EQUIPMENT_KEYS.filter((k) => allowedEquipment.includes(k))) {
    const re = new RegExp(`(?:^|\\s)${escapeRe(key)}(?=\\s|$)`);
    if (re.test(core)) {
      core = core.replace(re, ' ').replace(/\s+/g, ' ').trim();
      suffixes.push(EQUIPMENT[key]);
    }
  }
  const modSuffixes: string[] = [];
  for (const key of MODIFIER_KEYS) {
    const re = new RegExp(`(?:^|\\s)${escapeRe(key)}(?=\\s|$)`);
    if (re.test(core)) {
      // no extraer palabras que forman parte de una frase núcleo presente
      if (SORTED_PHRASES.some(([p]) => p.includes(key) && core.includes(p))) continue;
      core = core.replace(re, ' ').replace(/\s+/g, ' ').trim();
      modSuffixes.push(MODIFIERS[key]);
    }
  }

  // 3. Traducir el núcleo del movimiento
  const coreEs = translateFragment(core);

  const parts = [coreEs, ...modSuffixes, ...suffixes, ...notes].filter(Boolean);
  const joined = parts
    .join(' ')
    .replace(/\s+/g, ' ')
    // colapsa duplicados de conectores generados por composición ("sobre sobre fitball")
    .replace(/\b(sobre|con|en|de|a) \1\b/g, '$1')
    .trim();
  return cap(joined);
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Traduce un fragmento con frases (greedy) y tokens. Conserva lo no reconocido. */
function translateFragment(fragment: string): string {
  let out = ` ${fragment} `;
  for (const [en, es] of SORTED_PHRASES) {
    out = out.replace(new RegExp(`(?<=\\s)${escapeRe(en)}(?=\\s)`, 'g'), es);
  }
  const words = out.trim().split(/\s+/).map((w) => {
    const key = w.toLowerCase();
    return TOKENS[key] !== undefined ? TOKENS[key] : w;
  });
  return words.filter(Boolean).join(' ');
}
