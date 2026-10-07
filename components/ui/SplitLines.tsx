/**
 * Renders a newline-delimited string as separate lines separated by `<br />`.
 *
 * `lib/` is data-only `.ts` across this codebase, so section titles are stored as plain
 * strings like `'Global delivery,\\npersonal partnership.'` rather than JSX. This keeps that
 * convention without forcing every heading onto a single line.
 */
export function SplitLines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, index) => (
        <span key={`${index}-${line}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}