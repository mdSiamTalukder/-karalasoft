import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import type { Project } from '@/lib/projects';

/**
 * “Selected work” — a small, curated set of real projects that demonstrate the services
 * above, closing the loop between what we offer and what has actually shipped.
 *
 * Titles, categories, years and imagery all come from the projects already fetched by the
 * page; nothing about the projects is written here.
 */
export function ServicesWork({ projects }: { projects: readonly Project[] }) {
  return (
    <Section labelledBy="services-work-heading">
      <Container>
        <SectionHead
          id="services-work-heading"
          eyebrow="SELECTED WORK"
          title={
            <>
              Services backed by
              <br />
              shipped products.
            </>
          }
          description="A cross-section of the platforms we have designed, built and maintained — the same catalogue the services above describe."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-[18px]">
          {projects.map((project, index) => {
            const detail = (
              <Card delay={(index % 4) * 0.07} className="h-full">
                {project.imageUrl ? (
                  <span
                    aria-hidden="true"
                    className="relative mb-5 block aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-line bg-surface"
                  >
                    <Image
                      src={project.imageUrl}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.04]"
                    />
                  </span>
                ) : null}

                <h3 className="mt-0 mb-1.5 text-[19px] leading-tight">{project.title}</h3>
                <p className="m-0 text-[14px] text-muted">
                  {project.category}
                  {project.year ? ` · ${project.year}` : ''}
                </p>
              </Card>
            );

            return (
              <li key={project.id} className="h-full">
                <Link
                  href="/projects"
                  className="group/card block h-full rounded-[26px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                  aria-label={`View ${project.title} in our projects`}
                >
                  {detail}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 rounded-[14px] border border-cyan/20 bg-veil/[0.035] px-5 py-3.5 text-[16px] text-on-surface transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-veil/[0.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            View All Projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>
    </Section>
  );
}