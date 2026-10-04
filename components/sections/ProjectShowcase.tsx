import type { ShowcaseGrid } from '@/lib/types';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';

interface ProjectCardProps {
  eyebrow?: string;
  title: string;
  meta: string;
  size: 'large' | 'small';
}

/**
 * Case-study tile (`.project`) with the pure-CSS tilted device mockup (`.device`).
 * On hover the device rotates upright, slides in and scales up.
 */
function ProjectCard({ eyebrow, title, meta, size }: ProjectCardProps) {
  const large = size === 'large';

  return (
    <Reveal as="article" className="group/proj relative">
      <div
        className={`relative overflow-hidden rounded-[30px] border border-line bg-[radial-gradient(circle_at_80%_20%,rgba(83,119,255,0.22),transparent_35%),linear-gradient(145deg,#0c1a2e,#09111d)] ${
          large ? 'min-h-[380px] sm:min-h-[440px] lg:min-h-[470px]' : 'min-h-[210px] sm:min-h-[226px]'
        }`}
      >
        <span
          aria-hidden="true"
          className="absolute top-[12%] right-[-10%] h-[62%] w-[76%] origin-center rounded-[28px_0_0_28px] border border-line bg-[linear-gradient(145deg,#132b49,#0a1523)] shadow-premium transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/proj:translate-x-[-20px] group-hover/proj:translate-y-[10px] group-hover/proj:rotate-[-1deg] group-hover/proj:scale-[1.03] -rotate-[5deg]"
        >
          {/* screen sheen */}
          <span
            aria-hidden="true"
            className="absolute inset-[18px] rounded-[18px] bg-[linear-gradient(90deg,rgba(88,236,255,0.15),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]"
          />
          {/* faux browser chrome */}
          <span
            aria-hidden="true"
            className="absolute top-[10%] left-[7%] h-3.5 w-[45%] rounded-[99px] bg-[#dcecff] shadow-[0_45px_0_#1b3453,0_82px_0_#17304c,0_119px_0_#203b59]"
          />
        </span>

        <div className="absolute bottom-5 left-5 z-4 sm:bottom-6 sm:left-7">
          {eyebrow ? (
            <Eyebrow className="mb-2 bg-[#081321]/80 backdrop-blur-md">{eyebrow}</Eyebrow>
          ) : null}
          <h3 className="mt-2 mb-1.5 text-[24px] sm:text-[31px]">{title}</h3>
          <p className="m-0 text-[16px] text-paper-2">{meta}</p>
        </div>
      </div>
    </Reveal>
  );
}

/** Two-column showcase: one large feature + a stacked column (`.showcase` + `.stack`). */
export function ProjectShowcase({ showcase }: { showcase: ShowcaseGrid }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-[18px]">
      <ProjectCard {...showcase.feature} />

      <div className="grid gap-4 lg:gap-[18px]">
        {showcase.stack.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </div>
    </div>
  );
}