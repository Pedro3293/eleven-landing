'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SessionExerciseDTO } from '@/lib/services/serialize';
import { SetRow } from './SetRow';
import { ModeTimer } from './ModeTimer';

export interface ExerciseViewProps {
  se: SessionExerciseDTO;
  onLogSet: (setIndex: number, data: { reps: number; weightKg: number | null; rpe: number | null; seconds?: number | null }) => void;
}

const BODYWEIGHT_EQUIP = ['body weight', 'assisted'];

export function ExerciseView({ se, onLogSet }: ExerciseViewProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const usesWeight = !BODYWEIGHT_EQUIP.includes(se.exercise.equipment);
  const targetReps = se.targetRepsMin === se.targetRepsMax ? `${se.targetRepsMax}` : `${se.targetRepsMin}–${se.targetRepsMax}`;
  const isTimed = se.mode !== 'straight' && se.mode !== 'tut' && se.modeSeconds;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-card border border-line bg-white">
        {/* GIF del dataset (180×180): sin optimizador para animación fiel */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={se.exercise.gifUrl}
          alt={`Demostración: ${se.exercise.name}`}
          className="h-full w-full object-contain"
          loading="eager"
        />
        {se.exercise.attribution && (
          <span className="absolute bottom-1 right-2 text-[10px] text-black/50">{se.exercise.attribution.replace('— https://gymvisual.com/', '')}</span>
        )}
      </div>

      {se.tempo && (
        <p className="rounded-control border border-line bg-surface-2 px-3 py-2 text-center text-sm">
          <span className="text-muted">Tempo</span>{' '}
          <span className="numeric-display">{se.tempo}</span>{' '}
          <span className="text-muted">(bajada-pausa-subida, en segundos)</span>
        </p>
      )}

      <button
        onClick={() => setShowInstructions((s) => !s)}
        className="flex min-h-[44px] items-center justify-between rounded-control border border-line bg-surface-2 px-3 text-sm"
        aria-expanded={showInstructions}
      >
        Cómo se hace
        <ChevronDown className={`h-4 w-4 text-muted transition-transform ${showInstructions ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {showInstructions && (
        <ol className="flex flex-col gap-2 rounded-control bg-surface-2/50 p-3 text-sm text-muted">
          {se.exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="numeric-display text-accent">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {isTimed ? (
        <ModeTimer
          mode={se.mode as 'emom' | 'amrap' | 'tabata'}
          totalSeconds={se.modeSeconds!}
          onFinish={({ rounds, seconds }) => onLogSet(0, { reps: rounds, weightKg: null, rpe: null, seconds })}
        />
      ) : (
        <div className="flex flex-col gap-2">
          {Array.from({ length: se.targetSets }, (_, i) => {
            const logged = se.setLogs.find((l) => l.setIndex === i);
            return (
              <SetRow
                key={`${se.id}-${i}-${logged?.id ?? 'pending'}`}
                index={i}
                targetReps={targetReps}
                suggestedWeightKg={se.targetWeightKg}
                usesWeight={usesWeight}
                logged={logged ? { reps: logged.reps, weightKg: logged.weightKg, rpe: logged.rpe } : undefined}
                onComplete={(data) => onLogSet(i, data)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
