# DECISIONS.md — Registro de decisiones del loop FORGE

Formato: **D-N · [iteración] decisión — porqué.**

## Gate 0 / Iteración 0

- **D-1 · [G0] La licencia real del dataset difiere de DESCRIBE.md §3 (a mejor).** El repo fuente
  publica MIT para código/datos/instrucciones y los medios son © Gym visual redistribuidos con
  permiso (180×180 + atribución). Se mantiene íntegro el plan de sustitución pre-publicación como
  salvaguarda legal (ver LICENSE-PLAN.md), pero en dev la atribución visible en UI ya cumple las
  condiciones del titular.
- **D-2 · [G0] No hace falta traducción batch de instrucciones.** El dataset ya trae
  `instructions.es` e `instruction_steps.es` en 1.324/1.324 ejercicios (verificado en la
  importación). Se traduce únicamente el **nombre** del ejercicio con un glosario determinista
  propio (`scripts/lib/translate-name.ts`) revisado por muestreo; el nombre EN se conserva como
  `nameEn` para búsqueda.
- **D-3 · [G0] FORGE sustituye a la landing en esta rama.** El repo contenía una landing Next.js 14
  sin relación con el producto. La rama `claude/loop-forge-app-execution-itjm5d` pasa a contener la
  app FORGE completa; `main` conserva la landing. Motivo: es el repo y la rama designados para el
  loop.
- **D-4 · [G0] Los medios se sirven vía route handler `/api/media/[...path]`** que lee de
  `vendor/exercises-dataset` según `MEDIA_SOURCE`. Así el swap de fuente de medios es un cambio de
  configuración/adaptador y los componentes solo conocen URLs lógicas.
- **D-5 · [I0] `src/` como raíz de código (src/app, src/components, src/lib...).** El LOOP pinta la
  estructura sin `src/`, pero el repo ya estaba configurado con `src/` y paths `@/*`; Next.js
  soporta ambas y no cambia nada funcional.
- **D-6 · [I0] Tailwind 3.4 (ya presente) en lugar de migrar a v4.** Cero beneficio funcional para
  v1 y menos riesgo en el gate de build.
- **D-7 · [I0] Subagentes del LOOP ejecutados como roles internos.** El entorno de ejecución no
  dispone de los subagentes nombrados (`@ui-designer`, etc.); el orquestador asume cada rol en su
  fase correspondiente aplicando sus criterios (design system documentado, revisión de código por
  checklist, QA responsive con Playwright a 390/768/1440px, microcopy ES revisado).
- **D-8 · [I0] IA con degradación elegante.** Todo lo que depende de la Claude API funciona con
  `ANTHROPIC_API_KEY` en servidor; sin clave, el onboarding usa una entrevista estructurada
  determinista (mismo resultado: Perfil + Plan) y el chat muestra estado «IA no configurada» con
  acciones rápidas no-IA (sustituir ejercicio, ajustar descanso). Motivo: el entorno de build no
  tiene clave y los criterios de éxito exigen flujos completables sin errores.
- **D-9 · [I0] Auth v1: email+contraseña con sesión de cookie firmada propia.** Google/Apple OAuth
  requieren credenciales de consola que no existen en este entorno; se deja la estructura preparada
  y documentada en RELEASE.md como paso de configuración. Apple es obligatorio solo al publicar en
  App Store (fase Capacitor).
- **D-10 · [I0] PWA con service worker propio (sin next-pwa/serwist).** Un SW hecho a mano de ~100
  líneas cubre el requisito (app shell + sesión en curso offline + media cache) con menos
  dependencias frágiles que los wrappers.
