import { ArrowUpRight, PenLine } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';
import { ButtonLink } from '@/components/ui/Button';
import { CONTACT_HERO } from '@/lib/contact-page';

/**
 * ------------------------------------------------------------------------------------
 * Contact hero
 * ------------------------------------------------------------------------------------
 * Mirrors the shared `PageHero` exactly — same spacing scale, same eyebrow, same gradient
 * headline, same `lead` treatment — so the page keeps its existing visual identity. The
 * change is the messaging: it now leads with a product outcome rather than an instruction,
 * and offers the two obvious next steps.
 *
 * Dedicated to `/contact` so the shared `PageHero` stays untouched.
 */
export function ContactHero() {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <Eyebrow>{CONTACT_HERO.eyebrow}</Eyebrow>

        <h1
          id="contact-page-heading"
          className="mt-5 mb-4 max-w-[900px] text-[clamp(42px,7vw,84px)] leading-[0.92] tracking-[-0.065em] max-sm:text-[46px]"
        >
          {CONTACT_HERO.title} <GradientText>{CONTACT_HERO.highlight}</GradientText>
        </h1>

        <p className="lead max-w-[66ch]">{CONTACT_HERO.lead}</p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={CONTACT_HERO.primary.href} variant="primary">
            <PenLine aria-hidden="true" className="size-4" />
            {CONTACT_HERO.primary.label}
          </ButtonLink>
          <ButtonLink href={CONTACT_HERO.secondary.href}>
            {CONTACT_HERO.secondary.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}