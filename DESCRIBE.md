# DESCRIBE.md — FORGE (nombre provisional)
## Plataforma de entrenamiento adaptativo con IA

**Versión:** 1.0 · **Fecha:** 2026-07-17 · **Propietario:** Pedro (Contigo)
**Visión de producto:** La app de entrenamiento que se adapta a ti en tiempo real, no al revés.

---

## 1. Resumen ejecutivo

FORGE es una aplicación de entrenamiento y preparación física, web-first (PWA responsive para navegador de escritorio y móvil), diseñada para empaquetarse posteriormente como app nativa iOS (App Store) mediante Capacitor.

Diferenciadores clave frente a apps genéricas de fitness:

1. **Entrevista inicial conducida por IA** que construye el perfil del usuario (objetivos, nivel, lesiones, equipamiento, disponibilidad, tipo de cuerpo) y selecciona/configura una metodología de entrenamiento.
2. **Sesiones generadas proceduralmente** a partir de la metodología elegida, el historial y el estado del usuario ese día — no plantillas estáticas.
3. **Agente de IA siempre disponible** dentro de la app: explica ejercicios, resuelve dudas, ajusta la sesión en curso ("me duele el hombro, cambia este ejercicio"), y gestiona la progresión entre sesiones.
4. **Ejecución de sesión con gestión completa de tiempos**: cronómetro global, temporizadores de descanso, tiempo bajo tensión (TUT), tempo por fase (excéntrica/concéntrica), EMOM/AMRAP/Tabata según metodología.
5. **Seguimiento de progreso multimodal**: fotos, encuestas (RPE, fatiga, sueño, adherencia), métricas corporales — con cadencia definida por la metodología (diaria, semanal, por mesociclo).

---

## 2. Usuarios objetivo

- **Principiante guiado**: no sabe por dónde empezar; necesita que la IA le entreviste y le dé un plan cerrado con explicaciones.
- **Intermedio autónomo**: quiere una metodología seria (5/3/1, PPL, full-body, hipertrofia por volumen, calistenia progresiva...) con ajustes automáticos de carga y volumen.
- **Usuario con limitaciones**: lesiones, movilidad reducida, material limitado o entrenamiento en casa (~25% del dataset es peso corporal).

---

## 3. Fuente de datos de ejercicios

**Repositorio:** https://github.com/hasaneyldrm/exercises-dataset

- 1.324 ejercicios en `data/exercises.json`, cada uno con: id, nombre, categoría/grupo corporal, músculo objetivo, músculos secundarios, equipamiento, instrucciones (EN/TR), thumbnail JPG y GIF de animación.
- 10 categorías corporales, 12+ tipos de equipamiento, 325 ejercicios sin material.

### ⚠️ RESTRICCIÓN DE LICENCIA (BLOQUEANTE PARA PUBLICACIÓN)

El dataset es **solo para uso educativo y no comercial**. Los medios (JPG/GIF) pertenecen a terceros.

**Política del proyecto:**
- FASE DEV: se usa el dataset íntegro como datos de desarrollo y prototipado.
- FASE PRE-PUBLICACIÓN (gate obligatorio, ver LOOP §Gate 0): antes de cualquier distribución comercial (App Store, cobro a usuarios, publicidad) los medios deben sustituirse por:
  a) assets propios (ilustraciones vectoriales / renders 3D propios — sinergia con el pipeline de imagen que ya usa Contigo), o
  b) una fuente con licencia comercial (p. ej. API de ejercicios con plan comercial), o
  c) medios generados por IA con derechos de uso comercial.
- Los datos textuales (nombres, músculos, instrucciones) deben reescribirse/traducirse al español (obligatorio de todas formas: la app es en español y el dataset solo trae EN/TR), lo cual además crea contenido propio.
- El código debe abstraer la fuente de datos tras una capa `ExerciseRepository` para que el swap de dataset sea un cambio de adaptador, no una reescritura.

---

## 4. Funcionalidades (alcance v1)

### 4.1 Onboarding y perfil
- Entrevista conversacional con la IA: objetivos (fuerza / hipertrofia / pérdida de grasa / salud general / rendimiento), experiencia, lesiones y zonas a evitar, equipamiento disponible, días y minutos por semana, preferencias.
- Resultado: **Perfil de Atleta** + **Metodología asignada** con parámetros iniciales (frecuencia, split, rangos de reps, progresión).
- El perfil es editable en cualquier momento, manualmente o vía chat con la IA.

### 4.2 Motor de metodologías
- Catálogo inicial (mínimo 5): Full-Body principiante (progresión lineal), Push/Pull/Legs, Upper/Lower, Hipertrofia por volumen (doble progresión), Calistenia progresiva. Arquitectura extensible por JSON/config para añadir más.
- Cada metodología define: estructura de sesiones, selección de ejercicios (por patrón de movimiento y músculo, filtrando por equipamiento y lesiones), esquemas de series/reps/descanso/tempo, reglas de progresión y deload, y cadencia de check-ins.

### 4.3 Generación procedural de sesiones
- Cada sesión se genera al momento a partir de: metodología + historial + feedback reciente (RPE, dolor, fatiga) + equipamiento del día.
- Sustitución inteligente: si un ejercicio no es viable (material, molestia), el motor propone alternativas del mismo patrón/músculo desde el dataset.
- Determinismo con semilla: la sesión generada se persiste; regenerar no cambia lo ya hecho.

