# LOOP-FORGE-APP.md — Loop de orquestación autónoma para Claude Code
## Proyecto: FORGE — App de entrenamiento adaptativo con IA

> **Instrucción maestra:** Eres el orquestador técnico del proyecto FORGE. Lee `DESCRIBE.md` en la raíz del proyecto: es la fuente de verdad del producto. Ejecuta este loop de forma autónoma, sin pedir confirmaciones intermedias, delegando en los subagentes indicados. Solo te detienes si (a) el producto pasa TODOS los gates de calidad, o (b) completas 5 iteraciones. Al terminar, entrega el informe final descrito en §6.

---

## 0. Reglas globales

1. **Fuente de verdad:** `DESCRIBE.md`. Ante ambigüedad, decide tú aplicando el criterio "¿qué haría el mejor producto posible dentro del alcance v1?" y documenta la decisión en `DECISIONS.md`.
2. **Sin interrupciones:** no preguntes al usuario durante el loop. Registra dudas en `DECISIONS.md` con la opción elegida y el porqué.
3. **Commits atómicos:** un commit por tarea completada, mensaje convencional (`feat:`, `fix:`, `test:`, `chore:`).
4. **Cada iteración termina con la app arrancando** (`npm run dev` sin errores) y los tests existentes en verde. Nunca dejes el repo roto entre iteraciones.
5. **Subagentes disponibles y su uso obligatorio:**
   - `@ui-designer` — sistema de diseño, layouts, dirección de arte, revisión visual.
   - `@frontend-developer` — implementación de componentes, player, 3D, PWA.
   - `@code-reviewer` — revisión de cada módulo terminado (arquitectura, seguridad, tipos).
   - `@qa-responsive` — pruebas en viewports móvil (390px), tablet (768px) y escritorio (1440px); auditoría Lighthouse.
   - `@copywriter-web` — todos los textos de UI en español (microcopy, onboarding, empty states, disclaimers).
6. **Idioma del producto:** español (España). Nada de texto en inglés visible al usuario.

---

## GATE 0 — Licencia del dataset (bloqueante, se ejecuta ANTES de la iteración 1)

El dataset `hasaneyldrm/exercises-dataset` es **solo educativo/no comercial** y sus medios pertenecen a terceros.

Acciones obligatorias:
1. Crear `LICENSE-PLAN.md` en la raíz documentando: (a) que los medios del dataset se usan SOLO en desarrollo; (b) el plan de sustitución pre-publicación (assets propios / fuente con licencia comercial / medios IA con derechos comerciales); (c) checklist de verificación previa al build de App Store.
2. Implementar la capa `ExerciseRepository` (interfaz + adaptador `LocalDatasetAdapter`) de modo que TODA lectura de ejercicios pase por ella. Ningún componente importa `exercises.json` directamente.
3. Marcar en la config `MEDIA_SOURCE=dev-dataset` y hacer que el build de producción emita un warning si sigue activo.
4. Traducir las instrucciones de los ejercicios a español durante la importación (batch, revisión por muestreo del 5% por `@copywriter-web`). El texto ES resultante es contenido propio del proyecto.

Sin este gate completado, el loop no avanza.

---

## 1. Setup inicial (Iteración 0 — fundaciones)

1. `git clone https://github.com/hasaneyldrm/exercises-dataset` en `./vendor/exercises-dataset` (añadir a `.gitignore` los medios; solo se versiona el script de importación).
2. Scaffolding: Next.js 15 + TypeScript + Tailwind + Prisma + SQLite. Estructura:
   ```
   /app            → rutas (onboarding, dashboard, session, progress, chat, settings)
   /components     → UI (design system en /components/ui)
   /lib/engine     → motor de metodologías y generación procedural
   /lib/repository → ExerciseRepository + adaptadores
   /lib/ai         → cliente Claude API, tools, system prompts
   /prisma         → schema y migraciones
   /scripts        → import-dataset.ts, translate-instructions.ts
   /tests          → unit (Vitest) y e2e (Playwright)
   ```
