import type { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  className?: string;
  as?: "span" | "div";
}

/** Etiqueta pequeña de sección (H4/Eyebrow), design-spec.md sección 1.2. */
export function Eyebrow({ children, className = "", as = "span" }: EyebrowProps) {
  const Tag = as;
  return (
    <Tag
      className={`block text-sm font-semibold uppercase tracking-[0.08em] text-steel-400 ${className}`}
    >
      {children}
    </Tag>
  );
}
