'use client';

/**
 * Entrevista de onboarding: conversacional, estructurada y determinista (D-8).
 * Resultado: Perfil de Atleta + Plan con metodología asignada, en menos de 5 minutos.
 */
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Dumbbell, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { EQUIPMENT_OPTIONS, HEALTH_CONDITIONS } from '@/lib/schemas';
import { INJURY_ZONE_LABELS, INJURY_ZONES } from '@/lib/repository/injury-map';

type Recommendation = {
  id: string;
  name: string;
  description: string;
  daysPerWeekOptions: number[];
  reasons: string[];
};

const GOAL_OPTIONS = [
  { key: 'fuerza', label: 'Ganar fuerza' },
  { key: 'hipertrofia', label: 'Ganar músculo' },
  { key: 'perdida_grasa', label: 'Perder grasa' },
  { key: 'salud_general', label: 'Salud general' },
  { key: 'rendimiento', label: 'Rendimiento deportivo' },
] as const;

const EXPERIENCE_OPTIONS = [
  { key: 'principiante', label: 'Estoy empezando', hint: 'Menos de 1 año entrenando' },
  { key: 'intermedio', label: 'Ya tengo base', hint: '1–3 años con constancia' },
  { key: 'avanzado', label: 'Nivel avanzado', hint: 'Más de 3 años en serio' },
] as const;

const GYM_PRESET = ['barbell', 'dumbbell', 'ez barbell', 'cable', 'leverage machine', 'smith machine', 'kettlebell'];
const HOME_PRESET = ['body weight', 'dumbbell', 'band', 'resistance band'];

