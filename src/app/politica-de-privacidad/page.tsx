import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de privacidad — Eleven Level Group",
  description:
    "Política de privacidad de Eleven Level Group. Texto pendiente de confirmación legal del cliente.",
};

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPageLayout title="Política de privacidad">
      <p>
        [PLACEHOLDER — texto legal pendiente del cliente]. Este documento
        detallará qué datos personales recoge Eleven Level Group a través del
        formulario de contacto de esta web (nombre, email, teléfono, curso de
        interés y mensaje), con qué finalidad se tratan, durante cuánto
        tiempo se conservan, con quién se comparten (en su caso) y cómo se
        pueden ejercer los derechos de acceso, rectificación, supresión,
        oposición, limitación y portabilidad reconocidos por el RGPD
        (Reglamento (UE) 2016/679) y la LOPDGDD.
      </p>
      <p>
        [PLACEHOLDER — identificación del responsable del tratamiento: razón
        social, NIF, dirección postal y contacto del delegado de protección
        de datos, si aplica].
      </p>
      <p>
        Esta página se publica de forma provisional mientras el cliente
        facilita el texto legal definitivo. No debe considerarse una
        política de privacidad válida hasta su sustitución.
      </p>
    </LegalPageLayout>
  );
}
