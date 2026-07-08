import { Hero } from "@/components/hero/Hero";
import { Purpose } from "@/components/purpose/Purpose";
import { CoursesGrid } from "@/components/courses/CoursesGrid";
import { Timeline } from "@/components/timeline/Timeline";
import { Values } from "@/components/values/Values";
import { Testimonials } from "@/components/testimonials/Testimonials";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <header>
        <Hero />
      </header>
      <main>
        <Purpose />
        <CoursesGrid />
        <Timeline />
        <Values />
        <Testimonials />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
