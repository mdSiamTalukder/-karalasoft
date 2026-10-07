import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/motion/Reveal';
import { Section } from '@/components/ui/Section';
import { SectionHead } from '@/components/ui/SectionHead';
import { contactChannels } from '@/lib/about';
import { CONTACT_DIRECT } from '@/lib/contact-page';
import type { ContactChannel } from '@/lib/types';

/**
 * ------------------------------------------------------------------------------------
 * Direct contact
 * ------------------------------------------------------------------------------------
 * Presents the EXISTING `contactChannels` from `lib/about.ts` — no address, number or
 * location is written here. Email and phone keep the exact `href` values already published
 * (`mailto:` / `tel:`), so nothing about the contact details changes; only the presentation
 * does, adding a type-appropriate icon and a clearer affordance.
 */

/**
 * Icon chosen from the channel's existing `eyebrow`, not from new data.
 *
 * Returns the component itself rather than an element, so the icon is created at module
 * scope instead of during render.
 */
function channelIcon(eyebrow: string): LucideIcon {
  switch (eyebrow.toUpperCase()) {
    case 'EMAIL':
      return Mail;
    case 'PHONE':
      return Phone;
    default:
      return MapPin;
  }
}

function ChannelCard({ channel, index }: { channel: ContactChannel; index: number }) {
  const Icon = channelIcon(channel.eyebrow) as LucideIcon;
  const isActionable = Boolean(channel.href);

  return (
    <Reveal as="li" delay={(index % 3) * 0.08} className="h-full">
      <div className="group/chan relative flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-[linear-gradient(180deg,var(--t-glass-top),var(--t-glass-bottom))] p-6 backdrop-blur-[18px] transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1.5 hover:border-cyan/30 sm:p-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[70px] -right-[70px] size-[150px] rounded-full bg-[radial-gradient(circle,rgba(88,236,255,0.13),transparent_70%)] transition-transform duration-300 ease-out group-hover/chan:scale-140"
        />

        <div className="relative flex items-start justify-between gap-4">
          <Eyebrow>{channel.eyebrow}</Eyebrow>
          <span className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))]">
            <Icon aria-hidden="true" className="size-[19px] text-cyan" strokeWidth={1.7} />
          </span>
        </div>

        <h3 className="relative mt-5 mb-2 text-[22px] leading-snug tracking-[-0.02em] break-words">
          {/*
            Only channels that already carried an `href` become links. The `DELIVERY`
            channel has none, so it stays plain text rather than gaining an invented
            destination.
          */}
          {isActionable ? (
            <a
              href={channel.href}
              className="rounded-md transition-colors duration-300 hover:text-cyan focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
            >
              {channel.title}
            </a>
          ) : (
            channel.title
          )}
        </h3>

        <p className="relative m-0 text-[15px] text-muted">{channel.description}</p>

        {isActionable ? (
          <span className="relative mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan/80">
            {channel.eyebrow.toUpperCase() === 'EMAIL' ? 'Compose email' : 'Call'}
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-300 group-hover/chan:translate-x-0.5 group-hover/chan:-translate-y-0.5"
            />
          </span>
        ) : null}
      </div>
    </Reveal>
  );
}

export function ContactDirect() {
  return (
    <Section alt labelledBy="contact-direct-heading">
      <Container>
        <SectionHead
          id="contact-direct-heading"
          eyebrow={CONTACT_DIRECT.eyebrow}
          title={CONTACT_DIRECT.title}
          description={CONTACT_DIRECT.description}
        />

        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[18px]">
          {contactChannels.map((channel, index) => (
            <ChannelCard key={channel.eyebrow} channel={channel} index={index} />
          ))}
        </ul>
      </Container>
    </Section>
  );
}