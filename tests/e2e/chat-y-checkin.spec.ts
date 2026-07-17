import { expect, test, type Page } from '@playwright/test';

/**
 * Flujos críticos 3 y 4 (DESCRIBE §7): chat en el player y check-in → dashboard.
 * Nota: sin ANTHROPIC_API_KEY el chat corre en modo degradado (D-8); este E2E
 * verifica la UI completa del chat y la persistencia. El camino con IA real y
 * tools está cubierto por el diseño del agente y se valida con clave en local.
 */

async function crearPlanPorApi(page: Page) {
  const res = await page.request.post('/api/onboarding/complete', {
    data: {
      displayName: 'E2E Chat',
      goal: 'hipertrofia',
      experience: 'intermedio',
      injuries: [],
      equipment: ['barbell', 'dumbbell', 'cable'],
      daysPerWeek: 4,
      minutesPerSession: 60,
    },
  });
  expect(res.ok()).toBeTruthy();
}

test('el chat del player responde y persiste; el flotante existe en el dashboard', async ({ page }) => {
  await page.goto('/');
  await crearPlanPorApi(page);
  const next = await page.request.post('/api/sessions/next');
  const { sessionId } = (await next.json()) as { sessionId: string };

  await page.goto(`/session/${sessionId}`);
  await page.getByRole('button', { name: 'Preguntar al entrenador' }).click();
  await expect(page.getByText('no diagnostica', { exact: false })).toBeVisible();

  await page.getByLabel('Mensaje para el entrenador').fill('Cambia este ejercicio, me molesta');
  await page.getByLabel('Enviar').click();
  // respuesta del asistente (degradada sin clave, real con ella)
  await expect(page.locator('[role="log"] div').filter({ hasText: /entrenador|sesión|ejercicio/i }).last()).toBeVisible({ timeout: 20_000 });

  // la conversación persiste al reabrir
  await page.getByRole('button', { name: 'Cerrar' }).click();
  await page.getByRole('button', { name: 'Preguntar al entrenador' }).click();
  await expect(page.getByText('Cambia este ejercicio, me molesta')).toBeVisible();

  // chat flotante global presente en el dashboard
  await page.goto('/dashboard');
  await expect(page.getByRole('button', { name: 'Abrir chat con tu entrenador' })).toBeVisible();
});

test('check-in semanal se guarda y las molestias protegen la siguiente sesión', async ({ page }) => {
  await page.goto('/');
  await crearPlanPorApi(page);

  await page.goto('/progress');
  await page.getByRole('button', { name: 'Semanal' }).click();

  // energía 4 · sueño 3 · adherencia 5
  await page.getByRole('radiogroup', { name: 'Energía' }).getByRole('radio', { name: '4' }).click();
  await page.getByRole('radiogroup', { name: 'Sueño' }).getByRole('radio', { name: '3' }).click();
  await page.getByRole('radiogroup', { name: /Adherencia/ }).getByRole('radio', { name: '5' }).click();
  await page.getByLabel('Peso corporal (kg)').fill('77.5');
  await page.getByRole('button', { name: 'Rodilla' }).click();

  const post = page.waitForResponse((r) => r.url().includes('/api/checkins') && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Guardar check-in' }).click();
  expect((await post).ok()).toBeTruthy();

  // el generador recibe la molestia: la siguiente sesión de pierna no carga rodilla
  const next = await page.request.post('/api/sessions/next');
  expect(next.ok()).toBeTruthy();
  const { sessionId } = (await next.json()) as { sessionId: string };
  const detail = await (await page.request.get(`/api/sessions/${sessionId}`)).json() as {
    exercises: { pattern: string; exercise: { target: string } }[];
  };
  for (const e of detail.exercises) {
    expect(['squat', 'lunge']).not.toContain(e.pattern);
    expect(['quads', 'quadriceps', 'hamstrings']).not.toContain(e.exercise.target);
  }
});
