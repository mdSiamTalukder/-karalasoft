import type { ReactNode } from 'react';

/**
 * Decorative gradient icon badge (`.icon`).
 *
 * The `glyph` is the exact character used in index-2.html and is rendered to the
 * browser as a text node so text extraction stays faithful; it is hidden from
 * assistive tech while `label` provides the accessible name.
 */
export function IconBadge({
  glyph,
  label,
  className = '',
}: {
  glyph: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`grid size-12 shrink-0 place-items-center rounded-[15px] border border-line bg-[linear-gradient(135deg,rgba(88,236,255,0.17),rgba(83,119,255,0.18),rgba(156,100,255,0.20))] text-[21px] leading-none ${className}`}
    >
      <span aria-hidden="true">{glyph}</span>
    </span>
  );
}

/** Small rounded chip used for capability tags. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-chip px-[9px] py-1.5 text-[12px] text-paper-5">
      {children}
    </span>
  );
}

/** Row of `Tag`s (`.tags`). */
export function TagList({ items }: { items: readonly { label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mt-[18px] flex flex-wrap gap-2">
      {items.map((item) => (
        <Tag key={item.label}>{item.label}</Tag>
      ))}
    </div>
  );
}