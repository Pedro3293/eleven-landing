'use client';

/**
 * Timers de modos especiales: EMOM, AMRAP, Tabata y TUT.
 * Al terminar, entrega un resumen para registrarlo como serie.
 */
import { useEffect, useRef, useState } from 'react';
import { Minus, Pause, Play, Plus, Square } from 'lucide-react';
import { TimerRing } from '@/components/ui/TimerRing';
import { Button } from '@/components/ui/Button';
import { usePlayerAudio } from './usePlayerAudio';
import { formatClock } from './format';

export interface ModeTimerProps {
  mode: 'emom' | 'amrap' | 'tabata' | 'tut';
  totalSeconds: number;
  onFinish: (result: { rounds: number; seconds: number }) => void;
}

const TABATA_WORK = 20;
const TABATA_REST = 10;

export function ModeTimer({ mode, totalSeconds, onFinish }: ModeTimerProps) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [rounds, setRounds] = useState(0);
  const { tick, done } = usePlayerAudio();
  const lastBeepRef = useRef(-1);

  const remaining = Math.max(0, totalSeconds - elapsed);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Señales por modo
  useEffect(() => {
    if (!running || elapsed === lastBeepRef.current) return;
    lastBeepRef.current = elapsed;

    if (remaining <= 3 && remaining > 0) tick();
    if (remaining === 0) {
      done();
      setRunning(false);
      onFinish({ rounds: mode === 'emom' ? Math.ceil(totalSeconds / 60) : rounds, seconds: totalSeconds });
      return;
    }
    if (mode === 'emom' && elapsed > 0 && elapsed % 60 === 0) done();
    if (mode === 'tabata') {
      const phasePos = elapsed % (TABATA_WORK + TABATA_REST);
      if (phasePos === 0 || phasePos === TABATA_WORK) done();
    }
  }, [elapsed, running, remaining, mode, rounds, totalSeconds, tick, done, onFinish]);

  const phase = (() => {
    if (mode === 'emom') return `Minuto ${Math.floor(elapsed / 60) + 1} de ${Math.ceil(totalSeconds / 60)}`;
    if (mode === 'tabata') {
      const pos = elapsed % (TABATA_WORK + TABATA_REST);
      const round = Math.floor(elapsed / (TABATA_WORK + TABATA_REST)) + 1;
      return pos < TABATA_WORK ? `TRABAJO · ronda ${round}` : `descansa · ronda ${round}`;
    }
    if (mode === 'amrap') return 'AMRAP: máximas rondas';
    return 'Tiempo bajo tensión';
  })();

  const innerLabel = (() => {
    if (mode === 'emom') return formatClock(60 - (elapsed % 60));
    if (mode === 'tabata') {
      const pos = elapsed % (TABATA_WORK + TABATA_REST);
      return formatClock(pos < TABATA_WORK ? TABATA_WORK - pos : TABATA_WORK + TABATA_REST - pos);
    }
    return formatClock(remaining);
  })();

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      <TimerRing progress={totalSeconds > 0 ? remaining / totalSeconds : 0} label={innerLabel} sublabel={phase} size={210} />
      {mode === 'amrap' && (
        <div className="flex items-center gap-4" aria-label="Contador de rondas">
          <Button variant="secondary" onClick={() => setRounds((r) => Math.max(0, r - 1))} aria-label="Quitar ronda"><Minus className="h-4 w-4" /></Button>
          <div className="text-center">
            <p className="numeric-display text-4xl">{rounds}</p>
            <p className="text-xs text-muted">rondas</p>
          </div>
          <Button variant="secondary" onClick={() => setRounds((r) => r + 1)} aria-label="Sumar ronda"><Plus className="h-4 w-4" /></Button>
        </div>
      )}
      <div className="flex gap-2">
        <Button size="lg" onClick={() => setRunning((r) => !r)}>
          {running ? <><Pause className="h-4 w-4" aria-hidden /> Pausar</> : <><Play className="h-4 w-4" aria-hidden /> {elapsed > 0 ? 'Reanudar' : 'Empezar'}</>}
        </Button>
        {elapsed > 0 && (
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setRunning(false);
              onFinish({ rounds: mode === 'emom' ? Math.floor(elapsed / 60) : rounds, seconds: elapsed });
            }}
          >
            <Square className="h-4 w-4" aria-hidden /> Terminar
          </Button>
        )}
      </div>
    </div>
  );
}
