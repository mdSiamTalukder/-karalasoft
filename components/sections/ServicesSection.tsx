import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { IconBadge, TagList } from '@/components/ui/IconBadge';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { homeServices } from '@/lib/content';

/** Home — “What we do” grid of six capability cards. */
export function ServicesSection() {
  return (
    <Section alt labelledBy="services-heading">
      <Container>
        <SectionHead
          id="services-heading"
          eyebrow="WHAT WE DO"
          title={
            <>
              From first idea
              <br />
              to serious scale.
            </>
          }
          description="KaralaSoft combines product thinking, elegant design and robust engineering so clients don’t need five different vendors to ship one great product."
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {homeServices.map((service, index) => (
            <li key={service.title}>
              <Card tilt={service.tilt} delay={(index % 3) * 0.08}>
                <IconBadge glyph={service.glyph} label={service.title} />
                <h3 className="mt-5 mb-2 text-[22px]">{service.title}</h3>
                <p className="m-0 text-muted">{service.description}</p>
                <TagList items={service.tags} />
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}