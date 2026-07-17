# AUDIT.md — Estado de gates por iteración

Última auditoría: **cierre de iteración 2** (2026-07-17).

## Gates

| Gate | Estado | Evidencia |
|---|---|---|
| G1 Build | **PASA** | `npm run build` sin errores ni warnings de tipos (typecheck estricto limpio) |
| G2 Tests | **PASA** | 41/41 unit en verde; cobertura motor >95% (gate ≥80%); 3/3 E2E Playwright (390px y 1440px) |
| G3 Diseño | **PASA** (parcial: pulido fino en it. 4) | Tokens y componentes según DESIGN-SYSTEM.md; capturas en `docs/capturas/` a 390/768/1440 |
| G4 Contenido | **PASA con defectos menores** | UI 100% ES; instrucciones ES del dataset; nombres de ejercicio traducidos por glosario con ~10-15% de resultados torpes (ver defectos) |
| G5 Base de datos | **PASA** | Importación 1.324/1.324, 0 media rota, reimportación idempotente, migración reproducible (`prisma migrate reset`) |
| G6 Responsive | **PASA** | E2E a 390px del flujo completo; test de overflow horizontal; targets ≥44px en componentes base |
| G7 Rendimiento | PENDIENTE (aplica desde it. 4) | — |
| G8 Seguridad | **PASA** (alcance it. 2) | Sin claves en cliente; cookies HMAC httpOnly; validación zod en toda la API; media route con protección de path traversal |
| G9 Licencia | **PASA** | LICENSE-PLAN.md actualizado con la licencia real verificada; MEDIA_SOURCE=dev-dataset con warning en build; cero imports directos del JSON fuera de scripts/import |

## Defectos abiertos

| # | Sev. | Descripción | Plan |
|---|---|---|---|
| D2-1 | Menor | ~10-15% de nombres traducidos con orden/género torpe («Behind head press militar sentado con barra», «Hacia delante elevación en polea») | Ampliar glosario en it. 4 (pulido); nameEn siempre visible en ficha como respaldo |
| D2-2 | Menor | Carga sugerida 0 kg en la primera sesión (sin historial); falta hint «elige tu carga inicial» | Microcopy en it. 4 |
| D2-3 | Menor | Con lesión de hombro la selección de empuje queda muy conservadora (mayoría aislamiento/peso corporal) | Revisar reglas de exclusión (separar «carga directa» de «implicación secundaria») en it. 5 si hay margen |

## Corregido en esta iteración

- **Crítico** slot con `targets` sin candidatos caía a cualquier aislamiento (curl de bíceps en día de empuje) → ahora el slot se omite. Verificado por API.
- **Mayor** reimportación del dataset rompía con FK de sesiones existentes → upsert idempotente.
- Duplicados de conectores en nombres («sobre sobre fitball») → colapso en composición.
