"use client";

import { motion } from "framer-motion";
import { content } from "@/data/content";
import { Container } from "@/components/shared/Container";

const NAV_LINKS = [
  { href: "#cursos", label: content.footer.nav.courses },
  { href: "#metodologia", label: content.footer.nav.method },
  { href: "#contacto", label: content.footer.nav.contact },
];

const LEGAL_LINKS = [
  { href: "/politica-de-privacidad", label: content.footer.legal.privacy },
  { href: "/aviso-legal", label: content.footer.legal.terms },
  { href: "/politica-de-cookies", label: content.footer.legal.cookies },
];

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="border-t border-gray-600 bg-black-950 py-10 md:py-12 lg:py-16"
    >
      <Container>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <span className="inline-block max-w-[100px] font-heading text-base font-semibold uppercase leading-tight tracking-tight text-white">
              Eleven <span className="text-red-600">Level</span> Group
            </span>
            <p className="mt-4 font-body text-sm leading-relaxed text-gray-300">
              {content.footer.tagline}
            </p>
          </div>

          <nav aria-label="Navegación del footer">
            <ul className="flex flex-col gap-4 lg:flex-row lg:gap-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center font-body text-sm text-gray-300 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-xs">
            <h2 className="font-heading text-sm font-medium uppercase tracking-[0.02em] text-white">
              {content.footer.contact.title}
            </h2>
            <ul className="mt-4 flex flex-col gap-2 font-body text-sm text-gray-300">
              <li>{content.footer.contact.email}</li>
              <li>{content.footer.contact.phone}</li>
              <li>{content.footer.contact.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-gray-600 pt-8 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
          <p className="font-body text-xs uppercase tracking-[0.08em] text-gray-400">
            {content.footer.copyright}
          </p>
          <ul className="flex flex-col items-center gap-2 lg:flex-row lg:gap-6">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex min-h-[44px] items-center font-body text-xs uppercase tracking-[0.08em] text-gray-400 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 max-w-2xl font-body text-xs leading-relaxed text-gray-400">
          {content.footer.note}
        </p>
      </Container>
    </motion.footer>
  );
}
