# Base de conocimiento del entrenador (D-12)

Qué es: la "formación" del entrenador IA de FORGE — un corpus curado en español, versionado en
`src/lib/ai/knowledge/`, que el agente consulta con la tool `search_knowledge` antes de responder
sobre estos temas. Sin `ANTHROPIC_API_KEY`, el chat responde directamente con estas entradas
(modo guía integrada), así que el conocimiento funciona incluso sin IA.

## Cobertura actual (24 entradas)

- **Ciencias del deporte (10):** hipertrofia, fuerza máxima, resistencia y zonas, periodización y
  deload, RPE/RIR, tempo/TUT, recuperación (sueño, DOMS, sobreentrenamiento), sobrecarga
  progresiva, calentamiento/movilidad, nutrición deportiva básica.
- **Metodologías (6):** Full-Body lineal, PPL, Torso-Pierna, hipertrofia por volumen, calistenia
  progresiva, y cómo elegir/cuándo cambiar.
- **Acondicionamiento (4):** capacidades físicas, HIIT/EMOM/AMRAP/Tabata, cardio+fuerza
  (interferencia), entrenamiento para pérdida de grasa.
- **Salud y rendimiento (15):** hipotiroidismo, hipertiroidismo, diabetes tipo 1, diabetes tipo 2,
  hipertensión, asma, obesidad, osteoporosis, artrosis, lumbalgia, cardiopatías, anemia,
  fibromialgia, embarazo/posparto, tendinopatías. Todas con: efecto en el rendimiento, cómo
  adaptar el entrenamiento, señales de alarma y derivación a profesionales (obligatoria).

## Cómo se usa en la app

1. **Agente IA:** tool `search_knowledge(query, category?)`; el system prompt le obliga a
   consultarla antes de responder sobre estos temas y a considerar las condiciones del perfil.
2. **Chat sin clave:** búsqueda léxica local (sin red) → responde con la entrada más relevante.
3. **Perfil:** el onboarding permite declarar condiciones (`Profile.healthConditions`); el agente
   las lee con `get_profile` y puede actualizarlas con `update_profile`.
4. **Motor:** `condition-adjustments.ts` aplica ajustes automáticos conservadores:
   hipertensión/cardiopatía → descansos ×1,25; hipotiroidismo, hipertiroidismo, fibromialgia,
   anemia, embarazo, cardiopatía → recorte de volumen accesorio; osteoporosis → exclusión de
   flexión de tronco con carga externa. Cada condición aporta una nota de seguridad.

## Cómo ampliarla

Añadir una entrada = añadir un objeto `KnowledgeEntry` en el archivo de su categoría (id único,
keywords en minúsculas sin tildes, contenido accionable; en `salud`, siempre con derivación).
Si la condición debe poder declararse en el perfil: añadirla a `HEALTH_CONDITIONS` en
`src/lib/schemas.ts` (mismo `key` que el id de la entrada) y, si procede, un ajuste en
`condition-adjustments.ts`. Los tests de `tests/unit/knowledge.test.ts` verifican la coherencia
id↔condición y que toda entrada de salud deriva.
