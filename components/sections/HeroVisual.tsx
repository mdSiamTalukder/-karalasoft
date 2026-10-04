import { Globe } from '@/components/sections/Globe';
import { RotatingWord } from '@/components/motion/RotatingWord';

function FloatingCard({
  position,
  className,
  tiny,
  children,
}: {
  position: string;
  className?: string;
  tiny: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`absolute min-w-[210px] rounded-[22px] border border-line bg-[rgba(8,17,30,0.78)] p-4 shadow-premium backdrop-blur-[18px] max-sm:min-w-[168px] max-sm:p-3.5 ${position} ${className ?? ''}`}
    >
      <div className="text-[11px] tracking-[0.12em] text-muted uppercase">{tiny}</div>
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
        position="left-0 top-[10%] [animation:float2_6s_ease-in-out_infinite]"
      >
        <strong className="my-1.5 block text-[20px]">Shipping faster</strong>
        <p className="code-box m-0">
          <span className="text-cyan">●</span> Product sprint live
          <br />↳ Design + Engineering
        </p>
      </FloatingCard>

      {/* `.fc2` — float2 7s reverse */}
      <FloatingCard
        tiny="What We Build"
        position="right-0 bottom-[10%] [animation:float2_7s_ease-in-out_infinite_reverse]"
      >
        <RotatingWord />
        <p className="code-box m-0">Web • Mobile • AI • API</p>
      </FloatingCard>

      {/* `.fc3` — hidden below 620px, exactly as in the source CSS */}
      <FloatingCard
        tiny="System Signal"
        position="left-[8%] bottom-[2%] max-sm:hidden [animation:float2_8s_ease-in-out_infinite]"
      >
        <strong className="my-1.5 block text-[20px]">99.9% ready</strong>
        <p className="code-box m-0">
          deploy() → <span className="text-cyan">success</span>
        </p>
      </FloatingCard>
    </div>
  );
}