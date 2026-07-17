'use client';

export interface TimerRingProps {
  /** 0..1 fracción restante */
  progress: number;
  /** texto central (p.ej. "1:30") */
  label: string;
  sublabel?: string;
  size?: number;
  className?: string;
}

/** Anillo de progreso SVG con número display en el centro (timers del player). */
export function TimerRing({ progress, label, sublabel, size = 208, className = '' }: TimerRingProps) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} role="timer" aria-live="polite" aria-label={sublabel ? `${sublabel}: ${label}` : label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-2" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped)}
          className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="numeric-display text-6xl leading-none" style={{ fontSize: size * 0.26 }}>
          {label}
        </span>
        {sublabel && <span className="mt-1 text-sm text-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
