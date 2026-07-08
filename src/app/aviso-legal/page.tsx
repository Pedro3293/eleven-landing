import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Aviso legal — Eleven Level Group",
  description:
    "Aviso legal de Eleven Level Group. Texto pendiente de confirmación legal del cliente.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPageLayout title="Aviso legal">
      <p>
        [PLACEHOLDER — texto legal pendiente del cliente]. Este aviso legal
        recogerá la identificación del titular del sitio web conforme a la
        Ley 34/2002, de Servicios de la Sociedad de la Información y de
        Comercio Electrónico (LSSI-CE): denominación social, NIF, domicilio
        social, datos de inscripción registral y datos de contacto.
      </p>
      <p>
        [PLACEHOLDER — condiciones de uso del sitio, régimen de
        responsabilidad, propiedad intelectual e industrial de los
        contenidos, y legislación y jurisdicción aplicables].
      </p>
      <p>
        Esta página se publica de forma provisional mientras el cliente
        facilita el texto legal definitivo. No debe considerarse un aviso
        legal válido hasta su sustitución.
      </p>
    </LegalPageLayout>
  );
}
