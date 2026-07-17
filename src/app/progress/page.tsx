import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUserId } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getActivePlan } from '@/lib/services/plan-service';
import { getMethodology } from '@/lib/engine/methodologies';
import { adherence, bodyweightSeries, currentStreak, loadProgression, volumeByMuscleGroup } from '@/lib/services/progress-service';
import { Card } from '@/components/ui/Card';
import { AdherenceChart, BodyweightChart, LoadProgressionChart, MuscleVolumeChart } from '@/components/progress/charts';
import { CheckInSection } from '@/components/progress/CheckInSection';
import { PhotoSection } from '@/components/progress/PhotoSection';

export const metadata = { title: 'Progreso — FORGE' };
export const dynamic = 'force-dynamic';

export default async function ProgressPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/onboarding');
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) redirect('/onboarding');

  const [volume, loads, weeks, weight, streak, plan] = await Promise.all([
    volumeByMuscleGroup(userId),
    loadProgression(userId),
    adherence(userId),
    bodyweightSeries(userId),
    currentStreak(userId),
    getActivePlan(userId),
  ]);
  const config = plan ? getMethodology(plan.methodologyId) : null;
  const cadence = config?.checkIns ?? { daily: false, weekly: true, mesocycleWeeks: 6 };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-5 px-4 py-6">
      <header className="flex items-center gap-2">
        <Link href="/dashboard" aria-label="Volver al panel" className="flex h-11 w-11 items-center justify-center rounded-full text-muted active:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Tu progreso</h1>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <Card className="flex flex-col items-center gap-1 py-4">
          <span className="numeric-display text-3xl text-accent">{streak}</span>
          <span className="text-xs text-muted">semanas cumpliendo</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <span className="numeric-display text-3xl">{weeks.reduce((s, w) => s + w.completed, 0)}</span>
          <span className="text-xs text-muted">sesiones en 6 semanas</span>
        </Card>
      </div>

      <CheckInSection cadence={cadence} />

      <section aria-label="Volumen por grupo muscular">
        <h2 className="mb-2 text-sm font-medium text-muted">Series por músculo · últimas 4 semanas</h2>
        <Card><MuscleVolumeChart rows={volume} /></Card>
      </section>

      <section aria-label="Progresión de cargas">
        <h2 className="mb-2 text-sm font-medium text-muted">Progresión de cargas · mejor serie (kg)</h2>
        <Card><LoadProgressionChart series={loads} /></Card>
      </section>

      <section aria-label="Adherencia semanal">
        <h2 className="mb-2 text-sm font-medium text-muted">Adherencia · sesiones/semana (la línea es tu objetivo)</h2>
        <Card><AdherenceChart rows={weeks} /></Card>
      </section>

      <section aria-label="Peso corporal">
        <h2 className="mb-2 text-sm font-medium text-muted">Peso corporal (kg)</h2>
        <Card><BodyweightChart points={weight} /></Card>
      </section>

      <PhotoSection />
    </main>
  );
}
