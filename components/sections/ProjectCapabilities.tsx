'use client';

import { useMemo } from 'react';
import { BriefcaseBusiness, Layers, Sparkles, Workflow } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { Project } from '@/lib/projects';
import { PROJECT_CAPABILITIES } from '@/lib/projects-page';
import { Reveal } from '@/components/motion/Reveal';

/**
 * ------------------------------------------------------------------------------------
 * Capability themes — "what we build"
 * ------------------------------------------------------------------------------------
 * Four capability themes that summarise the portfolio.
 *
 * Important: the icon is purely decorative. The title, description and category list are
 * chosen to reflect the real work, and the per-theme project count is computed from the
 * projects actually returned by the API — never hardcoded. A theme whose categories do not
 * appear in the current data renders with no count rather than a made-up one.
 */

const ICONS: readonly LucideIcon[] = [BriefcaseBusiness, Workflow, Layers, Sparkles];

type CapabilityStats = {
  index: string;
  label: string;
  title: string;
  description: string;
  count: number;
}[];

/** Counts how many fetched projects fall under each theme's categories. */
function useCapabilityStats(projects: Project[]): CapabilityStats {
  return useMemo(
    () =>
      PROJECT_CAPABILITIES.map((capability) => ({
        index: capability.index,
        label: capability.label,
        title: capability.title,
        description: capability.description,
        count: projects.filter((project) =>
          capability.categories.includes(project.category ?? ''),
        ).length,
      })),
    [projects],
  );
}

export function ProjectCapabilities({ projects }: { projects: Project[] }) {
  const stats = useCapabilityStats(projects);

  if (stats.every((stat) => stat.count === 0)) return null;

  return (
    <div>
      <Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length] as LucideIcon;

            return (
              <Reveal
                key={stat.index}
                as="article"
                delay={i * 0.07}
                className="group/cap h-full rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan/30"
              >
                <span className="inline-flex w-full items-center gap-2.5 text-[11px] tracking-[0.14em] text-muted-soft uppercase">
                  <span className="text-cyan/70">{stat.index}</span>
                  <span aria-hidden="true" className="h-px w-5 bg-line" />
                  <span className="truncate">{stat.label}</span>
                  <Icon aria-hidden="true" className="ml-auto size-4 shrink-0" strokeWidth={1.6} />
                </span>

                <h3 className="mt-4 mb-2.5 text-[20px] leading-tight font-bold tracking-[-0.02em] text-balance">
                  {stat.title}
                </h3>

                <p className="m-0 text-[14px] leading-relaxed text-muted">{stat.description}</p>

                {stat.count > 0 ? (
                  <p className="m-0 mt-5 text-[13px] text-paper-3">
                    <span className="font-bold text-cyan">{stat.count}</span>{' '}
                    {stat.count === 1 ? 'project' : 'projects'}
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}