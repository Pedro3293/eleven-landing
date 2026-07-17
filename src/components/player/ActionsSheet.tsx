'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftRight, ListPlus, SkipForward } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { Button } from '@/components/ui/Button';

interface Alternative {
  id: string;
  name: string;
  equipment: string;
  target: string;
  imageUrl: string;
}

export interface ActionsSheetProps {
  open: boolean;
  onClose: () => void;
  sessionExerciseId: string;
  exerciseName: string;
  onSkip: () => void;
  onAddSet: () => void;
  onSubstitute: (newExerciseId: string) => void;
}

/** Acciones del ejercicio en curso: sustituir (con alternativas del motor), saltar, añadir serie. */
export function ActionsSheet({ open, onClose, sessionExerciseId, exerciseName, onSkip, onAddSet, onSubstitute }: ActionsSheetProps) {
  const [alternatives, setAlternatives] = useState<Alternative[] | null>(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowAlternatives(false);
      setAlternatives(null);
    }
  }, [open]);

  async function loadAlternatives() {
    setShowAlternatives(true);
    try {
      const res = await fetch(`/api/session-exercises/${sessionExerciseId}/actions`);
      const data = (await res.json()) as { alternatives: Alternative[] };
      setAlternatives(data.alternatives ?? []);
    } catch {
      setAlternatives([]);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={exerciseName}>
      {!showAlternatives ? (
        <div className="flex flex-col gap-2">
          <Button variant="secondary" size="lg" className="justify-start" onClick={() => void loadAlternatives()}>
            <ArrowLeftRight className="h-5 w-5 text-accent" aria-hidden />
            Sustituir ejercicio
            <span className="ml-auto text-xs text-muted">mismo patrón y músculo</span>
          </Button>
          <Button variant="secondary" size="lg" className="justify-start" onClick={() => { onAddSet(); onClose(); }}>
            <ListPlus className="h-5 w-5 text-accent" aria-hidden />
            Añadir una serie
          </Button>
          <Button variant="secondary" size="lg" className="justify-start" onClick={() => { onSkip(); onClose(); }}>
            <SkipForward className="h-5 w-5 text-warn" aria-hidden />
            Saltar este ejercicio
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted">Alternativas con tu material que trabajan lo mismo:</p>
          {alternatives === null && <p className="animate-pulse py-4 text-center text-muted" role="status">Buscando…</p>}
          {alternatives?.length === 0 && (
            <p className="py-4 text-center text-muted">No hay alternativas viables con tu material. Puedes saltar el ejercicio.</p>
          )}
          {alternatives?.map((a) => (
            <button
              key={a.id}
              onClick={() => { onSubstitute(a.id); onClose(); }}
              className="flex min-h-[56px] items-center gap-3 rounded-control border border-line bg-surface-2 p-2 text-left active:border-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.imageUrl} alt="" className="h-12 w-12 rounded-lg bg-white object-contain" loading="lazy" />
              <span className="flex-1">
                <span className="block text-sm font-medium">{a.name}</span>
                <span className="block text-xs text-muted">{a.target}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </Sheet>
  );
}
