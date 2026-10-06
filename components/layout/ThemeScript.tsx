/**
 * ------------------------------------------------------------------------------------
 * Theme bootstrap script.
 * ------------------------------------------------------------------------------------
 * Rendered as the first element inside <body> so it executes synchronously, BEFORE the
 * browser paints the page. That is what prevents a flash of the wrong theme on refresh:
 * the stored preference is applied to <html> before any content is visible.
 *
 * Kept deliberately tiny and dependency-free — it must never throw, and it is wrapped in
 * try/catch so a storage error cannot break rendering.
 *
 * The markup it produces matches what React renders on the server (`data-theme="dark"`
 * is also hard-coded on <html>), so hydration sees identical attributes.
 */
export function ThemeScript() {
  const script = `(function(){try{var k='karala-theme',a='data-theme',t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t='dark';}var e=document.documentElement;if(e.getAttribute(a)!==t){e.setAttribute(a,t);}}catch(_){}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}