3. Ejecutar importación del dataset a BD. **Verificación:** 1.324 ejercicios importados; 0 rutas de imagen/GIF rotas; categorías y equipamientos normalizados; instrucciones ES presentes.
4. `@ui-designer`: definir design tokens (dark-first, `--accent`, tipografías, espaciado, radios) en `DESIGN-SYSTEM.md` + implementación Tailwind. Referencia de calidad: nivel Apple/Linear, estética deportiva moderna según DESCRIBE §5.

---

## 2. Iteraciones de construcción (1 → 5)

Cada iteración sigue el ciclo: **PLANIFICAR → CONSTRUIR → REVISAR → AUDITAR → CORREGIR → REGISTRAR**.

### Iteración 1 — Núcleo de datos y motor
- Modelo de datos completo (Prisma) según DESCRIBE §6.
- Motor de metodologías: las 5 metodologías v1 como configuraciones declarativas + `SessionGenerator` procedural (selección por patrón/músculo/equipamiento/lesiones, semilla persistida, sustituciones).
- Tests unitarios del motor: generación determinista, filtros de lesión/equipamiento, reglas de progresión y deload. Cobertura del motor ≥80%.
- `@code-reviewer` revisa motor y schema antes de cerrar.

### Iteración 2 — Onboarding + Player de entrenamiento
- Entrevista conversacional de onboarding (IA con tool-use → crea Profile + Plan).
- Player completo: vista por ejercicio con GIF e instrucciones ES, registro de series, temporizador de descanso auto, cronómetro global, tiempo efectivo, modos TUT/tempo/EMOM/AMRAP/Tabata, Wake Lock, sonido/vibración.
- Gestión en tiempo real: saltar, sustituir (con alternativas del motor), añadir series, finalizar.
- `@copywriter-web`: todo el microcopy del onboarding y player.
- `@qa-responsive`: player probado a 390px como prioridad absoluta.

### Iteración 3 — Agente de IA + Progreso
- Chat global flotante + chat embebido en player. Tools: leer/escribir perfil, plan, sesión en curso, historial; explicar ejercicios; ajustar volumen/intensidad. System prompt especializado (ciencias del deporte, metodologías, seguridad: no diagnóstica, deriva a profesionales). Disclaimer visible.
- Check-ins configurables (diario/semanal/mesociclo), subida de fotos (storage privado), comparador de fotos, dashboards (volumen por músculo, progresión de cargas, adherencia, métricas).
- Persistencia de conversaciones. Claves API solo en servidor.

### Iteración 4 — Diseño 3D, PWA y pulido
- Elemento 3D del dashboard (figura anatómica con músculos trabajados resaltados; react-three-fiber) con fallback 2D y respeto a `prefers-reduced-motion`.
- Microinteracciones Framer Motion en toda la app. Pasada completa de `@ui-designer` contra `DESIGN-SYSTEM.md`.
- PWA: manifest, service worker, sesión en curso funcional offline, instalable.
- Auth (email + Google + Sign in with Apple), exportación y borrado de datos.

### Iteración 5 — Hardening y preparación de release
- Corrección de todo lo abierto en `AUDIT.md`. E2E completos de los 4 flujos críticos (onboarding→plan, sesión completa, chat que modifica sesión, check-in→dashboard) en móvil y escritorio.
- Rendimiento: presupuesto JS del player, lazy-load del 3D, imágenes optimizadas.
- Documentar en `RELEASE.md` los pasos de empaquetado con Capacitor para iOS (NO ejecutar el build nativo: eso ocurre tras las pruebas manuales de Pedro) incluyendo el checklist del Gate 0.

> Si una iteración termina antes de agotar su alcance, adelanta trabajo de la siguiente. Si una iteración no cabe, traslada lo pendiente y anótalo en `AUDIT.md` — pero los gates de esa iteración deben pasar igualmente.

