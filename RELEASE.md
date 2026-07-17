# RELEASE.md — Empaquetado iOS con Capacitor (fase 2)

> **NO ejecutar el build nativo todavía.** Este documento deja los pasos listos para después de
> las pruebas manuales de Pedro en navegador (DESCRIBE §6, LOOP it. 5).

## 0. Bloqueante legal previo (Gate 0)

Antes de subir NADA a App Store, completar el checklist de `LICENSE-PLAN.md` §4:
sustitución/licenciamiento de los medios de ejercicios, `MEDIA_SOURCE` distinto de `dev-dataset`
y build sin el warning de licencia. **Sin esto no hay envío a revisión de Apple.**

## 1. Preparación del backend

La app nativa es el mismo frontend web; el backend debe estar desplegado:

1. Migrar BD a Postgres (Supabase): cambiar `datasource` en `prisma/schema.prisma` a `postgresql`,
   `DATABASE_URL` al pooler de Supabase y ejecutar `prisma migrate deploy` + `npm run db:import`.
2. Mover fotos de `storage/private` a Supabase Storage (bucket privado, URLs firmadas) — el código
   de `/api/photos` es el único punto a tocar.
3. Configurar en el servidor: `ANTHROPIC_API_KEY`, `AUTH_SECRET` fuerte, `MEDIA_SOURCE`.
4. Desplegar (Vercel o similar) y verificar los 4 flujos críticos en producción.

## 2. Capacitor

```bash
npm i -D @capacitor/cli && npm i @capacitor/core @capacitor/ios
npx cap init FORGE com.contigo.forge --web-dir=out-native
```

La app carga el frontend desde el servidor desplegado (server.url en `capacitor.config.ts`),
lo que evita duplicar assets y mantiene el player actualizado:

```ts
const config: CapacitorConfig = {
  appId: 'com.contigo.forge',
  appName: 'FORGE',
  webDir: 'public', // no se usa con server.url, pero es obligatorio
  server: { url: 'https://forge.TU-DOMINIO.com', cleartext: false },
  ios: { contentInset: 'automatic' },
};
```

```bash
npx cap add ios
npx cap open ios   # requiere macOS + Xcode
```

## 3. Ajustes iOS obligatorios

- **Sign in with Apple**: obligatorio en App Store al ofrecer login de terceros. Añadir capability
  en Xcode + botón en `/settings` (la estructura de `/api/auth` admite añadir proveedor).
- Info.plist: `NSCameraUsageDescription` y `NSPhotoLibraryUsageDescription` (fotos de progreso).
- Revisar Wake Lock (soportado en WKWebView iOS 16.4+) y vibración (no disponible en iOS web:
  las señales sonoras ya cubren el aviso).
- Icono/splash: `npx @capacitor/assets generate` con `public/icons/icon-512.png`.

## 4. Checklist previo al envío

- [ ] Gate 0 (medios) cerrado y documentado.
- [ ] `npm run build` sin warnings; Lighthouse móvil ≥85/95/95 contra producción.
- [ ] E2E (`npm run test:e2e`) verdes contra producción.
- [ ] Sign in with Apple activo y probado.
- [ ] Política de privacidad y URL de soporte publicadas (datos de salud: revisar App Privacy).
- [ ] Prueba en dispositivo físico: sesión completa + offline + volver de background.
