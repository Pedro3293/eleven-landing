'use client';

import { motion } from 'framer-motion';
import { Minus, Plus, SkipForward } from 'lucide-react';
import { TimerRing } from '@/components/ui/TimerRing';
import { Button } from '@/components/ui/Button';
import { formatClock } from './format';

export interface RestOverlayProps {
  remaining: number;
  total: number;
  nextLabel: string;
  onAdjust: (deltaSeconds: number) => void;
  onSkip: () => void;
}

/** Pantalla de descanso a tamaño completo: legible a un metro, con ±15s y saltar. */
export function RestOverlay({ remaining, total, nextLabel, onAdjust, onSkip }: RestOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-8 bg-bg/95 px-4 backdrop-blur"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-sm font-medium uppercase tracking-[0.25em] text-muted">Descanso</p>
      <TimerRing progress={total > 0 ? remaining / total : 0} label={formatClock(remaining)} sublabel={`de ${formatClock(total)}`} size={230} />
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="lg" onClick={() => onAdjust(-15)} aria-label="Quitar 15 segundos">
          <Minus className="h-4 w-4" aria-hidden /> 15s
        </Button>
        <Button variant="secondary" size="lg" onClick={() => onAdjust(15)} aria-label="Añadir 15 segundos">
          <Plus className="h-4 w-4" aria-hidden /> 15s
        </Button>
      </div>
      <p className="max-w-xs text-center text-sm text-muted">
        Siguiente: <span className="font-medium text-ink">{nextLabel}</span>
      </p>
      <Button variant="ghost" onClick={onSkip}>
        <SkipForward className="h-4 w-4" aria-hidden /> Saltar descanso
      </Button>
    </motion.div>
  );
}
