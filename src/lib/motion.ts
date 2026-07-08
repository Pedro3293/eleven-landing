/**
 * Valores de animación consolidados (design-spec.md, sección 3).
 * Mantener un único punto de verdad para easing/duraciones evita que
 * los componentes diverjan del sistema de movimiento definido.
 */

/** Easing estándar del sistema para animaciones de entrada (easeOutExpo-like). */
export const EASE_STANDARD: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Easing de reset de tilt 3D. */
export const EASE_TILT_RESET: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

/** Spring de tilt 3D (design-spec.md, sección 2.3). */
export const TILT_SPRING = { stiffness: 150, damping: 20, mass: 0.5 };

/**
 * Colores de paleta usados en animaciones vía motion values (ej. `backgroundColor`
 * animado del dot del timeline), donde Tailwind no puede resolver la clase por
 * tratarse de un valor interpolado en JS. Mantener sincronizado con
 * tailwind.config.ts / design-spec.md sección 1.1.
 */
export const COLOR_BLACK_950 = "#0A0A0A";
export const COLOR_RED_600 = "#A32020";
