/**
 * Contenido centralizado de la landing de Eleven Level Group.
 * Todo el texto proviene VERBATIM de docs/copy.md (incluidos los
 * marcadores [PLACEHOLDER]). No editar el copy aquí sin actualizar
 * también el documento fuente.
 */

export interface PurposeStatement {
  number: string;
  title: string;
  text: string;
}

export interface CourseItem {
  id: "a" | "b" | "c" | "d";
  name: string;
  description: string;
  audience: string;
  duration: string;
}

export interface TimelineStep {
  number: string;
  title: string;
  text: string;
}

export type ValueKey =
  | "realismo"
  | "legalidad"
  | "profesionalidad"
  | "responsabilidad"
  | "excelencia";

export interface ValueItem {
  key: ValueKey;
  title: string;
  text: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
}

export interface CourseOption {
  value: string;
  label: string;
}

const purposeStatements: PurposeStatement[] = [
  {
    number: "01",
    title: "Elevar el nivel real de preparación",
    text: "Entrenar por encima del mínimo exigido. Que tu capacidad real esté a la altura de lo que tu trabajo te va a pedir.",
  },
  {
    number: "02",
    title: "Reducir el fallo humano en situaciones críticas",
    text: "Bajo presión no rindes al nivel de tus expectativas. Rindes al nivel de tu entrenamiento. Trabajamos ese nivel.",
  },
  {
    number: "03",
    title: "Crear estándar donde hay improvisación",
    text: "Procedimientos claros, criterios medibles y evaluación honesta. Donde otros improvisan, nosotros aplicamos método.",
  },
];

const courses: CourseItem[] = [
  {
    id: "a",
    name: "Tácticas de Intervención",
    description:
      "Procedimientos de intervención en entorno urbano y rural: aproximación, control de zona y coordinación de equipo. Trabajo sobre escenarios reales con evaluación individual y de unidad.",
    audience: "Militares y policías en activo",
    duration: "3 días intensivos",
  },
  {
    id: "b",
    name: "Manejo de Arma",
    description:
      "Fundamentos y perfeccionamiento del tiro: seguridad, manipulación, precisión y toma de decisiones. Progresión medida desde estático hasta ejercicios bajo estrés controlado.",
    audience: "Seguridad privada y fuerzas del orden",
    duration: "2 días",
  },
  {
    id: "c",
    name: "Primeros Auxilios Tácticos (TCCC)",
    description:
      "Atención a heridos en entorno hostil según protocolo TCCC: control de hemorragias, vía aérea y evacuación. Práctica con material real y simulación de baja en escenario.",
    audience: "Equipos de intervención",
    duration: "2 días",
  },
  {
    id: "d",
    name: "CQB",
    description:
      "Combate en espacios cerrados: entradas, progresión por estancias y trabajo en binomio. Técnica primero, velocidad después. Requiere habilitación legal acreditada.",
    audience: "Civiles habilitados y escoltas",
    duration: "3 días",
  },
];

const timeline: TimelineStep[] = [
  {
    number: "01",
    title: "Realismo",
    text: "Entrenamos en las condiciones en las que vas a actuar, no en las cómodas.",
  },
  {
    number: "02",
    title: "Legalidad",
    text: "Todo lo que enseñamos cabe dentro del marco legal. Sin excepciones.",
  },
  {
    number: "03",
    title: "Profesionalidad",
    text: "Instructores con experiencia operativa real y un programa con criterios definidos.",
  },
  {
    number: "04",
    title: "Responsabilidad",
    text: "Cada técnica se enseña con su contexto: cuándo aplicarla y cuándo no.",
  },
  {
    number: "05",
    title: "Excelencia",
    text: "No apruebas por asistir. Apruebas cuando alcanzas el estándar.",
  },
];

const values: ValueItem[] = [
  {
    key: "realismo",
    title: "Realismo",
    text: "Sales sabiendo lo que funciona bajo presión, no lo que solo funciona en el aula.",
  },
  {
    key: "legalidad",
    title: "Legalidad",
    text: "Tu formación no te compromete: cada curso respeta la normativa que te aplica.",
  },
  {
    key: "profesionalidad",
    title: "Profesionalidad",
    text: "Recibes instrucción de gente que ha hecho el trabajo, no solo el curso.",
  },
  {
    key: "responsabilidad",
    title: "Responsabilidad",
    text: "Aprendes capacidad y criterio. Una sin la otra no te sirve.",
  },
  {
    key: "excelencia",
    title: "Excelencia",
    text: "Tu certificado significa algo, porque no se regala.",
  },
];

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      '[PLACEHOLDER] "En el curso de TCCC practiqué el control de hemorragias hasta hacerlo sin pensar. Tres meses después lo apliqué en un servicio real."',
    name: "[PLACEHOLDER] Javier M.",
    role: "[PLACEHOLDER] Policía Nacional, unidad de intervención",
  },
  {
    id: "2",
    quote:
      '[PLACEHOLDER] "Llevaba ocho años como escolta. El curso de CQB me corrigió errores que arrastraba desde la academia."',
    name: "[PLACEHOLDER] Sergio R.",
    role: "[PLACEHOLDER] Escolta privado habilitado",
  },
  {
    id: "3",
    quote:
      '[PLACEHOLDER] "Nos evaluaron como unidad, no uno a uno. Es la primera formación externa que trabaja igual que nosotros."',
    name: "[PLACEHOLDER] Andrés L.",
    role: "[PLACEHOLDER] Sargento, Ejército de Tierra",
  },
];

