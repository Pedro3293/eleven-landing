"use client";

import { motion, type Variants } from "framer-motion";
import { Target, Scale, BadgeCheck, ShieldCheck, Award, type LucideIcon } from "lucide-react";
import { content, type ValueKey } from "@/data/content";
import { Container } from "@/components/shared/Container";
import { EASE_STANDARD } from "@/lib/motion";

const VALUE_ICONS: Record<ValueKey, LucideIcon> = {
  realismo: Target,
  legalidad: Scale,
  profesionalidad: BadgeCheck,
  responsabilidad: ShieldCheck,
  excelencia: Award,
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: EASE_STANDARD } },
};

export function Values() {
  return (
    <section id="valores" aria-labelledby="valores-heading" className="bg-black-950 py-16 md:py-20 lg:py-24">
      <Container>
        <h2 id="valores-heading" className="sr-only">
          Valores de marca
        </h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-8 [&>*:last-child]:col-span-2 sm:grid-cols-3 sm:[&>*:last-child]:col-span-1 lg:grid-cols-5"
        >
          {content.values.map((value) => {
            const Icon = VALUE_ICONS[value.key];
            return (
              <motion.div
                key={value.key}
                variants={itemVariants}
                className="group flex flex-col items-center text-center"
              >
                <Icon
                  size={28}
                  strokeWidth={1.5}
                  className="text-steel-600 transition-colors duration-200 group-hover:text-red-600 lg:h-8 lg:w-8"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-heading text-sm font-medium uppercase tracking-[0.02em] text-white">
                  {value.title}
                </h3>
                <p className="mt-2 font-body text-sm leading-normal text-gray-300">{value.text}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
