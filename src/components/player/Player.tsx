'use client';

/**
 * Player de entrenamiento (DESCRIBE §4.4). Mobile-first 390px, una mano.
 * Cronómetro global · descanso auto con ±15s · tiempo efectivo · modos especiales ·
 * Wake Lock · sonido/vibración · saltar/sustituir/añadir series/terminar.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Flag, MessageCircle, MoreHorizontal } from 'lucide-react';
import { ChatPanel } from '@/components/chat/ChatPanel';
import type { SessionDTO, SessionExerciseDTO } from '@/lib/services/serialize';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { ExerciseView } from './ExerciseView';
import { RestOverlay } from './RestOverlay';
import { ActionsSheet } from './ActionsSheet';
import { FinishSummary } from './FinishSummary';
import { useWakeLock } from './useWakeLock';
import { usePlayerAudio } from './usePlayerAudio';
import { formatClock } from './format';

export function Player({ initial }: { initial: SessionDTO }) {
  const router = useRouter();
  const [session, setSession] = useState<SessionDTO>(initial);
  const [currentIdx, setCurrentIdx] = useState(() => firstPendingIndex(initial.exercises));
  const [rest, setRest] = useState<{ remaining: number; total: number } | null>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [finishOpen, setFinishOpen] = useState(false);
  const [finished, setFinished] = useState<SessionDTO | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const restAccumRef = useRef(0);
  const { tick, done } = usePlayerAudio();

  const active = session.status === 'in_progress' && !finished;
  useWakeLock(active);

  // Arranque automático de la sesión al entrar
  useEffect(() => {
    if (initial.status === 'planned') {
      void fetch(`/api/sessions/${initial.id}/start`, { method: 'POST' })
        .then(() => setSession((s) => ({ ...s, status: 'in_progress', startedAt: s.startedAt ?? new Date().toISOString() })));
    }
  }, [initial.id, initial.status]);

  // Reloj global (1s)
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  // Descanso: cuenta atrás + señales
  useEffect(() => {
    if (!rest) return;
    if (rest.remaining <= 0) {
      done();
      setRest(null);
      return;
    }
    if (rest.remaining <= 3) tick();
    const id = setTimeout(() => {
      restAccumRef.current += 1;
      setRest((r) => (r ? { ...r, remaining: r.remaining - 1 } : null));
    }, 1000);
    return () => clearTimeout(id);
  }, [rest, tick, done]);

  const elapsedSeconds = session.startedAt ? Math.max(0, Math.floor((now - Date.parse(session.startedAt)) / 1000)) : 0;
  const effectiveSeconds = Math.max(0, elapsedSeconds - restAccumRef.current);

  const exercises = session.exercises;
  const current = exercises[currentIdx];
  const doneCount = exercises.filter((e) => e.status === 'done' || e.status === 'skipped').length;

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/sessions/${session.id}`);
    if (res.ok) setSession((await res.json()) as SessionDTO);
  }, [session.id]);

  const logSet = useCallback(
    async (se: SessionExerciseDTO, setIndex: number, data: { reps: number; weightKg: number | null; rpe: number | null; seconds?: number | null }) => {
      // Optimista: refleja la serie al instante
      setSession((s) => ({
        ...s,
        exercises: s.exercises.map((e) =>
          e.id === se.id
            ? {
                ...e,
                setLogs: [
                  ...e.setLogs.filter((l) => l.setIndex !== setIndex),
                  { id: `tmp-${setIndex}`, setIndex, reps: data.reps, weightKg: data.weightKg, rpe: data.rpe, seconds: data.seconds ?? null, isWarmup: false },
                ].sort((a, b) => a.setIndex - b.setIndex),
              }
            : e,
        ),
      }));

      const isLastSet = se.setLogs.filter((l) => l.setIndex !== setIndex).length + 1 >= se.targetSets;
      if (!isLastSet && se.restSeconds > 0 && se.mode === 'straight') {
        setRest({ remaining: se.restSeconds, total: se.restSeconds });
      }

      await fetch(`/api/session-exercises/${se.id}/sets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ setIndex, ...data }),
      });
      if (isLastSet) {
        await fetch(`/api/session-exercises/${se.id}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'done' }),
        });
      }
      await refresh();
    },
    [refresh],
  );

  const exerciseAction = useCallback(
    async (se: SessionExerciseDTO, action: 'skip' | 'add-set' | 'substitute', newExerciseId?: string) => {
      await fetch(`/api/session-exercises/${se.id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, newExerciseId }),
      });
      await refresh();
      if (action === 'skip' && currentIdx < exercises.length - 1) setCurrentIdx((i) => i + 1);
    },
    [refresh, currentIdx, exercises.length],
  );

  const finish = useCallback(async () => {
    const res = await fetch(`/api/sessions/${session.id}/finish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalSeconds: elapsedSeconds, effectiveSeconds }),
    });
    if (res.ok) setFinished((await res.json()) as SessionDTO);
  }, [session.id, elapsedSeconds, effectiveSeconds]);

  const nextLabel = useMemo(() => {
    if (!current) return '';
    const pendingSets = current.targetSets - current.setLogs.length;
    if (pendingSets > 0) return `${current.exercise.name} · serie ${current.setLogs.length + 1} de ${current.targetSets}`;
    const next = exercises[currentIdx + 1];
    return next ? next.exercise.name : 'Final de la sesión';
  }, [current, exercises, currentIdx]);

  if (finished) {
    return <FinishSummary session={finished} onDone={() => router.push('/dashboard')} />;
  }
  if (!current) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted">Esta sesión no tiene ejercicios pendientes.</p>
        <Button onClick={() => void finish()}>Finalizar sesión</Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-28 pt-3">
      {/* Cabecera: cronómetro global + progreso + terminar */}
      <header className="mb-3 flex items-center justify-between">
        <div aria-live="off">
          <p className="numeric-display text-2xl leading-none">{formatClock(elapsedSeconds)}</p>
          <p className="text-xs text-muted">efectivo {formatClock(effectiveSeconds)}</p>
        </div>
        <div className="flex-1 px-4">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Progreso de la sesión" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={exercises.length}>
            <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${(doneCount / exercises.length) * 100}%` }} />
          </div>
          <p className="mt-1 text-center text-xs text-muted">{doneCount} de {exercises.length}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setFinishOpen(true)}>
          <Flag className="h-4 w-4" aria-hidden /> Terminar
        </Button>
      </header>

      {/* Ejercicio actual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + current.exercise.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {ROLE_LABELS[current.role] ?? current.role}
                {current.substituted && ' · sustituido'}
                {current.status === 'skipped' && ' · saltado'}
              </p>
              <h1 className="text-xl font-semibold leading-tight">{current.exercise.name}</h1>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setChatOpen(true)}
                aria-label="Preguntar al entrenador"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-muted active:text-ink"
              >
                <MessageCircle className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActionsOpen(true)}
                aria-label="Más acciones para este ejercicio"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-2 text-muted active:text-ink"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          <ExerciseView se={current} onLogSet={(setIndex, data) => void logSet(current, setIndex, data)} />
        </motion.div>
      </AnimatePresence>

      {/* Navegación entre ejercicios */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-2 px-4">
          <Button variant="secondary" disabled={currentIdx === 0} onClick={() => setCurrentIdx((i) => i - 1)} aria-label="Ejercicio anterior">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </Button>
          <p className="text-sm text-muted">
            Ejercicio {currentIdx + 1} de {exercises.length}
          </p>
          <Button
            variant={currentIdx === exercises.length - 1 ? 'primary' : 'secondary'}
            onClick={() => (currentIdx === exercises.length - 1 ? setFinishOpen(true) : setCurrentIdx((i) => i + 1))}
            aria-label={currentIdx === exercises.length - 1 ? 'Terminar sesión' : 'Siguiente ejercicio'}
          >
            {currentIdx === exercises.length - 1 ? <Flag className="h-5 w-5" aria-hidden /> : <ChevronRight className="h-5 w-5" aria-hidden />}
          </Button>
        </div>
      </nav>

      {/* Overlays */}
      <AnimatePresence>
        {rest && (
          <RestOverlay
            remaining={rest.remaining}
            total={rest.total}
            nextLabel={nextLabel}
            onAdjust={(d) => setRest((r) => (r ? { remaining: Math.max(0, r.remaining + d), total: Math.max(r.total, r.remaining + d) } : null))}
            onSkip={() => setRest(null)}
          />
        )}
      </AnimatePresence>

      <ActionsSheet
        open={actionsOpen}
        onClose={() => setActionsOpen(false)}
        sessionExerciseId={current.id}
        exerciseName={current.exercise.name}
        onSkip={() => void exerciseAction(current, 'skip')}
        onAddSet={() => void exerciseAction(current, 'add-set')}
        onSubstitute={(id) => void exerciseAction(current, 'substitute', id)}
      />

      <Sheet open={chatOpen} onClose={() => setChatOpen(false)} title="Tu entrenador">
        <div className="h-[60dvh]">
          <ChatPanel
            context={`session:${session.id}`}
            onToolsUsed={() => void refresh()}
            suggestions={[
              'Me molesta este ejercicio, cámbialo',
              '¿Cómo hago bien este ejercicio?',
              'Hoy voy corto de tiempo, recorta la sesión',
            ]}
          />
        </div>
      </Sheet>

      <Sheet open={finishOpen} onClose={() => setFinishOpen(false)} title="¿Terminar la sesión?">
        <p className="mb-4 text-sm text-muted">
          Se guardará todo lo registrado y la progresión se actualizará para la próxima sesión.
          {doneCount < exercises.length && ` Te quedan ${exercises.length - doneCount} ejercicios sin cerrar.`}
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => setFinishOpen(false)}>
            Seguir entrenando
          </Button>
          <Button size="lg" className="flex-1" onClick={() => void finish()}>
            Terminar
          </Button>
        </div>
      </Sheet>
    </main>
  );
}

const ROLE_LABELS: Record<string, string> = {
  main: 'Principal',
  secondary: 'Secundario',
  accessory: 'Accesorio',
  core: 'Core',
};

function firstPendingIndex(exercises: SessionExerciseDTO[]): number {
  const idx = exercises.findIndex((e) => e.status === 'pending');
  return idx === -1 ? 0 : idx;
}
