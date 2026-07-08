"use client";

import { useRef, useState, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ChevronDown,
  Clock,
  Users,
  Crosshair,
  HeartPulse,
  DoorOpen,
  type LucideIcon,
} from "lucide-react";
import type { CourseItem } from "@/data/content";
import { EASE_STANDARD, EASE_TILT_RESET, TILT_SPRING } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface CourseCardProps {
  course: CourseItem;
  index: number;
}

const TILT_RANGE_DEG = 6;

// Los iconos se resuelven aquí (dentro del Client Component) y no se reciben
// como prop desde un Server Component: una referencia a función/componente
// no es serializable a través del límite server/client de React Server Components.
const COURSE_ICONS: Record<CourseItem["id"], LucideIcon> = {
  a: Users,
  b: Crosshair,
  c: HeartPulse,
  d: DoorOpen,
};

export function CourseCard({ course, index }: CourseCardProps) {
  const Icon = COURSE_ICONS[course.id];
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const interactive3d = canHover && !prefersReducedMotion;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, TILT_SPRING);
  const springY = useSpring(pointerY, TILT_SPRING);

  const rotateX = useTransform(springY, [-0.5, 0.5], [TILT_RANGE_DEG, -TILT_RANGE_DEG]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-TILT_RANGE_DEG, TILT_RANGE_DEG]);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (!interactive3d || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    pointerX.set(relativeX);
    pointerY.set(relativeY);
  }

  function handleMouseLeave() {
    if (!interactive3d) return;
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE_STANDARD, delay: index * 0.08 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={
          interactive3d
            ? {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
            : undefined
        }
        whileHover={interactive3d ? { scale: 1.02 } : undefined}
        transition={{ duration: 0.3, ease: EASE_TILT_RESET }}
        className="group flex h-full flex-col overflow-hidden rounded-md border border-gray-600 bg-gray-800 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
      >
        {/*
          No existe todavía fotografía real para las tarjetas de curso.
          TODO: sustituir este bloque por <Image> documental (aspect-[4/3])
          con el tratamiento de la sección 1.7 del design-spec cuando exista material real.
        */}
        <div
          aria-hidden="true"
          className="hero-noise relative flex aspect-[4/3] items-center justify-center bg-gradient-to-b from-black-900 to-black-950"
        >
          <Icon size={40} strokeWidth={1.5} className="text-steel-600" />
        </div>

        <div className="flex flex-1 flex-col p-6 lg:p-8">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-400">
            {course.audience}
          </span>
          <h3 className="mt-2 font-heading text-xl font-medium leading-snug text-white lg:text-2xl">
            {course.name}
          </h3>
          <p
            className={`mt-2 font-body text-sm leading-normal text-gray-300 ${
              expanded || interactive3d ? "" : "line-clamp-2"
            }`}
          >
            {course.description}
          </p>

          {/*
            Tap-to-expand: funcionalmente solo aplica en mobile/touch (sin 3D),
            pero se renderiza siempre (en vez de condicionarlo a `interactive3d`,
            que solo se conoce tras el montaje) para evitar el flash de
            hidratación en desktop. En su lugar, se oculta vía CSS con el mismo
            criterio de media query que activa el tilt 3D (incluye
            prefers-reduced-motion para no dejar el texto sin forma de expandirse
            en desktop cuando el tilt está desactivado por accesibilidad).
          */}
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
            className="mt-2 flex min-h-[48px] items-center gap-1 self-start text-sm font-semibold text-steel-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 [@media(hover:hover)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hidden"
          >
            {expanded ? "Ver menos" : "Ver más"}
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="inline-flex"
            >
              <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
            </motion.span>
          </button>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
            <Clock size={16} strokeWidth={1.5} className="text-steel-600" aria-hidden="true" />
            <span>{course.duration}</span>
          </div>

          <a
            href="#contacto"
            className="mt-6 inline-flex min-h-[48px] items-center text-sm font-semibold text-white underline-offset-4 transition-colors duration-200 group-hover:underline"
          >
            Ver programa
            <span aria-hidden="true" className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
