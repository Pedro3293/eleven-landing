# PLAN-ITERACION-3 — Agente de IA + Progreso

| # | Tarea | Rol | Criterio de hecho |
|---|---|---|---|
| 1 | Cliente Claude API + tools de backend (perfil, plan, sesión en curso, historial, explicar ejercicio, sustituir, ajustar volumen) | frontend-developer | Agent loop server-side con tools; claves solo en servidor; degradación elegante sin clave (D-8) |
| 2 | System prompt especializado (ciencias del deporte, seguridad, ES) | copywriter-web | No diagnostica; deriva a profesionales; disclaimer visible en UI |
| 3 | API de chat + persistencia de conversaciones (ChatThread/ChatMessage) | frontend-developer | Historial por usuario y contexto (global/sesión) |
| 4 | Chat UI: botón flotante global + embebido en player | frontend-developer + ui-designer | Accesible desde toda la app; acciones de la IA se reflejan en la sesión |
| 5 | Check-ins configurables (diario/semanal/mesociclo según metodología) | frontend-developer | Formulario + API; los datos alimentan la generación (feedback) |
| 6 | Fotos de progreso: subida, storage privado, comparador | frontend-developer | Nunca públicas; servidas con auth; comparador lado a lado |
| 7 | Dashboards de progreso (volumen por músculo, cargas, adherencia, métricas) | frontend-developer + ui-designer | Gráficas SVG propias, legibles en móvil |
