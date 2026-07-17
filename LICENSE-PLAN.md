# LICENSE-PLAN.md — Plan de licencias del dataset de ejercicios

**Fecha:** 2026-07-17 · **Estado:** Gate 0 activo · **Responsable:** orquestador del loop

## 1. Situación real de la licencia (verificada contra el repo fuente)

Fuente: `hasaneyldrm/exercises-dataset` (clonado en `vendor/exercises-dataset`, commit fijado por el clone).

La suposición de DESCRIBE.md §3 («solo educativo/no comercial») **no coincide con la licencia
publicada en el repositorio**, que es más permisiva. Lo verificado en `LICENSE` y `NOTICE.md` del
dataset es:

- **Código, estructura del dataset y texto de instrucciones (incluido el español): licencia MIT.**
  Uso comercial permitido conservando el aviso de copyright.
- **Medios (JPG en `images/`, GIF en `videos/`): NO cubiertos por MIT.** Son propiedad de
  **Gym visual** (https://gymvisual.com/), redistribuidos con permiso escrito del titular bajo
  estas condiciones:
  - Resolución máxima **180×180**.
  - Atribución obligatoria en cada uso: **«© Gym visual — https://gymvisual.com/»**
    (cada registro del JSON lleva un campo `attribution`).
  - El uso se rige por los Términos y Condiciones de Gym visual, no por MIT. Clonar el repo
    **no otorga licencia propia** sobre los medios.

## 2. Política del proyecto

### Fase DEV (actual)
- Los medios del dataset se usan **solo en desarrollo y prototipado**, servidos localmente desde
  `vendor/exercises-dataset` a través de la capa de medios de la app (`/api/media/...`).
- Los medios **no se versionan** en este repositorio (`vendor/` en `.gitignore`; solo se versiona
  el script de importación).
- La atribución «© Gym visual» se muestra en la UI junto a los medios (pie del player y ficha de
  ejercicio) mientras `MEDIA_SOURCE=dev-dataset`.

### Fase PRE-PUBLICACIÓN (bloqueante antes de App Store / cobro / publicidad)
Antes de cualquier distribución comercial hay que ejecutar UNA de estas rutas:

a) **Confirmación de derechos con Gym visual**: revisar sus T&C vigentes y, si procede, obtener
   licencia comercial directa (los GIFs a 180×180 con atribución podrían bastar; requiere
   verificación legal explícita — no asumirlo).
b) **Assets propios**: ilustraciones vectoriales o renders 3D propios (sinergia con el pipeline de
   imagen de Contigo).
c) **Fuente con licencia comercial**: API de ejercicios con plan comercial.
d) **Medios generados por IA** con derechos de uso comercial.

El swap es un cambio de adaptador (`ExerciseRepository` + capa de medios), no una reescritura:
ningún componente de UI ni el motor importan `exercises.json` ni rutas de media directamente.

### Datos textuales
- El dataset ya incluye instrucciones en **español** (campo `instructions.es` e
  `instruction_steps.es`, 1.324/1.324 verificado), cubiertas por MIT.
- Los **nombres** de ejercicios se traducen al español durante la importación (glosario propio del
  proyecto); el resultado es contenido propio.

## 3. Mecanismo técnico de control

- Config `MEDIA_SOURCE` (por defecto `dev-dataset`) en `src/lib/config.ts`, leída de
  `process.env.MEDIA_SOURCE`.
- El build de producción (`npm run build`) **emite un warning visible** si `MEDIA_SOURCE=dev-dataset`
  sigue activo (ver `scripts/check-media-source.mjs`, enganchado al script `build`).
- Toda lectura de ejercicios pasa por `ExerciseRepository` (`src/lib/repository/`); las rutas de
  medios se resuelven en la capa de medios, nunca hardcodeadas en componentes.

## 4. Checklist previo al build de App Store

- [ ] Decidida y ejecutada la ruta de medios (a/b/c/d de §2).
- [ ] `MEDIA_SOURCE` cambiado a la fuente definitiva (`own-assets` / `licensed-api` / `ai-generated`).
- [ ] `npm run build` sin warning de media source.
- [ ] Adaptador nuevo implementado y probado (mismos IDs de ejercicio, medias resueltas).
- [ ] Atribución actualizada o retirada según la fuente definitiva.
- [ ] Revisión legal de los T&C de la fuente elegida documentada aquí.
- [ ] Verificación visual de una muestra ≥5% de ejercicios con la media nueva.
