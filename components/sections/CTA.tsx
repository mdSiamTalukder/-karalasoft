import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';

/**
 * Large gradient CTA panel (`.cta`) — used on the home and services pages.
 */
export function CTA({
  eyebrow,
  title,
  description,
  action,
  className = '',
}: {
  eyebrow: string;
  title: string;
  description: string;
  action: { label: string; href: string };
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="relative overflow-hidden rounded-[34px] border border-line bg-[radial-gradient(circle_at_15%_20%,rgba(88,236,255,0.17),transparent_28%),radial-gradient(circle_at_85%_75%,rgba(156,100,255,0.18),transparent_32%),linear-gradient(145deg,var(--t-cta-from),var(--t-cta-to))] px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="my-0 mb-5 max-w-[900px] text-[clamp(34px,6vw,72px)] leading-[0.95] tracking-[-0.055em]">
          {title}
        </h2>
        <p className="mb-0 max-w-[700px] text-[18px] text-muted">{description}</p>
        <div className="mt-7 flex flex-wrap gap-3 lg:mt-[30px]">
          <ButtonLink href={action.href} variant="primary">
            {action.label} <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  );
}

/** Home variant — “Have an idea?” */
export function HomeCTA() {
  return (
    <CTA
      eyebrow="HAVE AN IDEA?"
      title="Make people say, “Who built this?”"
      description="Bring us the rough idea, the broken workflow, the ambitious product or the system nobody else wants to untangle."
      action={{ label: 'Start the conversation', href: '/contact' }}
    />
  );
}