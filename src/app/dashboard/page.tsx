import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Dumbbell, Flame, LineChart } from 'lucide-react';
import { getCurrentUserId } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { getActivePlan, parsePlanState } from '@/lib/services/plan-service';
import { getMethodology } from '@/lib/engine/methodologies';
import { Card } from '@/components/ui/Card';
import { StartSessionButton } from '@/components/dashboard/StartSessionButton';

export const metadata = { title: 'Panel — FORGE' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect('/onboarding');
  const [profile, plan] = await Promise.all([
    prisma.profile.findUnique({ where: { userId } }),
    getActivePlan(userId!),
  ]);
  if (!profile || !plan) redirect('/onboarding');

  const state = parsePlanState(plan.config);
  const config = getMethodology(plan.methodologyId);
  const nextDay = config ? config.days[state.completedSessions % config.days.length] : null;

  const openSession = await prisma.session.findFirst({
    where: { userId, status: { in: ['planned', 'in_progress'] } },
    orderBy: { index: 'desc' },
  });
  const recent = await prisma.session.findMany({
    where: { userId, status: 'completed' },
    orderBy: { finishedAt: 'desc' },
    take: 5,
  });

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col gap-5 px-4 py-6">
      <header>
        <p className="text-sm text-muted">Hola, {profile.displayName}</p>
        <h1 className="text-2xl font-semibold">Tu entrenamiento</h1>
      </header>

      <Card className="flex flex-col gap-4 border-accent/30">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-control bg-accent/15 text-accent">
            <Dumbbell className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">
              {openSession ? (openSession.status === 'in_progress' ? 'Sesión en curso' : 'Siguiente sesión') : 'Siguiente sesión'}
            </p>
            <p className="font-semibold">
              {openSession?.title ?? nextDay?.title ?? plan.methodology.name}
            </p>
          </div>
        </div>
        <StartSessionButton
          sessionId={openSession?.id ?? null}
          label={openSession?.status === 'in_progress' ? 'Continuar sesión' : 'Empezar sesión'}
        />
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Card className="flex flex-col items-center gap-1 py-4">
          <span className="numeric-display text-3xl text-accent">{state.completedSessions}</span>
          <span className="text-xs text-muted">sesiones completadas</span>
        </Card>
        <Card className="flex flex-col items-center gap-1 py-4">
          <span className="numeric-display text-3xl">{state.daysPerWeek}</span>
          <span className="text-xs text-muted">días por semana</span>
        </Card>
      </div>

      <Link href="/progress" className="block">
        <Card className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-control bg-surface-2 text-accent">
            <LineChart className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <p className="font-semibold">Progreso y check-ins</p>
            <p className="text-xs text-muted">Volumen, cargas, adherencia y fotos</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
        </Card>
      </Link>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted">Plan: {plan.methodology.name}</h2>
        <Card className="text-sm text-muted">{plan.methodology.description}</Card>
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="mb-2 flex items-center gap-1 text-sm font-medium text-muted">
            <Flame className="h-4 w-4" aria-hidden /> Últimas sesiones
          </h2>
          <div className="flex flex-col gap-2">
            {recent.map((s) => (
              <Card key={s.id} className="flex items-center justify-between py-3">
                <span className="text-sm">{s.title}</span>
                <span className="text-xs text-muted">
                  {s.finishedAt?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
              </Card>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