### 4.4 Ejecución de sesión (Player de entrenamiento)
- Vista paso a paso por ejercicio: animación GIF, instrucciones en español, series objetivo, carga sugerida.
- Registro por serie: reps realizadas, peso, RPE, con edición rápida.
- **Sistema de tiempos:** temporizador de descanso auto-arrancado al cerrar serie (con ajuste ±15s), cronómetro global de sesión, tiempo efectivo vs. total, timers de TUT/tempo cuando la metodología lo pida, modos EMOM/AMRAP/Tabata/circuito. Señales sonoras y vibración (móvil). Pantalla activa durante la sesión (Wake Lock API).
- Gestión en tiempo real: saltar, sustituir, añadir series, terminar antes; todo queda registrado y la IA lo tiene en cuenta para la siguiente sesión.

### 4.5 Agente de IA integrado
- Chat accesible desde toda la app (botón flotante) y embebido en el player.
- Capacidades (tool-use sobre la API del backend):
  - Leer/escribir perfil, plan, sesiones e historial.
  - Explicar cualquier ejercicio del dataset (técnica, músculos, errores comunes).
  - Modificar la sesión en curso (sustituciones, ajuste de volumen/intensidad).
  - Responder con base en conocimiento de ciencias del deporte, metodologías, tipos de cuerpo y nociones de fisioterapia (system prompt especializado + acceso a la BD).
- **Límite de seguridad:** nunca diagnostica; ante señales de lesión recomienda profesional sanitario y adapta el plan de forma conservadora. Disclaimer visible.
- Implementación: Claude API (claude-sonnet) con tools definidas contra el backend; historial de conversación persistido por usuario.

### 4.6 Progreso y check-ins
- Fotos de progreso (subida desde cámara/galería, almacenamiento privado, comparador lado a lado por fechas).
- Encuestas configurables por metodología: diarias (energía, sueño, dolor), semanales (peso, medidas, adherencia), por mesociclo (test de fuerza, fotos).
- Dashboards: volumen por grupo muscular, progresión de cargas por ejercicio, racha/adherencia, evolución de métricas corporales. Gráficas interactivas.
- La IA lee estos datos para ajustar progresión y deloads.

### 4.7 Cuentas y datos
- Autenticación email + OAuth (Apple obligatorio para App Store, Google).
- Datos de salud = datos sensibles: cifrado en tránsito y reposo, exportación y borrado de cuenta (GDPR), fotos en bucket privado con URLs firmadas.

---

## 5. Diseño UI/UX

- **Dirección de arte:** deportiva, moderna, oscura por defecto (dark-first), acentos de alta energía (un solo color de acento configurable vía `--accent`, coherente con el boilerplate de Contigo). Tipografía display contundente para números (cargas, timers) + sans legible para texto.
- **3D y motion:** héroe/dashboard con elemento 3D ligero (Three.js / react-three-fiber): p. ej. figura anatómica con músculos trabajados resaltados tras cada sesión. Microinteracciones con Framer Motion. Presupuesto de rendimiento estricto: el 3D nunca puede degradar el player de entrenamiento; fallback 2D en dispositivos modestos (`prefers-reduced-motion`, detección de GPU).
- **Mobile-first real:** el player se diseña primero para una mano y pantalla pequeña; targets táctiles ≥44px; timers legibles a 1 metro.
- **Accesibilidad:** contraste AA, navegación por teclado en web, textos alternativos.

---

## 6. Arquitectura técnica

| Capa | Elección | Motivo |
|---|---|---|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind + Framer Motion + react-three-fiber | Continuidad con el stack existente de Contigo |
| PWA | next-pwa / serwist: instalable, offline para sesión en curso | Usable como app antes del wrapper nativo |
| Backend | Next.js API routes / route handlers + Prisma | Un solo repo, despliegue simple |
| BD | SQLite (dev) → Postgres (Supabase) en prod | Migración trivial con Prisma |
| Media | Assets del dataset servidos localmente en dev; en prod, storage (Supabase Storage) | Preparado para el swap de licencia |
| IA | Claude API con tool-use; claves solo en servidor | Agente con acceso controlado a la BD |
| Nativo iOS | Capacitor (fase 2, tras validación en navegador) | Reutiliza el 100% del código web |
| Testing | Vitest (unit), Playwright (E2E web + viewport móvil) | Gates automatizables por el loop |

**Modelo de datos (núcleo):** User, Profile, Methodology, Plan, Session, SessionExercise, SetLog, Exercise (importado del dataset), CheckIn, ProgressPhoto, ChatThread/ChatMessage.

**Pipeline del dataset:** script de importación `data/exercises.json` → BD, con normalización, traducción de instrucciones a ES (batch vía Claude API, revisadas), y verificación de integridad (1.324 registros, 1.324 imágenes, 1.324 GIFs, sin rutas rotas).

---

## 7. Criterios de éxito (Definition of Done v1)

1. Un usuario nuevo completa la entrevista y recibe un plan coherente en <5 minutos.
2. Puede ejecutar una sesión completa desde el móvil (navegador) con timers, registro de series y sustituciones, sin errores.
3. El agente de IA responde dudas sobre cualquier ejercicio y modifica la sesión en curso vía chat.
4. Check-in semanal con foto y encuesta funciona y alimenta el dashboard.
5. Lighthouse móvil: Performance ≥85, Accessibility ≥95. Player usable offline.
6. Todos los tests E2E críticos en verde en viewport móvil y escritorio.
7. Capa de datos abstraída: cambiar la fuente de ejercicios no toca UI ni motor.
8. Documentado el plan de sustitución de medios pre-App Store (Gate 0 del loop).

---

## 8. Fuera de alcance v1
- Social/comunidad, wearables, nutrición detallada, Android, pagos/suscripciones, modo entrenador-cliente. Se evalúan en v2.
