/**
 * Constantes de contacto directo.
 *
 * Ninguno de estos valores es real todavía: el cliente no ha facilitado
 * sus datos operativos definitivos. Sustituir por los valores reales
 * antes de publicar la landing en producción.
 */

// PLACEHOLDER: número de WhatsApp en formato E.164 sin "+" ni espacios
// (formato requerido por la URL de wa.me). Sustituir por el número real.
export const WHATSAPP_NUMBER = "34600000000"; // PLACEHOLDER

// PLACEHOLDER: email operativo usado para el enlace `mailto:` funcional
// de la sección de contacto. Distinto del texto literal del footer
// (que muestra el marcador de copy.md tal cual). Sustituir por el email real.
export const CONTACT_EMAIL = "info@elevenlevelgroup.com"; // PLACEHOLDER

const WHATSAPP_PREFILL_MESSAGE =
  "Hola, quiero información sobre los cursos de Eleven Level Group.";

export function getWhatsAppUrl(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_PREFILL_MESSAGE
  )}`;
}
