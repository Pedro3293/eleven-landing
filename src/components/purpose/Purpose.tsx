"use client";

import { motion, type Variants } from "framer-motion";
import { content } from "@/data/content";
import { Container } from "@/components/shared/Container";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { EASE_STANDARD } from "@/lib/motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD },
  },
};

export function Purpose() {
  return (
    <section id="proposito" aria-labelledby="proposito-heading" className="bg-black-900 py-16 md:py-20 lg:py-24">
      <Container>
        <h2 id="proposito-heading" className="sr-only">
          Propósito
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE_STANDARD }}
          className="max-w-3xl font-body text-lg leading-relaxed text-white md:text-xl"
        >
          {content.purpose.intro}
        </motion.p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-12 flex flex-col gap-12 md:mt-16 md:gap-16"
        >
          {content.purpose.statements.map((statement) => (
            <motion.div key={statement.number} variants={itemVariants} className="max-w-3xl">
              <Eyebrow>{statement.number}</Eyebrow>
              <h3 className="mt-2 font-heading text-2xl font-semibold leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                {statement.title}
              </h3>
              <p className="mt-4 font-body text-base leading-relaxed text-gray-300 md:text-lg">
                {statement.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
