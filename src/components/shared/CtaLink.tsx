import type { ReactNode } from "react";

interface CtaLinkProps {
  href: string;
  variant: "primary" | "ghost";
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

const BASE_CLASSES =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold uppercase tracking-wide transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-steel-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black-950";

const VARIANT_CLASSES: Record<CtaLinkProps["variant"], string> = {
  primary: "bg-red-600 text-white hover:bg-red-700",
  ghost: "border border-steel-600 bg-transparent text-white hover:bg-white/5",
};

/** CTA reutilizable (Hero, Contacto, WhatsApp). Área táctil mínima 48px. */
export function CtaLink({ href, variant, children, className = "", ariaLabel }: CtaLinkProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
