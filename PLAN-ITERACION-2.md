# PLAN-ITERACION-2 — Onboarding + Player de entrenamiento

| # | Tarea | Rol | Criterio de hecho |
|---|---|---|---|
| 1 | Sesión de usuario ligera (cookie firmada + usuario auto-provisionado) | frontend-developer | Toda ruta identifica al usuario; sin fricción para probar en móvil. Login completo llega en it. 4 |
| 2 | Design system base (Button, Card, Input, Chip, Sheet, TimerRing, ProgressBar) | ui-designer | Componentes en `/components/ui` según DESIGN-SYSTEM.md; targets ≥44px |
| 3 | Onboarding conversacional (entrevista estructurada; IA cuando hay clave) | frontend-developer + copywriter-web | Al terminar existe Profile + Plan con metodología asignada y explicación; <5 min |
| 4 | API de dominio: perfil, plan, generación/lectura de sesión, registro de series, sustitución, finalización | frontend-developer | Route handlers con validación zod; generación usa el motor + repositorio |
| 5 | Player completo | frontend-developer + ui-designer | GIF+instrucciones ES, registro de series con edición, descanso auto ±15s, cronómetro global, tiempo efectivo, TUT/tempo/EMOM/AMRAP/Tabata, Wake Lock, sonido/vibración, saltar/sustituir/añadir series/terminar |
| 6 | Dashboard mínimo (próxima sesión, empezar/continuar) | frontend-developer | Home útil tras onboarding |
| 7 | Microcopy ES de todo lo anterior | copywriter-web | Tono coherente, disclaimers |
| 8 | QA responsive 390px del player | qa-responsive | E2E Playwright móvil del flujo onboarding→sesión completa |

Decisión D-11: usuario anónimo auto-provisionado con cookie firmada (HMAC) en la primera visita;
el alta con email/contraseña de la it. 4 "reclama" ese usuario. Motivo: probar en móvil sin fricción
y cumplir el criterio de éxito nº1 (<5 min hasta el plan).
