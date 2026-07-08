"use client";

import { motion, type Variants } from "framer-motion";
import { content } from "@/data/content";
import { Container } from "@/components/shared/Container";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { EASE_STANDARD } from "@/lib/motion";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
};

export function Testimonials() {
  return (
    <section
      id="testimonios"
      aria-labelledby="testimonios-heading"
      className="bg-black-900 py-16 md:py-20 lg:py-24"
    >
      <Container>
        <Eyebrow>{content.sections.testimonials.eyebrow}</Eyebrow>
        <h2
          id="testimonios-heading"
          className="mt-2 max-w-2xl font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          {content.sections.testimonials.title}
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-8 md:mt-16 lg:grid-cols-3"
        >
          {content.testimonials.map((testimonial) => (
            <motion.figure
              key={testimonial.id}
              variants={itemVariants}
              className="relative overflow-hidden rounded-md border-l-2 border-red-600 bg-gray-800 p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-2 left-4 font-heading text-6xl font-bold text-steel-600 opacity-10"
              >
                &ldquo;
              </span>
              <blockquote className="relative z-10 font-body text-lg leading-relaxed text-white">
                {testimonial.quote}
              </blockquote>
              <figcaption className="relative z-10 mt-6">
                <span className="block font-body text-base font-semibold text-white">
                  {testimonial.name}
                </span>
                <span className="mt-1 block font-body text-sm text-gray-300">
                  {testimonial.role}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
