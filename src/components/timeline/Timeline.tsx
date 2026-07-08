"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { content } from "@/data/content";
import { Container } from "@/components/shared/Container";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { COLOR_BLACK_950, COLOR_RED_600, EASE_STANDARD } from "@/lib/motion";

export function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 0.8", "end 0.2"],
  });

  return (
    <section
      id="metodologia"
      aria-labelledby="metodologia-heading"
      className="bg-black-950 py-16 md:py-20 lg:py-24"
    >
      <Container>
        <Eyebrow>{content.sections.timeline.eyebrow}</Eyebrow>
        <h2
          id="metodologia-heading"
          className="mt-2 max-w-2xl font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          {content.sections.timeline.title}
        </h2>

        <div ref={timelineRef} className="relative mt-12 md:mt-16">
          {/* Línea base, centrada bajo la columna de dots (w-4 = 16px, línea 2px). */}
          <div aria-hidden="true" className="absolute left-2 top-0 h-full w-[2px] bg-gray-600" />
          {/* Relleno de línea ligado al scroll (design-spec.md, sección 2.4). */}
          <motion.div
            aria-hidden="true"
            className="absolute left-2 top-0 h-full w-[2px] origin-top bg-red-600"
            style={prefersReducedMotion ? { scaleY: 1 } : { scaleY: scrollYProgress }}
          />

          <ol className="flex flex-col gap-16 lg:gap-20">
            {content.timeline.map((step) => (
              <TimelineStepItem key={step.number} number={step.number} title={step.title} text={step.text} />
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

function TimelineStepItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.li
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -16 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, ease: EASE_STANDARD }}
      className="flex gap-6 lg:gap-8"
    >
      <div className="flex w-4 flex-none justify-center pt-1">
        <TimelineDot />
      </div>
      <div className="flex-1 pb-1">
        <span className="block text-sm text-steel-400">{number}</span>
        <h3 className="mt-1 font-heading text-xl font-semibold uppercase tracking-tight text-white lg:text-2xl">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl font-body text-sm leading-normal text-gray-300">{text}</p>
      </div>
    </motion.li>
  );
}

function TimelineDot() {
  return (
    <motion.span
      aria-hidden="true"
      initial={{ backgroundColor: COLOR_BLACK_950 }}
      whileInView={{ backgroundColor: COLOR_RED_600 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.3 }}
      className="h-4 w-4 flex-none rounded-full border-2 border-red-600"
    />
  );
}
