"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { content } from "@/data/content";
import { EASE_STANDARD } from "@/lib/motion";
import { CONTACT_EMAIL, getWhatsAppUrl } from "@/lib/constants";

export function DirectContact() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 16 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: EASE_STANDARD }}
      className="flex flex-col justify-center gap-6 rounded-md border border-gray-600 bg-gray-800 p-8"
    >
      <h3 className="font-heading text-xl font-medium text-white lg:text-2xl">
        {content.sections.directContact.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-gray-300">
        {content.sections.directContact.description}
      </p>

      <div className="flex flex-col gap-4">
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-steel-600 bg-transparent px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
        >
          <MessageCircle size={20} strokeWidth={1.5} className="text-steel-400" aria-hidden="true" />
          {content.form.whatsapp}
        </a>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex min-h-[48px] items-center gap-2 font-body text-sm text-steel-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
        >
          <Mail size={20} strokeWidth={1.5} aria-hidden="true" />
          {CONTACT_EMAIL}
        </a>
      </div>
    </motion.div>
  );
}
