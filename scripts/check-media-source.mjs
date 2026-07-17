// Gate 0 (G9): avisa en el build de producción si los medios siguen siendo el dataset de desarrollo.
const source = process.env.MEDIA_SOURCE ?? 'dev-dataset';

if (source === 'dev-dataset') {
  const line = '⚠'.repeat(3);
  console.warn(`
${line}  AVISO DE LICENCIA (Gate 0)  ${line}
MEDIA_SOURCE=dev-dataset: los medios de ejercicios provienen del dataset de desarrollo
(© Gym visual — https://gymvisual.com/). Válido SOLO para desarrollo/pruebas.
Antes de distribuir comercialmente (App Store, cobro, publicidad) ejecuta el plan
de sustitución descrito en LICENSE-PLAN.md y cambia MEDIA_SOURCE.
${'⚠'.repeat(38)}
`);
}
