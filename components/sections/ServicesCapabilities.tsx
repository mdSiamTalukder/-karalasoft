import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { serviceIcon } from '@/lib/services';
import { SERVICE_GROUPS, UNCATEGORISED_GROUP } from '@/lib/services';
import type { Service, ServiceGroup } from '@/lib/services';

/**
 * ------------------------------------------------------------------------------------
 * Engineering capabilities — `/services` only.
 * ------------------------------------------------------------------------------------
 * The twelve published services grouped into four engineering categories.
 *
 * Grouping is driven by `SERVICE_GROUPS` in `lib/services.ts`, which references service
 * *titles* rather than inventing new services. Each title is resolved against the fetched
 * CMS records here, so a renamed or removed service cannot produce an empty category, and
 * anything the groups do not mention is surfaced under a catch-all group rather than
 * silently disappearing.
 */
function resolveGroups(services: readonly Service[]): { group: ServiceGroup; items: Service[] }[] {
  const byTitle = new Map(services.map((service) => [service.title, service]));
  const used = new Set<string>();

  const resolved = SERVICE_GROUPS.map((group) => {
    const items = group.titles
      .map((title) => byTitle.get(title))
      .filter((service): service is Service => {
        if (!service) return false;
        used.add(service.title);
        return true;
      });
    return { group, items };
  }).filter((entry) => entry.items.length > 0);

  // Anything the CMS has published that the groups do not name.
  const remainder = services.filter((service) => !used.has(service.title));
  if (remainder.length > 0) {
    resolved.push({ group: UNCATEGORISED_GROUP, items: remainder });
  }

  return resolved;
}

export function ServicesCapabilities({ services }: { services: readonly Service[] }) {
  const groups = resolveGroups(services);

  return (
    <Section labelledBy="services-capabilities-heading">
      <Container>
        <SectionHead
          id="services-capabilities-heading"
          eyebrow="CAPABILITIES"
          title={
            <>
              Twelve practices.
              <br />
              Four disciplines.
            </>
          }
          description="The catalogue below is published from the same service record our team works from — grouped so you can see where we fit your roadmap."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-[18px]">
          {groups.map((entry, index) => {
            const Icon = serviceIcon(entry.group.iconKey);
            return (
              <Reveal key={entry.group.key} delay={(index % 2) * 0.07} className="h-full">
                <div className="group/cap relative h-full overflow-hidden rounded-[26px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-5 transition-[border-color] duration-300 hover:border-cyan/25 sm:p-7">
                  {/* Single soft corner accent — deliberately not a continuous glow. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-[80px] -right-[80px] size-[170px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.10),transparent_70%)] transition-transform duration-300 ease-out group-hover/cap:scale-140"
                  />

                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden="true"
                      className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-white/10 bg-[linear-gradient(135deg,rgba(88,236,255,0.16),rgba(83,119,255,0.17),rgba(156,100,255,0.18))] text-cyan"
                    >
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="m-0 text-[19px] leading-tight">{entry.group.label}</h3>
                      <p className="mt-1.5 mb-0 text-[14px] leading-[1.55] text-muted">
                        {entry.group.summary}
                      </p>
                    </div>
                  </div>

                  <ul className="m-0 mt-5 grid list-none gap-2 border-t border-line pt-4 p-0 sm:grid-cols-2">
                    {entry.items.map((service) => {
                      const ItemIcon = serviceIcon(service.iconKey);
                      return (
                        <li key={service.id} className="flex items-center gap-2.5">
                          <ItemIcon
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-soft"
                            strokeWidth={1.6}
                          />
                          <span className="min-w-0 text-[15px] text-paper-2">{service.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}