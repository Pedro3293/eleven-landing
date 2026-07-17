'use client';

/**
 * Contenedor de la figura de músculos trabajados: carga el 3D en diferido y cae a
 * una silueta 2D SVG si el usuario prefiere menos movimiento o no hay WebGL.
 * El 3D nunca bloquea el resto del dashboard (DESCRIBE §5).
 */
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { zoneIntensities, type FigureZone } from './muscle-zones';

const MuscleFigure3D = dynamic(() => import('./MuscleFigure3D'), {
  ssr: false,
  loading: () => <FigurePlaceholder />,
});

export function MuscleFigure({ rows }: { rows: { muscleGroup: string; sets: number }[] }) {
  const reduced = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      setWebgl(Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl')));
    } catch {
      setWebgl(false);
    }
  }, []);

  const zones = zoneIntensities(rows);
  const use3D = webgl === true && !reduced;

  return (
    <div className="relative h-64 w-full" role="img" aria-label="Músculos trabajados en las últimas semanas">
      {webgl === null ? (
        <FigurePlaceholder />
      ) : use3D ? (
        <MuscleFigure3D zones={zones} animate={!reduced} />
      ) : (
        <Silhouette2D zones={zones} />
      )}
    </div>
  );
}

function FigurePlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-card bg-surface-2/50" aria-hidden />;
}

/** Fallback 2D: silueta frontal con zonas coloreadas por intensidad. */
function Silhouette2D({ zones }: { zones: Partial<Record<FigureZone, number>> }) {
  const fill = (z: FigureZone) => {
    const t = zones[z] ?? 0;
    const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
    return `rgb(${mix(42, 200)}, ${mix(46, 255)}, ${mix(52, 46)})`;
  };
  return (
    <svg viewBox="0 0 120 240" className="mx-auto h-full" aria-hidden>
      <circle cx="60" cy="22" r="12" fill="#2A2E34" />
      <ellipse cx="38" cy="52" rx="10" ry="9" fill={fill('shoulders')} />
      <ellipse cx="82" cy="52" rx="10" ry="9" fill={fill('shoulders')} />
      <rect x="42" y="46" width="36" height="26" rx="8" fill={fill('chest')} />
      <rect x="45" y="74" width="30" height="26" rx="8" fill={fill('core')} />
      <rect x="24" y="58" width="12" height="30" rx="6" fill={fill('arms')} />
      <rect x="84" y="58" width="12" height="30" rx="6" fill={fill('arms')} />
      <rect x="22" y="90" width="10" height="26" rx="5" fill={fill('forearms')} />
      <rect x="88" y="90" width="10" height="26" rx="5" fill={fill('forearms')} />
      <rect x="44" y="100" width="32" height="14" rx="7" fill={fill('glutes')} />
      <rect x="44" y="116" width="14" height="46" rx="7" fill={fill('quads')} />
      <rect x="62" y="116" width="14" height="46" rx="7" fill={fill('quads')} />
      <rect x="46" y="166" width="11" height="38" rx="5" fill={fill('calves')} />
      <rect x="63" y="166" width="11" height="38" rx="5" fill={fill('calves')} />
    </svg>
  );
}
