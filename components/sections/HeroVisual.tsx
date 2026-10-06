import { Globe } from '@/components/sections/Globe';
import { RotatingWord } from '@/components/motion/RotatingWord';
import { Check } from 'lucide-react';

/**
 * A small solid status dot — reads as "live system signal" rather than a metric.
 * Purely decorative; the label beside it carries the meaning.
 */
function StatusDot({ tone }: { tone: 'lime' | 'cyan' | 'violet' }) {
  const colour = {
    lime: 'bg-lime shadow-[0_0_14px_var(--color-lime)]',
    cyan: 'bg-cyan shadow-[0_0_14px_var(--color-cyan)]',
    violet: 'bg-violet shadow-[0_0_14px_var(--color-violet)]',
  }[tone];

  return (
    <span
      aria-hidden="true"
      className={`inline-block size-1.5 shrink-0 rounded-full ${colour} [animation:pulseDot_2.4s_ease-in-out_infinite]`}
    />
  );
}

function FloatingCard({
  position,
  className = '',
  tiny,
  tone,
  children,
}: {
  position: string;
  className?: string;
  tiny: string;
  tone?: 'lime' | 'cyan' | 'violet';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute min-w-[210px] rounded-[22px] border border-line bg-surface-2/80 p-4 shadow-premium backdrop-blur-[18px] max-sm:min-w-[168px] max-sm:p-3.5 ${position} ${className}`}
    >
      <div className="mb-2.5 flex items-center gap-2 text-[11px] tracking-[0.12em] text-muted uppercase">
        {tone ? <StatusDot tone={tone} /> : null}
        {tiny}
      </div>
      {children}
    </div>
  );
}

/** Right-hand hero visual: animated globe + three floating glass cards. */
export function HeroVisual() {
  return (
    <div className="relative min-h-[500px] min-[920px]:min-h-[570px]">
      <Globe />

      {/* `.fc1` — float2 6s */}
      <FloatingCard
        tiny="Build Status"
        tone="lime"
        position="left-0 top-[10%] [animation:float2_6s_ease-in-out_infinite]"
      >
        <strong className="mb-1.5 block text-[20px]">Shipping faster</strong>
        <p className="code-box m-0">
          <span className="text-cyan">●</span> Product sprint live
          <br />↳ Design + Engineering
        </p>
        <ul className="m-0 mt-3 grid list-none gap-1.5 border-t border-line pt-3 p-0">
          {['Design review', 'API contract', 'Release train'].map((step) => (
            <li key={step} className="flex items-center gap-2 text-[13px] text-paper-3">
              <Check aria-hidden="true" className="size-3.5 shrink-0 text-lime" strokeWidth={2.4} />
              {step}
            </li>
          ))}
        </ul>
      </FloatingCard>

      {/* `.fc2` — float2 7s reverse */}
      <FloatingCard
        tiny="What We Build"
        tone="cyan"
        position="right-0 bottom-[10%] [animation:float2_7s_ease-in-out_infinite_reverse]"
      >
        <RotatingWord />
        <p className="code-box m-0">Web • Mobile • AI • API</p>
      </FloatingCard>

      {/* `.fc3` — hidden below 620px, exactly as in the source CSS */}
      <FloatingCard
        tiny="System Signal"
        tone="violet"
        position="left-[8%] bottom-[2%] max-sm:hidden [animation:float2_8s_ease-in-out_infinite]"
      >
        <strong className="mb-1.5 block text-[20px]">99.9% ready</strong>
        <p className="code-box m-0">
          deploy() → <span className="text-cyan">success</span>
        </p>
        {/* Uptime bars — static, no continuous animation. */}
        <div aria-hidden="true" className="mt-3 flex items-end gap-1 border-t border-line pt-3">
          {[70, 92, 58, 100, 84, 96, 66].map((height, index) => (
            <span
              key={index}
              className="w-1.5 rounded-full bg-[linear-gradient(180deg,var(--color-cyan),var(--color-blue))]"
              style={{ height: `${Math.round(height * 0.22)}px` }}
            />
          ))}
        </div>
      </FloatingCard>
    </div>
  );
}