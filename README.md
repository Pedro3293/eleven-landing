# FORGE — Entrenamiento adaptativo con IA

App de entrenamiento web-first (PWA) que genera sesiones a medida: entrevista de onboarding,
motor de metodologías con progresión automática, player con gestión completa de tiempos y
entrenador IA integrado. Ver `DESCRIBE.md` (producto) y `LOOP-FORGE-APP.md` (proceso).

## Arranque rápido

```bash
npm install                 # instala deps y genera el cliente Prisma
npx prisma migrate dev      # crea la BD SQLite (prisma/dev.db)
npm run db:import           # importa los 1.324 ejercicios del dataset (vendor/)
npm run dev                 # http://localhost:3000
```

Requiere el dataset en `vendor/exercises-dataset` (no versionado):

```bash
git clone --depth 1 https://github.com/hasaneyldrm/exercises-dataset vendor/exercises-dataset
```

Variables en `.env` (ver `.env.example`): `DATABASE_URL`, `AUTH_SECRET`, `MEDIA_SOURCE` y
`ANTHROPIC_API_KEY` (opcional: sin ella el chat IA queda en modo degradado informativo).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` / `build` / `start` | Next.js (el build avisa si `MEDIA_SOURCE=dev-dataset`, Gate 0) |
| `npm run typecheck` | TypeScript estricto |
| `npm test` / `test:coverage` | Unit (Vitest) — motor, dataset, repositorio |
| `npm run test:e2e` | Playwright a 390px y 1440px (en este runner: `PW_NO_SANDBOX=1`) |
| `npm run db:import` | Importación idempotente del dataset + seed de metodologías |

## Documentos del proyecto

- `DESCRIBE.md` — especificación de producto (fuente de verdad)
- `DESIGN-SYSTEM.md` — tokens y reglas de UI
- `LICENSE-PLAN.md` — licencias del dataset y plan de sustitución de medios (bloqueante App Store)
- `DECISIONS.md` — decisiones tomadas por el loop y su porqué
- `AUDIT.md` — estado de los gates de calidad por iteración
- `RELEASE.md` — pasos de empaquetado iOS con Capacitor (fase 2)
- `INFORME-FINAL.md` — informe de cierre del loop con instrucciones de prueba
