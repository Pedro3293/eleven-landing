/**
 * Capturas de evidencia para el gate G3 (revisión visual 390/768/1440).
 * Uso: PW_NO_SANDBOX=1 npx tsx scripts/capture-screens.ts  (con `npm run dev` levantado)
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';
const OUT = 'docs/capturas';
const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.PW_CHROMIUM_PATH || '/opt/pw-browsers/chromium',
    args: process.env.PW_NO_SANDBOX ? ['--no-sandbox'] : [],
  });

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();

    await page.goto(`${BASE}/`);
    await page.screenshot({ path: `${OUT}/home-${vp.name}.png` });

    await page.goto(`${BASE}/onboarding`);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/onboarding-${vp.name}.png` });

    // flujo rápido para llegar al player con datos reales
    await page.getByLabel('¿Cómo te llamamos?').fill('Captura');
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
    await page.getByRole('button', { name: 'Ver mi plan' }).click();
    await page.getByText('Recomendada').waitFor({ timeout: 15000 });
    await page.screenshot({ path: `${OUT}/onboarding-plan-${vp.name}.png` });
    await page.getByRole('button', { name: 'Crear mi plan' }).click();
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    await page.screenshot({ path: `${OUT}/dashboard-${vp.name}.png` });

    await page.getByRole('button', { name: 'Empezar sesión' }).click();
    await page.waitForURL(/session/, { timeout: 20000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${OUT}/player-${vp.name}.png` });

    await page.getByRole('button', { name: 'Serie hecha' }).first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/player-descanso-${vp.name}.png` });

    await ctx.close();
  }
  await browser.close();
  console.log('Capturas guardadas en', OUT);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
