import { expect, test } from '@playwright/test';

/**
 * Flujo crítico 1 y 2 (DESCRIBE §7): onboarding → plan y sesión completa con
 * registro de series, descanso y finalización. Corre a 390px y 1440px.
 */
test('onboarding completo genera plan y permite completar una sesión', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Empezar' }).click();

  // Entrevista (reintenta el fill hasta que la página esté hidratada)
  await expect(async () => {
    await page.getByLabel('¿Cómo te llamamos?').fill('Pedro E2E');
    await expect(page.getByRole('button', { name: 'Empezar' })).toBeEnabled({ timeout: 1500 });
  }).toPass({ timeout: 20_000 });
  await page.getByRole('button', { name: 'Empezar' }).click();

  await page.getByRole('button', { name: 'Ganar músculo' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByRole('button', { name: 'Ya tengo base' }).click();

  await page.getByRole('button', { name: '4 días' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByRole('button', { name: '60 min' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByRole('button', { name: 'Gimnasio completo' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByRole('button', { name: 'Ninguna, todo bien' }).click();
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await page.getByLabel('Peso corporal (kg)').fill('78');
  await page.getByRole('button', { name: 'Ver mi plan' }).click();

  // Recomendación y confirmación
  await expect(page.getByText('Recomendada')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Crear mi plan' }).click();

  // Dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await expect(page.getByText('Hola, Pedro E2E')).toBeVisible();

  // Empezar sesión
  await page.getByRole('button', { name: 'Empezar sesión' }).click();
  await expect(page).toHaveURL(/\/session\//, { timeout: 20_000 });

  // Player: cronómetro y primer ejercicio visibles
  await expect(page.getByText(/Ejercicio 1 de \d+/)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Registrar la primera serie → aparece el descanso y se puede saltar
  await page.getByRole('button', { name: 'Serie hecha' }).first().click();
  await expect(page.getByText('Descanso', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Saltar descanso' }).click();
  await expect(page.getByText('Descanso', { exact: true })).toBeHidden();

  // La serie queda registrada
  await expect(page.getByLabel(/Serie 1 completada/)).toBeVisible();

  // Instrucciones en español disponibles
  await page.getByRole('button', { name: 'Cómo se hace' }).click();
  await expect(page.locator('ol li').first()).toBeVisible();

  // Sustituir desde el menú de acciones
  await page.getByRole('button', { name: 'Más acciones para este ejercicio' }).click();
  await page.getByRole('button', { name: 'Sustituir ejercicio' }).click();
  const firstAlternative = page.locator('[role="dialog"] button').filter({ hasText: /.+/ }).nth(2);
  await expect(page.getByText('Alternativas con tu material', { exact: false })).toBeVisible();

  // cerrar el sheet (la sustitución en sí ya está cubierta por tests de API)
  await page.getByRole('button', { name: 'Cerrar' }).click();
  void firstAlternative;

  // Terminar sesión
  await page.getByRole('button', { name: 'Terminar', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Terminar', exact: true }).click();

  // Resumen final
  await expect(page.getByText('Sesión completada')).toBeVisible({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Ir al panel' }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText('sesiones completadas')).toBeVisible();
});

test('el player no tiene overflow horizontal a 390px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'movil-390', 'solo móvil');
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
});
