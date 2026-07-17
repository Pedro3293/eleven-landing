'use client';

import { useState } from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { formatKg } from './format';

export interface SetRowProps {
  index: number;
  targetReps: string;
  suggestedWeightKg: number | null;
  logged?: { reps: number; weightKg: number | null; rpe: number | null };
  usesWeight: boolean;
  onComplete: (data: { reps: number; weightKg: number | null; rpe: number | null }) => void;
}

/** Fila de serie: steppers grandes de reps/kg, cierre con un toque, edición al re-tocar. */
export function SetRow({ index, targetReps, suggestedWeightKg, logged, usesWeight, onComplete }: SetRowProps) {
  const [editing, setEditing] = useState(false);
  const [reps, setReps] = useState(logged?.reps ?? parseTargetReps(targetReps));
  const [weight, setWeight] = useState<number | null>(logged?.weightKg ?? suggestedWeightKg);
  const [rpe, setRpe] = useState<number | null>(logged?.rpe ?? null);

  const isDone = Boolean(logged) && !editing;

  if (isDone) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="flex min-h-[52px] w-full items-center justify-between rounded-control border border-line bg-surface-2/60 px-3 text-left"
        aria-label={`Serie ${index + 1} completada, tocar para editar`}
      >
        <span className="flex items-center gap-2 text-sm text-muted">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success"><Check className="h-4 w-4" /></span>
          Serie {index + 1}
        </span>
        <span className="numeric-display text-lg">
          {logged!.reps} reps{usesWeight ? ` · ${formatKg(logged!.weightKg)}` : ''}{logged!.rpe ? ` · RPE ${logged!.rpe}` : ''}
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-control border border-line bg-surface-2 p-3">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Serie {index + 1}</span>
        <span>Objetivo: {targetReps}{usesWeight && suggestedWeightKg != null ? ` · ${formatKg(suggestedWeightKg)}` : ''}</span>
      </div>
      {usesWeight && suggestedWeightKg == null && index === 0 && (
        <p className="text-xs text-muted">
          Primera vez con este ejercicio: elige una carga que te deje {targetReps} reps con esfuerzo controlado. A partir de hoy, la sugerimos nosotros.
        </p>
      )}
      <div className="flex items-center gap-3">
        <Stepper label="Reps" value={reps} onChange={(v) => setReps(Math.max(0, v))} step={1} />
        {usesWeight && (
          <Stepper
            label="Kg"
            value={weight ?? 0}
            onChange={(v) => setWeight(Math.max(0, Math.round(v * 4) / 4))}
            step={2.5}
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex flex-1 items-center gap-2 text-xs text-muted">
          RPE
          <select
            value={rpe ?? ''}
            onChange={(e) => setRpe(e.target.value ? Number(e.target.value) : null)}
            className="h-11 flex-1 rounded-control border border-line bg-surface px-2 text-sm text-ink"
            aria-label="Esfuerzo percibido (RPE)"
          >
            <option value="">—</option>
            {[6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </label>
        <button
          onClick={() => { setEditing(false); onComplete({ reps, weightKg: usesWeight ? weight : null, rpe }); }}
          className="flex h-12 flex-[2] items-center justify-center gap-2 rounded-control bg-accent font-semibold text-accent-ink active:brightness-90"
        >
          <Check className="h-5 w-5" aria-hidden /> Serie hecha
        </button>
      </div>
    </div>
  );
}

function Stepper({ label, value, onChange, step }: { label: string; value: number; onChange: (v: number) => void; step: number }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <span className="text-xs text-muted">{label}</span>
      <div className="flex w-full items-center justify-between rounded-control border border-line bg-surface">
        <button onClick={() => onChange(value - step)} aria-label={`Reducir ${label}`} className="flex h-12 w-12 items-center justify-center text-muted active:text-ink">
          <Minus className="h-5 w-5" />
        </button>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          aria-label={label}
          className="numeric-display w-14 bg-transparent text-center text-2xl focus:outline-none"
        />
        <button onClick={() => onChange(value + step)} aria-label={`Aumentar ${label}`} className="flex h-12 w-12 items-center justify-center text-muted active:text-ink">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function parseTargetReps(target: string): number {
  const n = parseInt(target, 10);
  return Number.isFinite(n) ? n : 10;
}
