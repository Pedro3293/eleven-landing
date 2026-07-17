'use client';

import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import type { SessionDTO } from '@/lib/services/serialize';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatClock, formatKg } from './format';

/** Resumen post-sesión: volumen, tiempo total vs efectivo y series por ejercicio. */
export function FinishSummary({ session, onDone }: { session: SessionDTO; onDone: () => void }) {
  const totalSets = session.exercises.reduce((s, e) => s + e.setLogs.length, 0);
  const totalVolume = session.exercises.reduce(
    (s, e) => s + e.setLogs.reduce((v, l) => v + (l.weightKg ?? 0) * l.reps, 0),
    0,
  );

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-5 px-4 py-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex flex-col items-center gap-2 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Trophy className="h-8 w-8" />
        </span>
        <h1 className="text-2xl font-semibold">Sesión completada</h1>
        <p className="text-muted">Trabajo hecho. La próxima sesión ya sabe lo que has movido hoy.</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Tiempo" value={formatClock(session.totalSeconds ?? 0)} />
        <Stat label="Efectivo" value={formatClock(session.effectiveSeconds ?? 0)} />
        <Stat label="Series" value={String(totalSets)} />
      </div>
      {totalVolume > 0 && <Stat label="Volumen total" value={`${Math.round(totalVolume)} kg`} wide />}

      <div className="flex flex-col gap-2">
        {session.exercises.map((e) => (
          <Card key={e.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium">{e.exercise.name}</p>
              <p className="text-xs text-muted">
                {e.status === 'skipped'
                  ? 'Saltado'
                  : e.setLogs.map((l) => `${l.reps}${l.weightKg != null ? `×${formatKg(l.weightKg).replace(' kg', '')}` : ''}`).join(' · ') || 'Sin series'}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Button size="lg" onClick={onDone}>Ir al panel</Button>
    </main>
  );
}

function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <Card className={`flex flex-col items-center gap-1 py-3 ${wide ? 'col-span-3' : ''}`}>
      <span className="numeric-display text-2xl">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </Card>
  );
}
