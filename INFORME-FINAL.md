# INFORME-FINAL — Loop FORGE

**Fecha de cierre:** 2026-07-17 · **Rama:** `claude/loop-forge-app-execution-itjm5d`
**Condición de parada:** éxito — todos los gates G1–G9 en PASA y cero defectos críticos/mayores
(§4 del LOOP), alcanzada al cierre de la iteración 5.

---

## 1. Estado de los gates (evidencia)

| Gate | Estado | Evidencia |
|---|---|---|
| G1 Build | PASA | `npm run build` limpio; 0 errores de TypeScript estricto |
| G2 Tests | PASA | **41/41 unit** (motor >95% cobertura, gate ≥80%) · **7/7 E2E** Playwright a 390px y 1440px |
| G3 Diseño | PASA | `docs/capturas/` a 390/768/1440 de home, onboarding, dashboard, player y descanso |
| G4 Contenido | PASA (menores) | UI 100% ES; 1.324/1.324 instrucciones ES; disclaimers visibles |
| G5 BD | PASA | Importación verificada 1.324/1.324, 0 media rota, migraciones reproducibles |
| G6 Responsive | PASA | 4 flujos críticos E2E en móvil; sin overflow horizontal; targets ≥44px |
| G7 Rendimiento | PASA | Lighthouse móvil (producción): **dashboard Perf 91 · home 100/100/96 · onboarding 99/95/96** (Perf/A11y/BP; gate: ≥85/≥95/≥95) |
| G8 Seguridad | PASA | Claves solo servidor; scrypt; cookies HMAC httpOnly; zod en API; fotos privadas con control de acceso verificado |
| G9 Licencia | PASA | LICENSE-PLAN.md, warning de build con `MEDIA_SOURCE=dev-dataset`, atribución © Gym visual en UI |

Detalle y defectos: `AUDIT.md`.

## 2. Funcionalidades vs. DESCRIBE §4 (cobertura honesta ≈ 90%)

| Área | Estado |
|---|---|
| 4.1 Onboarding y perfil | ✅ Entrevista conversacional estructurada → Perfil + metodología con razones, <5 min. Editable vía chat (tools) y recreable. **Matiz:** la entrevista es determinista, no free-text con IA (D-8: funciona sin clave; mismo resultado) |
| 4.2 Motor de metodologías | ✅ 5 metodologías declarativas extensibles, esquemas completos (series/reps/descanso/tempo, progresión, deload, check-ins) |
| 4.3 Generación procedural | ✅ Semilla persistida y determinista, filtros equipamiento/lesión, feedback reciente (RPE/dolor/energía), sustitución inteligente, presupuesto de tiempo |
| 4.4 Player | ✅ GIF+instrucciones ES, registro por serie con RPE y edición, descanso auto ±15s, cronómetro global y tiempo efectivo, tempo/TUT, EMOM/AMRAP/Tabata, Wake Lock, sonido/vibración*, saltar/sustituir/añadir/terminar. *Vibración no existe en Safari iOS (plataforma) |
| 4.5 Agente IA | ✅ Agent loop Claude API con 9 tools (leer/escribir perfil, plan, sesión, historial, explicar, sustituir, ajustar), system prompt especializado con límites de seguridad, chat global + embebido, conversaciones persistidas. **Requiere `ANTHROPIC_API_KEY` en runtime; sin ella, modo degradado honesto** |
| 4.6 Progreso y check-ins | ✅ Check-ins diario/semanal por metodología, fotos privadas + comparador, dashboards (volumen/músculo, cargas, adherencia, peso). El feedback alimenta la generación. Mesociclo: cadencia definida, sin recordatorio automático (v1.1) |
| 4.7 Cuentas y datos | ✅ Email+contraseña (scrypt) reclamando la cuenta anónima; exportación JSON y borrado GDPR. ⏳ Google/Apple OAuth pendientes de credenciales (Apple es obligatorio solo al publicar; ver RELEASE.md) |
| PWA | ✅ Manifest+iconos+SW propio; app shell y GIFs cacheados; cola offline de registros con resincronización |
| 3D | ✅ Figura anatómica low-poly (r3f) con músculos trabajados resaltados, lazy, fallback 2D, prefers-reduced-motion |

