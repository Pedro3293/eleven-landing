# AUDIT.md — Estado de gates por iteración

Última auditoría: **cierre de iteración 5 (final del loop)** · 2026-07-17.

## Gates (auditoría final)

| Gate | Estado | Evidencia |
|---|---|---|
| G1 Build | **PASA** | `npm run build` sin errores; typecheck estricto limpio (0 errores TS) |
| G2 Tests | **PASA** | Unit 41/41 verdes; cobertura del motor >95% (gate ≥80%); E2E 7/7 en móvil 390px y escritorio 1440px |
| G3 Diseño | **PASA** | Design tokens + componentes según DESIGN-SYSTEM.md; capturas 390/768/1440 en `docs/capturas/`; revisión visual del player, onboarding, dashboard y progreso |
| G4 Contenido | **PASA con defectos menores** | UI 100% en español; instrucciones ES del dataset (1.324/1.324); disclaimers en onboarding y chat; nombres de ejercicios con ~10% de traducciones torpes (D2-1, menor) |
| G5 Base de datos | **PASA** | Importación 1.324/1.324 verificada, 0 rutas de media rotas, reimportación idempotente, migración reproducible desde cero |
| G6 Responsive | **PASA** | 4 flujos críticos E2E a 390px; test anti-overflow; targets ≥44px en el design system |
| G7 Rendimiento | **PASA** | Lighthouse móvil (build de producción): dashboard Perf 91; home Perf 100 / A11y 100 / BP 96; onboarding Perf 99 / A11y 95 (+fix de progressbar posterior) / BP 96. Player 155 kB First Load JS; 3D lazy fuera del player |
| G8 Seguridad | **PASA** | Claves solo en servidor (agente IA server-side); cookies HMAC httpOnly; contraseñas scrypt; zod en toda la API; fotos en storage privado servidas solo al dueño (verificado 200/404); protección path-traversal en rutas de archivos; sin datos sensibles en logs |
| G9 Licencia | **PASA** | LICENSE-PLAN.md con la licencia real verificada del dataset; MEDIA_SOURCE=dev-dataset con warning en build; el JSON solo se lee en `scripts/import-dataset.ts`; atribución © Gym visual visible junto a los GIFs |

**Resultado: G1–G9 en PASA, cero defectos críticos o mayores abiertos → condición de éxito del loop (§4) cumplida al cierre de la iteración 5.**

## Defectos abiertos (todos menores)

| # | Sev. | Descripción | Recomendación |
|---|---|---|---|
| D2-1 | Menor | ~10% de nombres de ejercicio con orden/género torpe («Extensión sentado en banco con mancuernas») | Pasada editorial sobre los ~130 peores con la app en uso; `nameEn` siempre disponible |
| D2-3 | Menor | Exclusión por lesión conservadora: con «hombro» casi todo empuje queda fuera (secundarios cuentan) | Separar «carga directa» (excluir) de «implicación secundaria» (permitir con aviso) en v1.1 |
| D5-1 | Menor | El chat IA requiere `ANTHROPIC_API_KEY` en runtime; sin ella opera degradado (mensaje + acciones manuales). E2E del flujo IA real pendiente de entorno con clave | Configurar la clave en el despliegue y validar manualmente los 3 casos del E2E de chat |
| D5-2 | Menor | Vibración no disponible en Safari iOS (limitación de plataforma); las señales sonoras cubren el aviso | Nada que hacer en web; en Capacitor usar Haptics nativo |

## Corregido en iteración 5

- A11y: progressbar del onboarding sin nombre accesible (fallo Lighthouse) → `aria-label`.
- D2-2: microcopy de primera carga («elige una carga que te deje X reps…») en la primera serie sin historial.
- Glosario: `behind head` → «tras nuca», `forward raise` → «elevación frontal».
- E2E: carrera de hidratación en el primer paso del onboarding (fill antes de hidratar) → reintento hasta hidratación.

## Histórico

- **It. 2:** crítico corregido (slot con `targets` caía a aislamiento arbitrario); mayor corregido (reimportación rompía FKs).
- **It. 3-4:** sin críticos; verificaciones de seguridad de fotos y auth por API.
