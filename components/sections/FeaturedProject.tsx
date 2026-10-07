import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ImageOff, Layers, Sparkles } from 'lucide-react';

import type { Project } from '@/lib/projects';
import { ButtonLink } from '@/components/ui/Button';

/**
 * ------------------------------------------------------------------------------------
 * Featured case study
 * ------------------------------------------------------------------------------------
 * An editorial two-column treatment for a single real project, promoted from the CMS
 * order (`order_index` 0 → the first published project).
 *
 * Every value rendered here — title, category, year, description, image, technologies and
 * link — comes from the fetched `Project`. Nothing is written by hand, and the project is
 * deliberately repeated in the grid below (the CMS order is never mutated to hide it).
 *
 * The live CTA renders only when the data layer actually supplied a `liveUrl`; the exact
 * same field that drives the card links in `ProjectsGrid`.
 */

/** Shown when the featured image is missing or fails upstream. */
function FeaturedFallback() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,rgba(88,236,255,0.20),rgba(83,119,255,0.10)_45%,transparent_72%)]"
    >
      <ImageOff className="size-10 text-cyan/45" strokeWidth={1.5} />
    </span>
  );
}

export function FeaturedProject({ project }: { project: Project }) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(project.imageUrl) && !imageFailed;

  return (
    <div className="group/feat relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] backdrop-blur-[18px]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        {/* ---------------------------------------------------------------- cover */}
        <div className="relative aspect-16/11 w-full overflow-hidden lg:aspect-auto lg:min-h-[420px]">
          {showImage ? (
            <Image
              src={project.imageUrl as string}
              alt={`${project.title} — ${project.category || 'project'}`}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/feat:scale-[1.04]"
              sizes="(max-width: 1023px) 100vw, 52vw"
              quality={86}
              priority
              onError={() => setImageFailed(true)}
            />
          ) : (
            <FeaturedFallback />
          )}

          {/*
            Single diagonal light sweep, tied to hover only — no idle loop, so the page
            keeps its calm while still reading as considered.
          */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(105deg,transparent_38%,rgba(88,236,255,0.10)_48%,transparent_58%)] opacity-0 transition-opacity duration-700 group-hover/feat:opacity-100"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,9,19,0.55),transparent_55%)] lg:bg-[linear-gradient(to_right,transparent_62%,rgba(5,9,19,0.55))]"
          />
        </div>

        {/* ----------------------------------------------------------------- copy */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan/25 bg-cyan/[0.07] px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] text-cyan uppercase">
              <Sparkles aria-hidden="true" className="size-3" strokeWidth={2} />
              Featured build
            </span>
            {project.category ? (
              <span className="rounded-full border border-line bg-veil/[0.04] px-3 py-1.5 text-[11px] text-paper-3">
                {project.category}
              </span>
            ) : null}
            {project.year ? (
              <span className="rounded-full border border-line bg-veil/[0.04] px-3 py-1.5 text-[11px] text-paper-3">
                {project.year}
              </span>
            ) : null}
          </div>

          <h2 className="mt-5 mb-3 text-[clamp(26px,3vw,38px)] leading-[1.02] tracking-[-0.045em] text-balance">
            {project.title}
          </h2>

          {project.description ? (
            <p className="m-0 max-w-[52ch] text-[15px] leading-relaxed text-paper-2">
              {project.description}
            </p>
          ) : null}

          {project.tags.length > 0 ? (
            <div className="mt-6">
              <p className="m-0 mb-2.5 flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-muted-soft uppercase">
                <Layers aria-hidden="true" className="size-3.5" strokeWidth={1.6} />
                Built with
              </p>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-[10px] border border-line bg-veil/[0.05] px-3 py-1.5 text-[13px] text-paper-2"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-7 flex flex-wrap items-center gap-4">
            {project.liveUrl ? (
              <ButtonLink
                href={project.liveUrl}
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — opens the live project in a new tab`}
              >
                View project
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </ButtonLink>
            ) : null}

            <a
              href="#projects-archive"
              className="text-[15px] text-muted underline-offset-4 transition-colors duration-200 hover:text-on-surface hover:underline"
            >
              Browse all projects
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}