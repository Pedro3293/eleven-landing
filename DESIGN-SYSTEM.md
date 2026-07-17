# DESIGN-SYSTEM.md — FORGE

Dirección de arte: **deportiva, moderna, dark-first**, con un único acento de alta energía.
Referencia de calidad: Apple/Linear. Mobile-first real: el player se diseña para una mano a 390px.

## 1. Color (tokens en `globals.css`, consumidos vía Tailwind)

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#090A0C` | Fondo global |
| `--surface` | `#121417` | Tarjetas, paneles |
| `--surface-2` | `#1A1D21` | Inputs, elevación 2, chips |
| `--line` | `#282C32` | Bordes y divisores |
| `--ink` | `#F5F7FA` | Texto principal |
| `--muted` | `#98A1AD` | Texto secundario, labels |
| `--accent` | `#C8FF2E` (volt) | CTA, estados activos, números clave, progreso. **Configurable con una línea.** |
| `--accent-ink` | `#090A0C` | Texto sobre acento |
| `--danger` / `--success` / `--warn` | `#FF5C5C` / `#3EE08F` / `#FFB020` | Semánticos |

Reglas:
- El acento se usa con intención: 1 CTA primario por pantalla + datos clave (timer activo, PR). Nunca como decoración masiva.
- Texto normal siempre `ink` o `muted` sobre `bg`/`surface` (contraste AA verificado: ink/bg 17.4:1, muted/bg 7.4:1, accent-ink/accent 15.9:1).
- Clases Tailwind: `bg-bg, bg-surface, bg-surface-2, border-line, text-ink, text-muted, bg-accent, text-accent, text-accent-ink`, etc.

## 2. Tipografía

- **Sans del sistema** (`--font-sans`): SF Pro en iOS, Roboto en Android, Segoe en Windows. Cero coste de red (clave para PWA offline y LCP).
- **Números display** (cargas, timers, reps): clase `.numeric-display` → weight 800, `tabular-nums`, tracking -2%. Timers del player ≥ `text-6xl` (legibles a 1 metro).
- Escala: `text-xs` labels/meta · `text-sm` cuerpo secundario · `text-base` cuerpo · `text-lg/xl` títulos de sección · `text-2xl+` títulos de pantalla · `text-6xl–8xl` timers.
- Jerarquía por peso: 400 cuerpo, 500 labels, 600 títulos, 800 números display.

## 3. Espaciado, radios, capas

- Grid de 4px (escala Tailwind). Padding de pantalla móvil: `px-4` (16px). Máximo de contenido: `max-w-lg` en móvil-first, `max-w-5xl` en dashboards de escritorio.
- Radios: tarjetas `rounded-card` (16px) · controles `rounded-control` (12px) · pills/chips `rounded-full`.
- Elevación por color, no por sombra: `bg` → `surface` → `surface-2` + `border-line`. Sombras solo en overlays (`shadow-2xl` de sheet/modal).

## 4. Componentes base (`src/components/ui/`)

- **Button**: variantes `primary` (accent, texto accent-ink, peso 600), `secondary` (surface-2 + border-line), `ghost`, `danger`. Altura mínima 44px (target táctil), `rounded-control`, estados disabled/loading.
- **Card**: `bg-surface border border-line rounded-card p-4`.
- **Input/Select/Textarea**: `bg-surface-2 border-line rounded-control h-11` mínimo, label `text-sm text-muted`.
- **Chip**: selección múltiple (equipamiento, lesiones), `rounded-full`, activo = borde+texto accent.
- **Sheet** (móvil): panel inferior deslizante para acciones del player.
- **Timer ring**: anillo SVG de progreso con acento, número `.numeric-display` centrado.

## 5. Motion (Framer Motion)

- Micro: 150–250ms, easing `easeOut`; entradas con `y: 8→0, opacity 0→1`.
- Cambio de ejercicio en player: slide horizontal 250ms.
- Cifras que cambian (peso, reps): pop suave `scale 0.9→1`.
- **Siempre** respetar `prefers-reduced-motion` (cubierto globalmente en CSS y con `useReducedMotion` en 3D).

## 6. Iconografía

`lucide-react`, tamaño 20/24, stroke 2, color `muted` por defecto, `ink` en activo.

## 7. Accesibilidad

- Targets táctiles ≥44×44px.
- Contraste AA mínimo en todos los pares de texto.
- Foco visible (`:focus-visible` con acento) y navegación por teclado en web.
- `aria-live="polite"` en timers y cambios de estado del player; labels en todos los inputs.
- Textos alternativos en imágenes de ejercicios (nombre ES).

## 8. Voz y microcopy (con `@copywriter-web`)

- Español de España, tuteo, directo y motivador sin gritar («Última serie. Remata.»).
- Números y unidades: `kg`, `min`, `seg`; formato `es-ES`.
- Estados vacíos siempre con acción sugerida.
- Disclaimer de salud visible en onboarding y chat.
