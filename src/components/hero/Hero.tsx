"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { content } from "@/data/content";
import { EASE_STANDARD } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { CtaLink } from "@/components/shared/CtaLink";
import { Container } from "@/components/shared/Container";

/** Spring compartido de las capas 3D: lento y amortiguado, sin rebote. */
const TILT_SPRING = { stiffness: 60, damping: 20, mass: 0.6 };

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax de scroll: fondo 15%, numeral 25% (profundidad al desplazarse).
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const numeralY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const enableParallax = isDesktop && !prefersReducedMotion;

  // Efecto 3D por capas siguiendo el ratón (solo desktop + puntero fino +
  // sin reduced motion). La foto rota y se desplaza poco; el numeral se mueve en
  // sentido contrario y con más recorrido: la diferencia crea la profundidad.
  const reduced = Boolean(prefersReducedMotion);
  const enable3d = isDesktop && finePointer && !reduced;

  const mouseX = useMotionValue(0); // -0.5 .. 0.5 relativo al hero
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, TILT_SPRING);
  const springY = useSpring(mouseY, TILT_SPRING);

  const imgX = useTransform(springX, [-0.5, 0.5], [10, -10]);
  const imgY = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const imgRotateY = useTransform(springX, [-0.5, 0.5], [-2.2, 2.2]);
  const imgRotateX = useTransform(springY, [-0.5, 0.5], [1.8, -1.8]);
  const numeralX = useTransform(springX, [-0.5, 0.5], [-22, 22]);
  const numeralMouseY = useTransform(springY, [-0.5, 0.5], [-14, 14]);
  const crosshairX = useTransform(springX, [-0.5, 0.5], [6, -6]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!enable3d || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const headlineWords = content.hero.headline.split(" ");

  return (
    <div
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-black-950"
      style={{ perspective: enable3d ? 1200 : undefined }}
    >
      {/* Capa 1 — fotografía (stock provisional).
          Foto: silueta de operador, ZINO en Unsplash (licencia Unsplash,
          uso comercial permitido, sin atribución obligatoria).
          TODO: sustituir por fotografía real de ELG cuando exista, manteniendo
          el mismo tratamiento (monocromo + oscurecido, design-spec.md 1.7). */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          y: enableParallax ? parallaxY : "0%",
          willChange: enableParallax ? "transform" : undefined,
        }}
      >
        <motion.div
          className="hero-noise absolute inset-[-2%]"
          style={
            enable3d
              ? {
                  x: imgX,
                  y: imgY,
                  rotateX: imgRotateX,
                  rotateY: imgRotateY,
                  scale: 1.06,
                  transformStyle: "preserve-3d",
                }
              : undefined
          }
        >
          <Image
            fill
            priority
            sizes="100vw"
            src="/images/hero-operador.jpg"
            alt=""
            className="object-cover object-[58%_42%] md:object-[72%_50%]"
            style={{
              filter: "grayscale(1) brightness(0.7) contrast(1.12)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Capa 2 — retícula táctica, contra-movimiento leve. */}
      <motion.div
        aria-hidden="true"
        className="hero-crosshair absolute inset-0"
        style={enable3d ? { x: crosshairX } : undefined}
      />

      {/* Capa 3 — overlays de legibilidad. El lateral izquierdo protege el
          texto en desktop; en mobile cubriría toda la pantalla y mataría la
          foto, así que solo se aplica desde md. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 45%, rgba(10,10,10,0.25) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.30) 0%, rgba(10,10,10,0.50) 55%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Capa 4 — numeral "11": contorno acero, contra-parallax de ratón. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[3%] top-[6%] select-none md:top-[9%]"
        style={{ y: enableParallax ? numeralY : "0%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_STANDARD, delay: 0.3 }}
      >
        <motion.span
          className="hero-numeral block font-heading font-bold leading-none tracking-tighter"
          style={{
            fontSize: "clamp(9rem, 14vw + 4rem, 22rem)",
            ...(enable3d ? { x: numeralX, y: numeralMouseY } : {}),
          }}
        >
          11
        </motion.span>
      </motion.div>

      <div className="relative z-10 flex min-h-svh w-full flex-1 flex-col">
        <Container className="flex flex-1 flex-col">
          {/* Logotipo — sin archivo de marca disponible todavía. */}
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0.3, ease: EASE_STANDARD }
                : { duration: 0.6, ease: EASE_STANDARD, delay: 0 }
            }
            className="pt-8 md:pt-12"
          >
            {/* TODO: sustituir por el logotipo real (SVG/PNG) cuando esté disponible,
                manteniendo el ancho clamp definido abajo (15-20% del viewport en desktop). */}
            <span
              className="inline-block font-heading font-semibold uppercase leading-none tracking-tight text-white"
              style={{ width: "clamp(110px, 28vw, 220px)", fontSize: "clamp(1rem, 2.4vw, 1.5rem)" }}
            >
              Eleven <span className="text-red-600">Level</span> Group
            </span>
          </motion.div>

          {/* Bloque de contenido anclado al tercio inferior */}
          <div className="flex flex-1 flex-col justify-end gap-6 pb-16 md:pb-20 lg:pb-24">
            {/* Barra editorial roja + headline con reveal palabra a palabra. */}
            <div className="relative pl-5 md:pl-8">
              <motion.span
                aria-hidden="true"
                className="absolute bottom-1 left-0 top-1 w-[3px] origin-top bg-red-600"
                initial={reduced ? { opacity: 0 } : { scaleY: 0 }}
                animate={reduced ? { opacity: 1 } : { scaleY: 1 }}
                transition={
                  reduced
                    ? { duration: 0.3, ease: EASE_STANDARD }
                    : { duration: 0.7, ease: EASE_STANDARD, delay: 0.1 }
                }
              />
              <h1
                aria-label={content.hero.headline}
                className="max-w-3xl text-balance font-heading text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
              >
                {headlineWords.map((word, i) => (
                  <Fragment key={`${word}-${i}`}>
                    <span
                      aria-hidden="true"
                      className="inline-block overflow-hidden pb-1 align-top"
                    >
                      <motion.span
                        className="inline-block"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: "110%" }}
                        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        transition={
                          reduced
                            ? { duration: 0.3, ease: EASE_STANDARD, delay: 0.15 }
                            : {
                                duration: 0.55,
                                ease: EASE_STANDARD,
                                delay: 0.15 + i * 0.055,
                              }
                        }
                      >
                        {word}
                      </motion.span>
                    </span>
                    {/* El espacio debe vivir FUERA del inline-block: dentro colapsa. */}
                    {i < headlineWords.length - 1 ? " " : ""}
                  </Fragment>
                ))}
              </h1>

              <motion.p
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0.3, ease: EASE_STANDARD }
                    : { duration: 0.6, ease: EASE_STANDARD, delay: 0.45 }
                }
                className="mt-6 max-w-xl font-body text-xl font-medium leading-relaxed text-white md:text-2xl"
              >
                {content.hero.subheadline}
              </motion.p>
            </div>

            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={
                reduced
                  ? { duration: 0.3, ease: EASE_STANDARD }
                  : { duration: 0.6, ease: EASE_STANDARD, delay: 0.55 }
              }
              className="max-w-md pl-5 font-body text-base leading-relaxed text-gray-300 md:pl-8"
            >
              {content.hero.support}
            </motion.p>

            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={
                reduced
                  ? { duration: 0.3, ease: EASE_STANDARD }
                  : { duration: 0.5, ease: EASE_STANDARD, delay: 0.65 }
              }
              className="flex flex-col gap-3 pl-5 pt-2 sm:flex-row sm:gap-4 md:pl-8"
            >
              <CtaLink href="#contacto" variant="primary" className="w-full sm:w-auto">
                {content.hero.cta}
              </CtaLink>
              <CtaLink href="#cursos" variant="ghost" className="w-full sm:w-auto">
                {content.hero.ctaSecondary}
              </CtaLink>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Indicador de scroll: decorativo, solo desktop, respeta reduced motion. */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-3 md:flex"
      >
        <span
          className="font-body text-[11px] uppercase tracking-[0.35em] text-gray-400"
          style={{ writingMode: "vertical-rl" }}
        >
          Desliza
        </span>
        <div className="relative h-14 w-px overflow-hidden bg-white/15">
          {!reduced && (
            <motion.div
              className="absolute left-0 top-0 h-5 w-px bg-red-600"
              animate={{ y: [-20, 56] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