## 3. Defectos abiertos priorizados

Todos **menores** (detalle en AUDIT.md): 1) ~10% de nombres de ejercicio con traducción torpe;
2) exclusión por lesión conservadora en exceso; 3) flujo IA real sin E2E por falta de clave en
este entorno; 4) sin vibración en iOS web (limitación de plataforma).

## 4. Decisiones de arquitectura relevantes (de DECISIONS.md)

- **D-1/D-2:** la licencia real del dataset es MIT + medios © Gym visual con permiso (mejor que lo
  asumido); las instrucciones **ya venían en español** → sin traducción batch; solo nombres por
  glosario determinista propio.
- **D-4:** medios servidos por `/api/media` según `MEDIA_SOURCE` → el swap legal es un adaptador.
- **D-8:** IA con degradación elegante: todo flujo crítico es completable sin clave.
- **D-9/D-11:** usuario anónimo con cookie firmada auto-provisionado; el alta por email lo reclama
  sin perder datos. OAuth pospuesto a despliegue con credenciales.
- **D-10:** service worker propio (~80 líneas) en vez de next-pwa/serwist.
- Motor puro e inyectable (repositorio como interfaz) → testeable sin BD; UI nunca toca el dataset.

## 5. Instrucciones exactas para Pedro

### Arrancar en tu máquina

```bash
git checkout claude/loop-forge-app-execution-itjm5d
npm install
git clone --depth 1 https://github.com/hasaneyldrm/exercises-dataset vendor/exercises-dataset
npx prisma migrate dev && npm run db:import
# opcional, para el chat IA real:  echo 'ANTHROPIC_API_KEY=sk-ant-…' >> .env
npm run dev
```

### Probar en tu móvil (navegador)

Con el móvil en la misma red WiFi: `npm run dev -- -H 0.0.0.0` y abre `http://IP-de-tu-pc:3000`.

1. **Onboarding → plan (<5 min):** desde la home pulsa «Empezar». Responde la entrevista (prueba
   marcando una lesión, p. ej. Rodilla). Mira: recomendación con razones, poder elegir otra
   metodología, y que aterrizas en el dashboard con tu plan.
2. **Sesión completa:** «Empezar sesión». Mira: GIF y pasos en español («Cómo se hace»),
   registrar series con los steppers (aparece el descanso automático con ±15s y sonido al final),
   cronómetro global vs. efectivo arriba, menú «⋯» → sustituir (alternativas con tu material),
   añadir serie y saltar. Termina con la bandera → resumen con volumen. Si marcaste Rodilla,
   comprueba que el día de pierna no carga sentadillas/zancadas.
3. **Chat que modifica la sesión** (con clave configurada): dentro del player, icono de chat →
   «Me molesta este ejercicio, cámbialo». Mira: el ejercicio cambia en la sesión al momento y la
   IA te dice qué hizo. Sin clave verás el aviso de modo degradado (comportamiento previsto).
4. **Check-in → dashboard:** Dashboard → «Progreso y check-ins» → «Semanal». Rellena energía,
   sueño, peso y una foto. Mira: la foto en la galería (privada), el peso en su gráfica al tener
   dos registros, y que las molestias marcadas protegen la siguiente sesión generada.

Extras: instala la PWA («Añadir a pantalla de inicio»), prueba el modo avión a mitad de sesión
(los registros se guardan y sincronizan al volver la red) y Ajustes → crear cuenta / exportar /
borrar datos.

## 6. Roadmap de publicación (App Store)

Pasos detallados en **RELEASE.md**: desplegar backend (Postgres/Supabase + storage privado +
`ANTHROPIC_API_KEY`), Capacitor iOS, **Sign in with Apple** (obligatorio), permisos de cámara y
checklist de envío. **Bloqueante legal:** el Gate 0 de LICENSE-PLAN.md — sustituir o licenciar
los medios © Gym visual y cambiar `MEDIA_SOURCE` antes de cualquier distribución comercial; el
build avisa mientras no se haga.

---
*9 commits sobre `main` · Next.js 15 + TS estricto + Prisma/SQLite + Vitest + Playwright.*