---

## 3. Gates de calidad (se auditan al final de CADA iteración)

| Gate | Criterio de paso | Responsable |
|---|---|---|
| G1 Build | `npm run build` sin errores ni warnings de tipos | orquestador |
| G2 Tests | 100% de tests en verde; motor ≥80% cobertura | orquestador |
| G3 Diseño | Cumple `DESIGN-SYSTEM.md`; sin componentes "por defecto" sin estilar; revisión visual con capturas a 390/768/1440px | `@ui-designer` + `@qa-responsive` |
| G4 Contenido | Todo el texto visible en español correcto, tono coherente, disclaimers presentes | `@copywriter-web` |
| G5 Base de datos | Integridad referencial; importación completa (1.324/1.324); sin rutas de media rotas; migraciones reproducibles desde cero | `@code-reviewer` |
| G6 Responsive | Flujos críticos usables a 390px; targets ≥44px; sin overflow horizontal | `@qa-responsive` |
| G7 Rendimiento (desde it. 4) | Lighthouse móvil: Perf ≥85, A11y ≥95, Best Practices ≥95 | `@qa-responsive` |
| G8 Seguridad | Claves solo en servidor; fotos en storage privado; validación de inputs en API; sin datos sensibles en logs | `@code-reviewer` |
| G9 Licencia | Gate 0 vigente: `LICENSE-PLAN.md` actualizado, `MEDIA_SOURCE` correcto, ninguna importación directa del JSON fuera del repositorio de datos | `@code-reviewer` |

**Resultado de auditoría:** escribir/actualizar `AUDIT.md` con tabla de gates (PASA/FALLA + evidencia), lista de defectos con severidad (crítico/mayor/menor), y qué se corrige en la siguiente pasada. Los defectos **críticos se corrigen dentro de la misma iteración** antes de cerrarla.

---

## 4. Condición de parada

- **Éxito:** todos los gates G1–G9 en PASA y cero defectos críticos/mayores abiertos → detener el loop aunque queden iteraciones.
- **Límite:** al cerrar la iteración 5, detener el loop incondicionalmente, esté como esté, y reportar el estado real sin maquillarlo.

---

## 5. Protocolo por iteración (checklist operativo)

1. Leer `AUDIT.md` y `DECISIONS.md` de la iteración anterior.
2. Escribir plan de la iteración en `PLAN-ITERACION-N.md` (tareas, subagente asignado, criterio de hecho).
3. Ejecutar tareas delegando en subagentes; commit por tarea.
4. `@code-reviewer` revisa cada módulo nuevo antes de integrarlo.
5. Correr suite completa de tests + build.
6. Auditoría de gates G1–G9 → actualizar `AUDIT.md`.
7. Corregir críticos. Re-auditar los gates afectados.
8. Commit de cierre: `chore: cierre iteración N — estado gates`.

---

## 6. Entregable final del loop

Al detenerse (por éxito o por límite), generar `INFORME-FINAL.md` con:

1. Estado de cada gate con evidencia (capturas, resultados de Lighthouse, salida de tests).
2. Funcionalidades completadas vs. DESCRIBE.md §4, con % honesto de cobertura del alcance.
3. Defectos abiertos priorizados.
4. Decisiones de arquitectura relevantes (resumen de `DECISIONS.md`).
5. **Instrucciones exactas para Pedro:** cómo arrancar la app, cómo probar los 4 flujos críticos en su móvil (navegador), y qué mirar.
6. Roadmap de publicación: pasos Capacitor/App Store pendientes + recordatorio del Gate 0 (sustitución de medios) como bloqueante legal.

---

*El objetivo no es "terminar iteraciones", es entregar un producto que un usuario real pueda usar mañana en su móvil para entrenar. Cada decisión se juzga contra eso.*
