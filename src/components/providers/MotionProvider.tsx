"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

/**
 * Respeta `prefers-reduced-motion` globalmente (design-spec.md, sección 3,
 * regla 2). `reducedMotion="user"` hace que framer-motion reduzca
 * automáticamente las transiciones basadas en `animate`/`whileInView` a
 * cambios de opacidad cuando el usuario lo solicita a nivel de sistema.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
