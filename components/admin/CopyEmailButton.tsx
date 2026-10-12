'use client';

import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';

/**
 * Copy-to-clipboard button for a sender's email address.
 *
 * Uses the browser's async Clipboard API, so no dependency is added. Falls back to a
 * hidden textarea + `execCommand` when the async API is unavailable (older browsers, or a
 * non-secure origin), and reports honestly if both paths fail — it never claims a copy
 * succeeded when it did not.
 */
export function CopyEmailButton({ value, label = 'Copy email' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  // Clear the transient confirmation so the row does not stay in a "Copied" state forever.
  useEffect(() => {
    if (!copied && !failed) return undefined;
    const timer = setTimeout(() => {
      setCopied(false);
      setFailed(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copied, failed]);

  async function copy() {
    setFailed(false);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        return;
      }

      const area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);

      if (ok) setCopied(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email copied' : failed ? 'Copy failed' : label}
      className="inline-grid size-7 shrink-0 place-items-center rounded-[8px] border border-white/12 bg-white/[0.05] text-muted transition-colors duration-200 hover:border-cyan/40 hover:bg-cyan/[0.10] hover:text-cyan focus-visible:outline-none focus-visible:border-cyan/50"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-3.5 text-lime" />
      ) : (
        <Copy aria-hidden="true" className={`size-3.5 ${failed ? 'text-pink' : ''}`} />
      )}
      {/* Announced to screen readers without showing the transient state visually. */}
      <span aria-live="polite" className="sr-only">
        {copied ? 'Email copied to clipboard' : failed ? 'Could not copy email' : ''}
      </span>
    </button>
  );
}