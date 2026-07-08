"use client";

import { useEffect, useState } from "react";

/**
 * Suscribe un componente a un media query y devuelve si coincide.
 * Se evalúa una sola vez al montar y se actualiza ante cambios reales
 * (ej. rotación de dispositivo, conexión de mouse externo en tablet).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}
