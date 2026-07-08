import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Política de cookies — Eleven Level Group",
  description:
    "Política de cookies de Eleven Level Group. Texto pendiente de confirmación legal del cliente.",
};

export default function PoliticaDeCookiesPage() {
  return (
    <LegalPageLayout title="Política de cookies">
      <p>
        [PLACEHOLDER — texto legal pendiente del cliente]. Este documento
        detallará qué cookies propias y/o de terceros utiliza esta web (por
        ejemplo, técnicas, analíticas o de personalización), su finalidad,
        duración, y cómo aceptarlas, rechazarlas o configurarlas desde el
        navegador, conforme a la normativa vigente de cookies y al RGPD.
      </p>
      <p>
        [PLACEHOLDER — a la fecha de publicación de esta landing no se han
        integrado cookies analíticas ni de terceros; este apartado deberá
        actualizarse en cuanto se incorpore cualquier herramienta de
        analítica, publicidad o medición].
      </p>
      <p>
        Esta página se publica de forma provisional mientras el cliente
        facilita el texto legal definitivo. No debe considerarse una
        política de cookies válida hasta su sustitución.
      </p>
    </LegalPageLayout>
  );
}
