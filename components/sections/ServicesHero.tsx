import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { ARCHITECTURE_LAYERS, SERVICES_HERO, serviceIcon } from '@/lib/services';

/**
 * ------------------------------------------------------------------------------------
 * Services hero — `/services` only.
 * ------------------------------------------------------------------------------------
 * Two columns: the existing copy on the left, an engineering-stack diagram on the right.
 *
 * This is a dedicated component rather than the shared `PageHero` because it carries calls
 * to action and the architecture visual — `PageHero` is shared by /about, /projects and
 * /contact, which must not change.
 *
 * A server component: no interaction is needed, so there is no reason to ship the diagram
 * to the client. The only motion is the existing `pulseDot` keyframe on two status dots.
 */
function ArchitectureVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto w-full max-w-[420px] rounded-[24px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-3 backdrop-blur-[18px] sm:max-w-none"
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-1">
        <span className="text-[11px] tracking-[0.14em] text-muted-soft uppercase">
          Reference architecture
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-veil/[0.035] px-2 py-1 text-[11px] text-paper-3">
          <span className="inline-block size-1.5 rounded-full bg-lime shadow-[0_0_10px_var(--color-lime)] [animation:pulseDot_2.4s_ease-in-out_infinite]" />
          deployable
        </span>
      </div>

      <ul className="m-0 grid list-none gap-1.5 p-0">
        {ARCHITECTURE_LAYERS.map((layer, index) => {
          const Icon = serviceIcon(layer.iconKey);
          const last = index === ARCHITECTURE_LAYERS.length - 1;

          return (
            <li key={layer.label} className="relative">
              <div className="flex items-center gap-3 rounded-[16px] border border-line bg-veil/[0.035] px-3 py-2.5 transition-colors duration-300 hover:border-cyan/25">
                <span className="grid size-9 shrink-0 place-items-center rounded-[11px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan">
                  <Icon className="size-[18px]" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] leading-tight font-semibold">{layer.label}</span>
                  <span className="mt-0.5 block truncate text-[12px] text-muted-soft">
                    {layer.detail}
                  </span>
                </span>
                {/* Thin status rule — static, so nothing animates continuously. */}
                <span
                  className={`h-1 w-6 shrink-0 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-blue))] ${
                    index < 2 ? 'opacity-80' : index < 4 ? 'opacity-55' : 'opacity-35'
                  }`}
                />
              </div>

              {/* Thin connector between layers */}
              {!last ? (
                <span
                  className="absolute top-full left-[26px] h-1.5 w-px bg-[linear-gradient(180deg,var(--color-cyan),transparent)] opacity-45"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ServicesHero() {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <Reveal>
              <Eyebrow dot>{SERVICES_HERO.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              <h1
                id="services-page-heading"
                className="mt-5 mb-4 max-w-[760px] text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.06em] max-sm:text-[44px]"
              >
                {SERVICES_HERO.title} <GradientText>{SERVICES_HERO.highlight}</GradientText>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="lead max-w-[62ch]">{SERVICES_HERO.lead}</p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/contact" variant="primary">
                  Start a Project <span aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href="/projects">See our work</ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} direction="none">
            <ArchitectureVisual />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}