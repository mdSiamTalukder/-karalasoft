import type { ReactNode } from 'react';

/**
 * Small shared primitives for the Admin Panel.
 * Deliberately local to `components/admin` so the public website is untouched.
 */

export function AdminCard({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'form';
}) {
  // `glass` is the existing design-system surface (border + gradient + blur), so the panel
  // matches the rest of the site without introducing new tokens.
  return <Tag className={`glass rounded-[22px] ${className}`}>{children}</Tag>;
}

export function AdminField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-semibold text-paper-3">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-cyan">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[13px] text-pink">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[13px] text-muted-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export const adminInputClass =
  'w-full rounded-[14px] border border-white/10 bg-[#081522] px-4 py-3 text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-soft/70 focus:border-cyan/40 focus:shadow-[0_0_0_4px_rgba(88,236,255,0.06)]';

export function AdminStatus({
  tone,
  children,
}: {
  tone: 'ok' | 'error';
  children: ReactNode;
}) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-[14px] border px-4 py-3 text-[15px] ${
        tone === 'ok'
          ? 'border-lime/30 bg-lime/[0.07] text-lime'
          : 'border-pink/35 bg-pink/[0.08] text-pink'
      }`}
    >
      {children}
    </p>
  );
}