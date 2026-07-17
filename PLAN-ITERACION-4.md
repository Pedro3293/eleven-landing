# PLAN-ITERACION-4 — Diseño 3D, PWA y pulido

| # | Tarea | Rol | Criterio de hecho |
|---|---|---|---|
| 1 | PWA: manifest + service worker propio (D-10) + instalable | frontend-developer | App shell y media cacheados; funciona el arranque offline |
| 2 | Sesión en curso offline: cola de registros pendientes con reintento | frontend-developer | Registrar series sin red no pierde datos; se sincroniza al volver |
| 3 | Figura 3D del dashboard (react-three-fiber) con músculos trabajados resaltados | frontend-developer + ui-designer | Lazy-load, fallback 2D SVG, respeta prefers-reduced-motion, no degrada el player |
| 4 | Auth email+contraseña que reclama la cuenta anónima (D-9/D-11) | frontend-developer | Registro/login/logout; los datos del anónimo se conservan |
| 5 | Exportación de datos (JSON) y borrado de cuenta (GDPR) | frontend-developer | Descarga completa; borrado con confirmación en dos pasos |
| 6 | Pasada de pulido ui-designer + capturas actualizadas | ui-designer | Microinteracciones coherentes; sin componentes sin estilar |