const courseOptions: CourseOption[] = [
  { value: "tacticas-de-intervencion", label: "Tácticas de Intervención" },
  { value: "manejo-de-arma", label: "Manejo de Arma" },
  {
    value: "primeros-auxilios-tacticos-tccc",
    label: "Primeros Auxilios Tácticos (TCCC)",
  },
  { value: "cqb", label: "CQB" },
  { value: "no-lo-tengo-claro", label: "No lo tengo claro todavía" },
];

export const content = {
  hero: {
    headline: "Cuando el estándar no es suficiente",
    subheadline: "Formación operativa de élite. Nivel Once.",
    cta: "Inicia tu formación",
    ctaSecondary: "Ver cursos",
    support:
      "Cursos tácticos para militares, policías, seguridad privada y civiles habilitados. Instrucción real, con método y dentro de la ley.",
  },

  purpose: {
    intro:
      "La preparación real no se improvisa. Se entrena, se mide y se corrige. No formamos alumnos. Formamos operadores.",
    statements: purposeStatements,
  },

  courses,
  timeline,
  values,
  testimonials,

  /**
   * Microcopy estructural de sección (eyebrows, títulos de bloque, etc.)
   * que no proviene literalmente de una clave de docs/copy.md pero se
   * centraliza aquí para evitar cadenas de texto sueltas en los componentes.
   */
  sections: {
    courses: {
      eyebrow: "Oferta formativa",
      title: "Cursos",
    },
    timeline: {
      eyebrow: "Metodología",
      title: "Nuestro método",
    },
    testimonials: {
      eyebrow: "Testimonios",
      title: "Lo que dicen quienes ya han entrenado con nosotros",
    },
    directContact: {
      title: "Contacto",
      description:
        "¿Prefieres hablar directamente? Escríbenos y te respondemos en el mismo canal.",
    },
  },

  form: {
    title: "Solicita información",
    subtitle:
      "Cuéntanos tu situación y te respondemos con el curso que encaja contigo.",
    name: {
      label: "Nombre",
      placeholder: "Tu nombre y apellidos",
      error: "Necesitamos tu nombre para responderte.",
    },
    email: {
      label: "Email",
      placeholder: "tu@email.com",
      error: "Revisa el email: parece incompleto.",
    },
    phone: {
      label: "Teléfono",
      placeholder: "600 000 000",
      error: "Revisa el teléfono: parece incompleto.",
    },
    course: {
      label: "Curso de interés",
      placeholder: "Selecciona un curso",
      error: 'Selecciona un curso o marca "No lo tengo claro todavía".',
      options: courseOptions,
    },
    message: {
      label: "Mensaje",
      placeholder: "Tu unidad, empresa o situación, y qué buscas mejorar",
    },
    submit: "Solicitar información",
    success: "Recibido. Te contactamos en un plazo máximo de 48 horas laborables.",
    error:
      "No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
    whatsapp: "Escribir por WhatsApp",
  },

  footer: {
    tagline: "Formación operativa de élite. Nivel Once.",
    contact: {
      title: "Contacto",
      email: "[PLACEHOLDER — email real del cliente]",
      phone: "[PLACEHOLDER — teléfono real del cliente]",
      location: "[PLACEHOLDER — ciudad / instalaciones reales]",
    },
    nav: {
      courses: "Cursos",
      method: "Metodología",
      contact: "Contacto",
    },
    legal: {
      privacy: "Política de privacidad",
      terms: "Aviso legal",
      cookies: "Política de cookies",
    },
    copyright: "© 2026 Eleven Level Group. Todos los derechos reservados.",
    note: "Formación impartida conforme a la normativa vigente. Los cursos con arma requieren habilitación legal acreditada.",
  },

  seo: {
    title: "Eleven Level Group — Formación Operativa de Élite",
    description:
      "Cursos tácticos para militares, policías, seguridad privada y civiles habilitados. Intervención, tiro, TCCC y CQB. Inicia tu formación.",
  },
};
