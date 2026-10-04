/**
 * The hero globe (`.globe`) with its dashed orbit ring (`.orbit`).
 *
 * Structure note: in index-2.html the markup is
 *   `<div class="visual-wrap"><div class="globe"><div class="orbit"></div></div>`
 * so `.orbit { inset: 6% }` resolves against the 430px sphere, not the visual
 * column — the ring hugs the globe and only spills a few pixels past it.
 *
 * `float` animates the sphere and `spin` animates the ring; because they are
 * separate elements the transforms do not conflict. Both are pure CSS, so this
 * is a server component with zero client JavaScript.
 */
export function Globe() {
  return (
    <div
      aria-hidden="true"
      className="absolute top-[9%] right-[4%] size-[300px] min-[620px]:size-[350px] min-[920px]:size-[430px] max-[619px]:right-[5%]"
    >
      <div className="relative size-full rounded-full border border-white/[0.14] bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.35),transparent_10%),radial-gradient(circle_at_40%_40%,rgba(88,236,255,0.22),transparent_28%),radial-gradient(circle_at_65%_60%,rgba(156,100,255,0.22),transparent_30%),linear-gradient(145deg,#0d1c31,#07111d)] shadow-[inset_-40px_-40px_90px_rgba(0,0,0,0.35),0_30px_100px_rgba(51,94,188,0.18)] [animation:float_7s_ease-in-out_infinite]">
        {/* meridian rings — `.globe::before` / `.globe::after` */}
        <span
          className="absolute rounded-full border border-cyan/[0.18]"
          style={{ inset: '12%', transform: 'rotate(30deg)' }}
        />
        <span
          className="absolute rounded-full border border-violet/20"
          style={{ inset: '26% 10%', transform: 'rotate(-40deg)' }}
        />

        {/* dashed orbit with a glowing satellite */}
        <div className="absolute inset-[6%] rounded-full border border-dashed border-white/10 [animation:spin_18s_linear_infinite]">
          <span className="absolute top-[8%] left-[12%] size-3.5 rounded-full bg-cyan shadow-[0_0_22px_var(--color-cyan)]" />
        </div>
      </div>
    </div>
  );
}