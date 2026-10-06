import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import type { Project } from '@/lib/projects';

/**
 * ------------------------------------------------------------------------------------
 * Selected real projects — `/services` only.
 * ------------------------------------------------------------------------------------
 * One larger featured project plus smaller supporting cards, all read from the projects
 * already fetched by the page. Titles, categories, years, tags, descriptions and imagery
 * are the project's own records — nothing is written here.
 *
 * `liveUrl` comes from the shared `lib/projects.ts` layer (CMS `live_link` plus its curated
 * overrides). When present the card exposes it as a separate "Live site" action that opens
 * in a new tab; the card itself always links to the internal showcase, so an external
 * destination can never hijack the primary navigation.
 */

/** Small technology chips — the project's own `tags`. */
function Tags({ tags, limit = 3 }: { tags: readonly string[]; limit?: number }) {
  if (tags.length === 0) return null;
  return (
    <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
      {tags.slice(0, limit).map((tag) => (
        <li key={tag}>
          <span className="inline-block rounded-[9px] border border-line bg-veil/[0.035] px-2.5 py-1 text-[12px] text-paper-3">
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** External action, only when the project actually has a live URL. */
function LiveLink({ project, className = '' }: { project: Project; className?: string }) {
  if (!project.liveUrl) return null;
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the live ${project.title} site in a new tab`}
      className={`inline-flex items-center gap-1.5 rounded-[10px] border border-cyan/20 bg-veil/[0.035] px-3 py-2 text-[14px] font-semibold text-on-surface transition-[background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-cyan/35 hover:bg-veil/[0.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan ${className}`}
    >
      Live site
      <ExternalLink aria-hidden="true" className="size-3.5" />
    </a>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <Reveal className="h-full">
      <article className="group/work relative flex h-full flex-col overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] transition-[border-color,transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 hover:shadow-[0_28px_70px_var(--t-shadow-card)]">
        {project.imageUrl ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-veil/[0.03]">
            <Image
              src={project.imageUrl}
              alt={`${project.title} — ${project.category}`}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500 ease-out group-hover/work:scale-[1.04]"
              priority={false}
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,var(--t-panel))]"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-full border border-line bg-veil/[0.035] px-3 py-1 text-[12px] tracking-[0.1em] text-paper-3 uppercase">
              {project.category}
            </span>
            {project.year ? (
              <span className="text-[13px] text-muted-soft">{project.year}</span>
            ) : null}
          </div>

          <h3 className="mt-3 mb-2 text-[24px] leading-tight sm:text-[28px]">
            <Link
              href="/projects"
              aria-label={`View the ${project.title} case study`}
              className="rounded-[8px] transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              {project.title}
            </Link>
          </h3>

          {project.description ? (
            <p className="mt-0 mb-0 text-[16px] leading-[1.6] text-muted">
              {project.description}
            </p>
          ) : null}

          <Tags tags={project.tags} limit={4} />

          {/* z-10 keeps the live link clickable above the stretched title link. */}
          <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <LiveLink project={project} />
            <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-muted transition-colors duration-300 group-hover/work:text-cyan">
              Read the case study
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </span>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function SupportingCard({ project }: { project: Project }) {
  return (
    <Reveal as="li" className="h-full">
      <article className="group/work relative flex h-full flex-col overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] transition-[border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/25">
        {project.imageUrl ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-line bg-veil/[0.03]">
            <Image
              src={project.imageUrl}
              alt={`${project.title} — ${project.category}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-out group-hover/work:scale-[1.04]"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-14 bg-[linear-gradient(180deg,transparent,var(--t-panel))]"
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col p-5">
          <p className="m-0 text-[12px] tracking-[0.1em] text-muted-soft uppercase">
            {project.category}
            {project.year ? ` · ${project.year}` : ''}
          </p>

          <h3 className="mt-2 mb-2 text-[19px] leading-tight">
            <Link
              href="/projects"
              aria-label={`View the ${project.title} case study`}
              className="rounded-[8px] transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              {project.title}
            </Link>
          </h3>

          {project.description ? (
            <p className="mt-0 mb-0 line-clamp-3 text-[15px] leading-[1.6] text-muted">
              {project.description}
            </p>
          ) : null}

          <Tags tags={project.tags} />

          <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2.5 border-t border-line pt-4">
            <LiveLink project={project} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ServicesWork({
  featured,
  supporting,
}: {
  featured: Project | null;
  supporting: readonly Project[];
}) {
  if (!featured && supporting.length === 0) return null;

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
          description="A cross-section of the platforms we have designed, built and maintained — the same catalogue behind the services above."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_0.65fr] lg:gap-[18px]">
          {featured ? <FeaturedCard project={featured} /> : null}

          {supporting.length > 0 ? (
            <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-1 lg:gap-[18px]">
              {supporting.map((project) => (
                <SupportingCard key={project.id} project={project} />
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 rounded-[14px] border border-cyan/20 bg-veil/[0.035] px-5 py-3.5 text-[16px] text-on-surface transition duration-300 ease-out hover:-translate-y-0.5 hover:border-white/20 hover:bg-veil/[0.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
          >
            View All Projects
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}