import { marqueeLabels } from '@/lib/content';

const ITEMS = marqueeLabels.flatMap((item) => [item.label, '•'] as const);

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <>
      {ITEMS.map((label, index) => (
        <span
          key={`${label}-${index}`}
          aria-hidden={hidden ? 'true' : undefined}
          className="text-[13px] whitespace-nowrap tracking-[0.14em] text-paper uppercase"
        >
          {label}
        </span>
      ))}
    </>
  );
}

/**
 * Infinite capability ticker (`.marquee`).
 * The label list is duplicated and translated -50%, so the loop is seamless.
 * The duplicated set is hidden from assistive tech to avoid double announcements.
 */
export function Marquee() {
  return (
    <div
      className="overflow-hidden border-y border-line bg-veil/[0.02] py-[15px]"
      role="marquee"
      aria-label="Capabilities"
    >
      <div className="flex w-max gap-[34px] [animation:marquee_24s_linear_infinite] motion-reduce:animate-none">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}