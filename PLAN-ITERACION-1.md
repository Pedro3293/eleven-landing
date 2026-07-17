# PLAN-ITERACION-1 — Núcleo de datos y motor

| # | Tarea | Rol | Criterio de hecho |
|---|---|---|---|
| 1 | Tipos del motor + RNG con semilla | frontend-developer | Tipos declarativos de metodología; RNG determinista testeado |
| 2 | 5 metodologías declarativas (fullbody-lineal, ppl, upper-lower, hipertrofia-volumen, calistenia) | frontend-developer | Configs validables, cada una con estructura, esquemas, progresión, deload y cadencia de check-ins |
| 3 | SessionGenerator procedural | frontend-developer | Selección por patrón/músculo filtrando equipamiento+lesiones; semilla persistible; presupuesto de tiempo; consistencia de ejercicio por slot para progresar |
| 4 | Reglas de progresión (lineal y doble) + deload | frontend-developer | Funciones puras con estado por ejercicio; ajuste por feedback (RPE alto/dolor) |
| 5 | Asignación de metodología desde perfil | frontend-developer | Función pura perfil→metodología+params usada por el onboarding |
| 6 | Seed de metodologías en BD | frontend-developer | `db:import` deja las 5 filas Methodology |
| 7 | Tests unitarios del motor | code-reviewer/qa | Generación determinista, filtros lesión/equipo, progresión, deload; cobertura motor ≥80% |

Nota (modelo de datos): ya completado en iteración 0 (schema Prisma completo + importación verificada).
