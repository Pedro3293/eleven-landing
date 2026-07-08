import { Container } from "@/components/shared/Container";
import { ContactForm } from "./ContactForm";
import { DirectContact } from "./DirectContact";

export function ContactSection() {
  return (
    <section id="contacto" aria-labelledby="contacto-heading" className="bg-black-950 py-16 md:py-20 lg:py-24">
      <Container>
        <h2 id="contacto-heading" className="sr-only">
          Contacto
        </h2>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <ContactForm />
          <DirectContact />
        </div>
      </Container>
    </section>
  );
}
