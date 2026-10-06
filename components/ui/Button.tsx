import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'default' | 'primary' | 'ghost';

/**
 * Faithful recreation of `.btn` from index-2.html — a single size, used for every
 * button and link-button on the site:
 *   1px hairline · 14px/20px padding · 14px radius · 10px gap · 16px label
 */
const BASE =
  'group/btn relative inline-flex shrink-0 items-center justify-center gap-2.5 overflow-hidden ' +
  'rounded-[14px] border border-line px-5 py-3.5 text-[16px] leading-normal text-on-surface ' +
  'transition duration-300 ease-out ' +
  'hover:-translate-y-0.5 hover:bg-veil/[0.07] active:translate-y-0 ' +
  'disabled:pointer-events-none disabled:opacity-60';

const VARIANTS: Record<Variant, string> = {
  default: 'bg-veil/[0.035]',
  primary:
    'border-0 bg-[linear-gradient(135deg,var(--color-cyan),var(--color-blue)_50%,var(--color-violet))] ' +
    'font-[850] text-on-accent shadow-[0_18px_55px_rgba(83,119,255,0.30)]',
  ghost: 'border-cyan/20 bg-veil/[0.035]',
};

/**
 * Sheen sweep on hover — the recreation of `.btn::before` from index-2.html.
 * Rendered as a real element so the transition is transform-only (GPU friendly).
 */
function Sheen() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-[550ms] ease-out group-hover/btn:translate-x-[120%]"
    />
  );
}

export function buttonClass({
  variant = 'default',
  className = '',
}: { variant?: Variant; className?: string } = {}): string {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

function Content({ children }: { children: ReactNode }) {
  return (
    <>
      <Sheen />
      <span className="relative inline-flex items-center gap-2.5">{children}</span>
    </>
  );
}

export interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: Variant;
}

export function ButtonLink({ href, variant = 'default', className = '', children, ...rest }: ButtonLinkProps) {
  const classes = buttonClass({ variant, className });

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes} {...rest}>
        <Content>{children}</Content>
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      <Content>{children}</Content>
    </a>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = 'default',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass({ variant, className })} {...rest}>
      <Content>{children}</Content>
    </button>
  );
}