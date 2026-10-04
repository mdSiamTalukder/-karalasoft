import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { GradientText } from '@/components/ui/GradientText';

/** Shared hero for every inner route — recreates `.page-hero`. */
export function PageHero({
  eyebrow,
  headingId,
  title,
  highlight,
  lead,
}: {
  eyebrow: string;
  headingId: string;
  /** Text rendered before the gradient highlight. */
  title: string;
  /** Text rendered inside the animated gradient span. */
  highlight: string;
  lead: string;
}) {
  return (
    <div className="pt-16 pb-9 sm:pt-20 lg:pt-[84px] lg:pb-[42px]">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          id={headingId}
          className="mt-5 mb-4 max-w-[900px] text-[clamp(42px,7vw,84px)] leading-[0.92] tracking-[-0.065em] max-sm:text-[46px]"
        >
          {title} <GradientText>{highlight}</GradientText>
        </h1>
        <p className="lead">{lead}</p>
      </Container>
    </div>
  );
}