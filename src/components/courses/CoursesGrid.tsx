import { content } from "@/data/content";
import { Container } from "@/components/shared/Container";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { CourseCard } from "./CourseCard";

export function CoursesGrid() {
  return (
    <section id="cursos" aria-labelledby="cursos-heading" className="bg-black-950 py-16 md:py-20 lg:py-24">
      <Container>
        <Eyebrow>{content.sections.courses.eyebrow}</Eyebrow>
        <h2
          id="cursos-heading"
          className="mt-2 max-w-2xl font-heading text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
        >
          {content.sections.courses.title}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 md:mt-16">
          {content.courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
