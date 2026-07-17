import Link from 'next/link';

// Placeholder de la iteración 0: la home real (dashboard) llega en iteraciones 2-4.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">Forge</p>
      <h1 className="text-4xl font-semibold">
        El entrenamiento que se adapta a ti. No al revés.
      </h1>
      <p className="text-muted">
        Entrevista con IA, sesiones generadas a tu medida y un player que gestiona cada segundo.
      </p>
      <Link
        href="/onboarding"
        className="flex h-12 items-center rounded-control bg-accent px-6 font-semibold text-accent-ink"
      >
        Empezar
      </Link>
    </main>
  );
}
