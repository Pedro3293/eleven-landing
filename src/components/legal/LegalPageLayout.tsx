import type { ReactNode } from "react";
import { Container } from "@/components/shared/Container";
import { Footer } from "@/components/footer/Footer";

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

/**
 * Layout sobrio compartido por las páginas legales (privacidad, aviso legal,
 * cookies). Reutiliza el Footer del sitio para mantener navegación y
 * coherencia visual; el contenido real está pendiente de que el cliente
 * facilite los textos legales definitivos (ver marcadores [PLACEHOLDER]).
 */
export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <>
      <header className="border-b border-gray-600 bg-black-950 py-8">
        <Container>
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center font-heading text-base font-semibold uppercase leading-tight tracking-tight text-white"
          >
            Eleven <span className="text-red-600">Level</span> Group
          </a>
        </Container>
      </header>

      <main className="bg-black-950 py-16 md:py-20 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h1 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
              {title}
            </h1>
            <div className="mt-8 flex flex-col gap-4 font-body text-base leading-relaxed text-gray-300">
              {children}
            </div>

            <a
              href="/"
              className="mt-12 inline-flex min-h-[48px] items-center font-body text-sm font-semibold text-steel-400 underline-offset-4 transition-colors duration-200 hover:text-white hover:underline"
            >
              ← Volver al inicio
            </a>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
