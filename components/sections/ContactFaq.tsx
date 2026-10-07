import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { CONTACT_FAQ } from '@/lib/contact-page';

/**
 * ------------------------------------------------------------------------------------
 * FAQ
 * ------------------------------------------------------------------------------------
 * Four questions, each answerable from material that already exists in the repository —
 * the service catalogue in `lib/services.ts` (`SERVICE_GROUPS`) and the documented
 * engagement process.
 *
 * No pricing, no timelines, no guarantees, no policies: there is nothing in the project to
 * support them, so they are not written. Every service named in the first answer is a real
 * `SERVICE_GROUPS` title.
 *
 * Rendered as a plain definition list — native `<details>` disclosure was deliberately not
 * used, because it hides answers behind a click and reads poorly at large desktop widths
 * where the extra room suits a side-by-side layout.
 */
export function ContactFaq() {
  return (
    <Section labelledBy="contact-faq-heading">
      <Container>
        <SectionHead
          id="contact-faq-heading"
          eyebrow={CONTACT_FAQ.eyebrow}
          title={CONTACT_FAQ.title}
        />

        <dl className="m-0 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-2 lg:gap-[18px]">
          {CONTACT_FAQ.items.map((item, index) => (
            <Reveal key={item.question} delay={(index % 2) * 0.08} className="h-full">
              <div className="group/faq relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-cyan/30 sm:p-7">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.13),transparent_70%)] transition-transform duration-300 ease-out group-hover/faq:scale-140"
                />

                <dt className="relative flex items-start gap-3">
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[9px] border border-line bg-cyan/[0.09] text-[12px] font-bold text-cyan tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="m-0 text-[19px] leading-snug tracking-[-0.01em] text-balance">
                    {item.question}
                  </h3>
                </dt>

                <dd className="relative mt-3.5 mb-0 pl-10 text-[15px] leading-relaxed text-muted">
                  {item.answer}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </Section>
  );
}