const STEPS = ['nombre', 'objetivo', 'experiencia', 'dias', 'minutos', 'material', 'lesiones', 'peso', 'plan'] as const;
type Step = (typeof STEPS)[number];

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('nombre');
  const [displayName, setDisplayName] = useState('');
  const [goal, setGoal] = useState<string | null>(null);
  const [experience, setExperience] = useState<string | null>(null);
  const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null);
  const [minutesPerSession, setMinutesPerSession] = useState<number | null>(null);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [injuries, setInjuries] = useState<string[]>([]);
  const [noInjuries, setNoInjuries] = useState(false);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [noConditions, setNoConditions] = useState(false);
  const [bodyweight, setBodyweight] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [chosenMethodology, setChosenMethodology] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const progress = (stepIndex + 1) / STEPS.length;

  const profilePayload = useMemo(
    () => ({
      displayName: displayName.trim() || 'Atleta',
      goal,
      experience,
      injuries,
      healthConditions,
      equipment,
      daysPerWeek,
      minutesPerSession,
      bodyweightKg: bodyweight ? Number(bodyweight) : undefined,
    }),
    [displayName, goal, experience, injuries, healthConditions, equipment, daysPerWeek, minutesPerSession, bodyweight],
  );

  const goTo = (s: Step) => {
    setError(null);
    setStep(s);
  };

  async function loadRecommendations() {
    goTo('plan');
    setRecommendations(null);
    try {
      const res = await fetch('/api/onboarding/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profilePayload),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { recommendations: Recommendation[] };
      setRecommendations(data.recommendations);
      setChosenMethodology(data.recommendations[0]?.id ?? null);
    } catch {
      setError('No hemos podido calcular tu plan. Revisa la conexión e inténtalo otra vez.');
    }
  }

  async function confirmPlan() {
    if (!chosenMethodology) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profilePayload, methodologyId: chosenMethodology }),
      });
      if (!res.ok) throw new Error();
      router.push('/dashboard');
    } catch {
      setError('Algo ha fallado al crear tu plan. Inténtalo de nuevo.');
      setSubmitting(false);
    }
  }

  const backTargets: Partial<Record<Step, Step>> = {
    objetivo: 'nombre', experiencia: 'objetivo', dias: 'experiencia', minutos: 'dias',
    material: 'minutos', lesiones: 'material', peso: 'lesiones', plan: 'peso',
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-4 pb-8 pt-4">
      <header className="mb-6 flex items-center gap-3">
        {backTargets[step] ? (
          <button
            onClick={() => goTo(backTargets[step]!)}
            aria-label="Volver"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted active:text-ink"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center text-accent"><Dumbbell className="h-6 w-6" /></span>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-label="Progreso de la entrevista" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="flex flex-1 flex-col gap-6"
        >
          {step === 'nombre' && (
            <StepShell
              title="Vamos a construir tu plan"
              subtitle="Cinco minutos de preguntas y tendrás un plan hecho a tu medida, no una plantilla."
            >
              <Input
                label="¿Cómo te llamamos?"
                placeholder="Tu nombre"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoFocus
                maxLength={60}
              />
              <p className="flex items-start gap-2 text-xs text-muted">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                FORGE no sustituye a un profesional sanitario. Si tienes una lesión o patología, consulta antes de empezar.
              </p>
              <Button size="lg" disabled={!displayName.trim()} onClick={() => goTo('objetivo')}>
                Empezar
              </Button>
            </StepShell>
          )}

          {step === 'objetivo' && (
            <StepShell title={`Encantados, ${displayName.trim() || 'atleta'} 👊`} subtitle="¿Cuál es tu objetivo principal ahora mismo?">
              <div className="flex flex-wrap gap-2">
                {GOAL_OPTIONS.map((o) => (
                  <Chip key={o.key} label={o.label} selected={goal === o.key} onToggle={() => setGoal(o.key)} />
                ))}
              </div>
              <Button size="lg" disabled={!goal} onClick={() => goTo('experiencia')}>Siguiente</Button>
            </StepShell>
          )}

          {step === 'experiencia' && (
            <StepShell title="¿Cuánta experiencia tienes?" subtitle="Sé honesto: el plan progresa mejor desde el punto real.">
              <div className="flex flex-col gap-2">
                {EXPERIENCE_OPTIONS.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => { setExperience(o.key); goTo('dias'); }}
                    className={`flex min-h-[56px] flex-col items-start rounded-control border px-4 py-3 text-left transition-colors ${
                      experience === o.key ? 'border-accent bg-accent/10' : 'border-line bg-surface-2'
                    }`}
                  >
                    <span className="font-medium">{o.label}</span>
                    <span className="text-sm text-muted">{o.hint}</span>
                  </button>
                ))}
              </div>
            </StepShell>
          )}

          {step === 'dias' && (
            <StepShell title="¿Cuántos días puedes entrenar por semana?" subtitle="Mejor 3 días que cumples que 6 que no.">
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5, 6].map((d) => (
                  <Chip key={d} label={`${d} días`} selected={daysPerWeek === d} onToggle={() => setDaysPerWeek(d)} />
                ))}
              </div>
              <Button size="lg" disabled={!daysPerWeek} onClick={() => goTo('minutos')}>Siguiente</Button>
            </StepShell>
          )}

          {step === 'minutos' && (
            <StepShell title="¿Cuánto tiempo tienes por sesión?" subtitle="El generador ajustará el volumen para que la sesión quepa.">
              <div className="flex flex-wrap gap-2">
                {[30, 45, 60, 75, 90].map((m) => (
                  <Chip key={m} label={`${m} min`} selected={minutesPerSession === m} onToggle={() => setMinutesPerSession(m)} />
                ))}
              </div>
              <Button size="lg" disabled={!minutesPerSession} onClick={() => goTo('material')}>Siguiente</Button>
            </StepShell>
          )}

          {step === 'material' && (
            <StepShell title="¿Con qué material cuentas?" subtitle="Marca todo lo que tengas disponible. Puedes cambiarlo cuando quieras.">
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setEquipment(GYM_PRESET)}>Gimnasio completo</Button>
                <Button variant="secondary" size="sm" onClick={() => setEquipment(HOME_PRESET)}>Entreno en casa</Button>
                <Button variant="secondary" size="sm" onClick={() => setEquipment([])}>Nada</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {EQUIPMENT_OPTIONS.map((o) => (
                  <Chip
                    key={o.key}
                    label={o.label}
                    selected={equipment.includes(o.key)}
                    onToggle={() =>
                      setEquipment((prev) => (prev.includes(o.key) ? prev.filter((k) => k !== o.key) : [...prev, o.key]))
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-muted">Sin material también hay plan: tu peso corporal es suficiente para progresar.</p>
              <Button size="lg" onClick={() => goTo('lesiones')}>Siguiente</Button>
            </StepShell>
          )}

          {step === 'lesiones' && (
            <StepShell title="¿Alguna zona que debamos proteger?" subtitle="Evitaremos ejercicios que carguen esas zonas y te daremos alternativas.">
              <div className="flex flex-wrap gap-2">
                <Chip
                  label="Ninguna, todo bien"
                  selected={noInjuries}
                  onToggle={() => { setNoInjuries(true); setInjuries([]); }}
                />
                {INJURY_ZONES.map((z) => (
                  <Chip
                    key={z}
                    label={INJURY_ZONE_LABELS[z]}
                    selected={injuries.includes(z)}
                    onToggle={() => {
                      setNoInjuries(false);
                      setInjuries((prev) => (prev.includes(z) ? prev.filter((k) => k !== z) : [...prev, z]));
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-muted">¿Y alguna condición de salud que debamos conocer?</span>
                <div className="flex flex-wrap gap-2">
                  <Chip
                    label="Ninguna"
                    selected={noConditions}
                    onToggle={() => { setNoConditions(true); setHealthConditions([]); }}
                  />
                  {HEALTH_CONDITIONS.map((c) => (
                    <Chip
                      key={c.key}
                      label={c.label}
                      selected={healthConditions.includes(c.key)}
                      onToggle={() => {
                        setNoConditions(false);
                        setHealthConditions((prev) => (prev.includes(c.key) ? prev.filter((k) => k !== c.key) : [...prev, c.key]));
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted">
                  El plan se adaptará (descansos, volumen, ejercicios) y tu entrenador lo tendrá en cuenta en cada respuesta.
                </p>
              </div>
              <p className="flex items-start gap-2 text-xs text-muted">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Esto no es un diagnóstico ni sustituye a tu médico: entrena con patología solo con su visto bueno.
              </p>
              <Button size="lg" disabled={(!noInjuries && injuries.length === 0) || (!noConditions && healthConditions.length === 0)} onClick={() => goTo('peso')}>Siguiente</Button>
            </StepShell>
          )}

          {step === 'peso' && (
            <StepShell title="Última: ¿cuánto pesas?" subtitle="Opcional. Nos ayuda a sugerir cargas iniciales y a medir tu progreso.">
              <Input
                label="Peso corporal (kg)"
                type="number"
                inputMode="decimal"
                placeholder="p. ej. 75"
                value={bodyweight}
                onChange={(e) => setBodyweight(e.target.value)}
                min={25}
                max={400}
              />
              <div className="flex gap-2">
                <Button variant="secondary" size="lg" className="flex-1" onClick={() => { setBodyweight(''); void loadRecommendations(); }}>
                  Prefiero no decirlo
                </Button>
                <Button size="lg" className="flex-1" onClick={() => void loadRecommendations()}>
                  Ver mi plan
                </Button>
              </div>
            </StepShell>
          )}

          {step === 'plan' && (
            <StepShell title="Tu metodología" subtitle="Esta es la que mejor encaja contigo. Puedes elegir otra: el plan es tuyo.">
              {!recommendations && !error && (
                <p className="animate-pulse text-muted" role="status">Analizando tus respuestas…</p>
              )}
              {recommendations && (
                <div className="flex flex-col gap-3">
                  {recommendations.map((r, i) => (
                    <Card
                      key={r.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={chosenMethodology === r.id}
                      onClick={() => setChosenMethodology(r.id)}
                      onKeyDown={(e) => e.key === 'Enter' && setChosenMethodology(r.id)}
                      className={`cursor-pointer transition-colors ${chosenMethodology === r.id ? 'border-accent' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{r.name}</h3>
                        {i === 0 && <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">Recomendada</span>}
                      </div>
                      <p className="mt-1 text-sm text-muted">{r.description}</p>
                      {r.reasons.length > 0 && (
                        <p className="mt-2 text-xs text-accent">✓ {r.reasons.join(' · ')}</p>
                      )}
                    </Card>
                  ))}
                </div>
              )}
              {error && <p className="text-sm text-danger" role="alert">{error}</p>}
              <Button size="lg" loading={submitting} disabled={!chosenMethodology} onClick={() => void confirmPlan()}>
                Crear mi plan
              </Button>
            </StepShell>
          )}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </>
  );
}
