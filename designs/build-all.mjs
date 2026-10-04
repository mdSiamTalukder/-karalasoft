import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));

const DESIGNS = [
  {
    id: 'b',
    shot: 'preview/b-hero.png',
    tab: 'B',
    name: 'Brand Poster',
    file: 'b-brand-poster.html',
    swatches: ['#00d563', '#0f1113', '#f2f5f7', '#9feec4'],
    blurb: 'Inverted and loud. Full-bleed emerald hero with near-black type, 2px borders and offset shadows throughout. Services become a numbered table, ticker bands divide the sections.',
    chips: ['inverted hero', 'chunky 2px borders', 'offset shadows', 'ticker dividers', 'boldest']
  },
  {
    id: 'c',
    shot: 'preview/c-hero.png',
    tab: 'C',
    name: 'Dark Technical',
    file: 'c-dark-technical-full.html',
    swatches: ['#0c0e10', '#eef1f4', '#10b981', '#cba6f5'],
    blurb: 'Engineer-facing. Near-black canvas, mono // labels, hairline rows instead of cards, and a live deploy-log panel as the hero right half. Adds why-grid, stack, team and testimonial sections.',
    chips: ['dark canvas', 'mono labelling', 'terminal hero', 'hairline rows', 'most technical']
  },
  {
    id: 'd',
    shot: 'preview/d-hero.png',
    tab: 'D',
    name: 'Signal Blue',
    file: 'd-epam-signal.html',
    swatches: ['#0047ff', '#00ffd3', '#08090c', '#8453d2'],
    blurb: "EPAM's system rebuilt with your content. Signal blue, slab-serif headline accent, gradient-border buttons, frequent-search chips, a working dark/light switcher and their signature outlined-numeral infographic.",
    chips: ['EPAM blue', 'slab accent', 'gradient buttons', 'scroll infographic', 'theme switcher']
  },
  {
    id: 'c0',
    shot: 'preview/c-hero.png',
    tab: 'C-alt',
    name: 'Dark Technical · original',
    file: 'c-dark-technical.original.html',
    swatches: ['#0c0e10', '#eef1f4', '#10b981', '#aae8ff'],
    blurb: 'The shorter cut of direction C, kept for reference. Same art direction without the why-grid, stack, team and testimonial blocks.',
    chips: ['dark canvas', 'terminal hero', 'no extra sections', 'lighter weight']
  }
];

const WIDTHS = [
  { key: 'fit', label: 'Fit', w: 0, title: 'Fill the available space' },
  { key: '1440', label: '1440', w: 1440, title: 'Desktop — 1440px' },
  { key: '768', label: '768', w: 768, title: 'Tablet — 768px' },
  { key: '390', label: '390', w: 390, title: 'Mobile — 390px' }
];

const payload = {};
for (const d of DESIGNS) {
  const html = readFileSync(join(here, d.file), 'utf8');
  payload[d.id] = Buffer.from(html, 'utf8').toString('base64');
}

/* ---------- screenshots for the overview gallery ---------- */

const shots = {};
{
  const dir = join(tmpdir(), 'ks-all-thumbs');
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  const extras = ['preview/d-impact.png'];
  const wanted = [...new Set([...DESIGNS.map((d) => d.shot), ...extras])];

  for (const rel of wanted) {
    const src = join(here, rel);
    if (!existsSync(src)) continue;
    const out = join(dir, rel.replace(/[\/.]/g, '_') + '.jpg');
    try {
      execFileSync('sips', ['-Z', '720', '-s', 'format', 'jpeg', '-s', 'formatOptions', '72', src, '--out', out], { stdio: 'ignore' });
      shots[rel] = 'data:image/jpeg;base64,' + readFileSync(out).toString('base64');
    } catch {
      // sips unavailable — fall back to the raw PNG
      shots[rel] = 'data:image/png;base64,' + readFileSync(src).toString('base64');
    }
  }
  rmSync(dir, { recursive: true, force: true });
}

const meta = DESIGNS.map((d) => ({
  id: d.id,
  tab: d.tab,
  name: d.name,
  file: d.file,
  shot: shots[d.shot] || '',
  extraShot: d.id === 'd' ? shots['preview/d-impact.png'] || '' : '',
  swatches: d.swatches,
  blurb: d.blurb,
  chips: d.chips
}));

const shell = `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KaralaSoft — all design directions</title>
  <meta name="description" content="Every KaralaSoft homepage direction in one self-contained file: Brand Poster, Dark Technical, Signal Blue.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700;9..40,900&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink: #0f1113;
      --ink-2: #3f464d;
      --ink-3: #6d7780;
      --line: #e2e6ea;
      --line-2: #eef1f4;
      --bg: #f7f8fa;
      --card: #fff;
      --brand: #10b981;
      --chrome: #0c0e10;
      --chrome-2: #17191c;
      --chrome-line: #26292e;
      --chrome-ink: #e8eaed;
      --chrome-ink-2: #9aa1a9;
      --bar-h: 56px;
      --cap-h: 62px;
      --ease: cubic-bezier(.33, 1, .68, 1);
    }

    *,
    *::before,
    *::after {
      box-sizing: border-box
    }

    html,
    body {
      height: 100%
    }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--ink-2);
      font-family: "DM Sans", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      overflow: hidden
    }

    .mono {
      font-family: "DM Mono", ui-monospace, monospace
    }

    .app {
      display: flex;
      flex-direction: column;
      height: 100dvh
    }

    /* ---------- toolbar ---------- */

    .bar {
      flex: none;
      height: var(--bar-h);
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: 0 .85rem;
      background: var(--chrome);
      border-bottom: 1px solid var(--chrome-line);
      color: var(--chrome-ink);
      -webkit-user-select: none;
      user-select: none
    }

    .brand {
      display: flex;
      align-items: center;
      gap: .55rem;
      font-weight: 700;
      font-size: .9rem;
      letter-spacing: -.02em;
      white-space: nowrap;
      padding-right: .35rem
    }

    .brand i {
      width: .55rem;
      height: .55rem;
      border-radius: 50%;
      background: var(--brand);
      box-shadow: 0 0 0 3px rgb(16 185 129 / .18)
    }

    .brand span {
      color: var(--chrome-ink-2);
      font-weight: 400
    }

    .tabs {
      display: flex;
      gap: .2rem;
      padding: .22rem;
      background: var(--chrome-2);
      border: 1px solid var(--chrome-line);
      border-radius: 999px;
      overflow-x: auto;
      scrollbar-width: none
    }

    .tabs::-webkit-scrollbar {
      display: none
    }

    .tab {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--chrome-ink-2);
      font: inherit;
      font-size: .8rem;
      font-weight: 500;
      padding: .34rem .8rem;
      border-radius: 999px;
      cursor: pointer;
      white-space: nowrap;
      transition: background .2s, color .2s
    }

    .tab:hover {
      color: var(--chrome-ink)
    }

    .tab[aria-selected="true"] {
      background: var(--brand);
      color: #04140d;
      font-weight: 700
    }

    .spacer {
      flex: 1
    }

    .group {
      display: flex;
      align-items: center;
      gap: .25rem
    }

    .seg {
      display: flex;
      gap: .15rem;
      padding: .2rem;
      background: var(--chrome-2);
      border: 1px solid var(--chrome-line);
      border-radius: .6rem
    }

    .seg button {
      appearance: none;
      border: 0;
      background: transparent;
      color: var(--chrome-ink-2);
      font-family: "DM Mono", monospace;
      font-size: .72rem;
      padding: .3rem .55rem;
      border-radius: .4rem;
      cursor: pointer;
      transition: background .2s, color .2s
    }

    .seg button:hover {
      color: var(--chrome-ink);
      background: #22252a
    }

    .seg button[aria-pressed="true"] {
      background: #2c3037;
      color: #fff
    }

    .ico {
      appearance: none;
      border: 1px solid var(--chrome-line);
      background: var(--chrome-2);
      color: var(--chrome-ink-2);
      width: 30px;
      height: 30px;
      display: grid;
      place-items: center;
      border-radius: .5rem;
      cursor: pointer;
      transition: background .2s, color .2s, border-color .2s
    }

    .ico:hover {
      color: #fff;
      border-color: #3a3f47
    }

    .ico[aria-pressed="true"] {
      color: var(--brand);
      border-color: var(--brand)
    }

    .ico svg {
      width: 15px;
      height: 15px
    }

    /* ---------- caption ---------- */

    .caption {
      flex: none;
      display: flex;
      align-items: center;
      gap: 1rem;
      min-height: var(--cap-h);
      padding: .7rem clamp(.9rem, 2.4vw, 1.4rem);
      background: var(--card);
      border-bottom: 1px solid var(--line);
      transition: min-height .3s var(--ease), padding .3s var(--ease), opacity .2s
    }

    .app[data-cap="off"] .caption {
      min-height: 0;
      height: 0;
      padding-block: 0;
      overflow: hidden;
      opacity: 0;
      border-bottom-color: transparent
    }

    .sw {
      display: flex;
      gap: .28rem;
      flex: none
    }

    .sw i {
      width: 1.05rem;
      height: 1.05rem;
      border-radius: 50%;
      border: 1px solid rgb(0 0 0 / .14)
    }

    .cap-title {
      display: flex;
      flex-direction: column;
      gap: .1rem;
      flex: none
    }

    .cap-title b {
      font-size: .95rem;
      color: var(--ink);
      letter-spacing: -.02em;
      line-height: 1.2
    }

    .cap-title small {
      font-family: "DM Mono", monospace;
      font-size: .66rem;
      color: var(--ink-3)
    }

    .cap-text {
      font-size: .8125rem;
      line-height: 1.5;
      color: var(--ink-2);
      max-width: 68ch;
      border-left: 1px solid var(--line);
      padding-left: 1rem
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: .3rem;
      margin-left: auto;
      flex: none
    }

    .chips span {
      font-family: "DM Mono", monospace;
      font-size: .66rem;
      color: var(--ink-3);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: .2rem .55rem;
      white-space: nowrap
    }

    /* ---------- stage ---------- */

    .stage {
      flex: 1;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: stretch;
      overflow: auto;
      background:
        linear-gradient(var(--line-2) 1px, transparent 1px) 0 0 / 100% 24px,
        linear-gradient(90deg, var(--line-2) 1px, transparent 1px) 0 0 / 24px 100%,
        var(--bg);
      scroll-behavior: smooth
    }

    .stage[hidden] {
      display: none
    }

    .frame {
      position: relative;
      flex: none;
      width: 100%;
      background: #fff;
      box-shadow: 0 0 0 1px var(--line), 0 1.5rem 3rem -1.5rem rgb(15 17 19 / .22);
      transition: width .35s var(--ease)
    }

    .frame[hidden] {
      display: none
    }

    .frame iframe {
      display: block;
      width: 100%;
      height: 100%;
      border: 0
    }

    .app[data-scroll="page"] .stage {
      align-items: flex-start;
      padding-bottom: 2rem
    }

    .loading {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      gap: .6rem;
      background: var(--bg);
      font-family: "DM Mono", monospace;
      font-size: .72rem;
      color: var(--ink-3);
      letter-spacing: .06em;
      text-transform: uppercase
    }

    .loading[hidden] {
      display: none
    }

    .loading s {
      display: block;
      width: 34px;
      height: 2px;
      background: var(--line);
      overflow: hidden;
      position: relative
    }

    .loading s::after {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--brand);
      transform: translateX(-100%);
      animation: sweep 1s var(--ease) infinite
    }

    @keyframes sweep {
      to {
        transform: translateX(100%)
      }
    }

    /* ---------- toast ---------- */

    .toast {
      position: fixed;
      left: 50%;
      bottom: 1.4rem;
      transform: translate(-50%, 1rem);
      background: var(--ink);
      color: #fff;
      font-size: .8rem;
      padding: .55rem 1rem;
      border-radius: 999px;
      box-shadow: 0 1rem 2rem -1rem rgb(0 0 0 / .5);
      opacity: 0;
      pointer-events: none;
      transition: opacity .25s, transform .25s var(--ease);
      z-index: 9
    }

    .toast.on {
      opacity: 1;
      transform: translate(-50%, 0)
    }

    @media (max-width: 860px) {
      :root {
        --bar-h: 52px
      }

      .brand span,
      .cap-text {
        display: none
      }

      .chips {
        display: none
      }
    }

    @media (max-width: 720px) {
      .bar {
        gap: .5rem;
        padding: 0 .6rem
      }

      .brand {
        font-size: .82rem;
        padding-right: 0
      }

      #widths {
        display: none
      }

      .tabs {
        flex: 1;
        min-width: 0
      }
    }

    @media (max-width: 460px) {
      .brand {
        font-size: 0
      }

      .brand i {
        width: .6rem;
        height: .6rem
      }
    }

    /* ---------- overview gallery ---------- */

    .gallery {
      flex: 1;
      min-height: 0;
      overflow: auto;
      background: var(--bg);
      padding: clamp(1.25rem, 3vw, 2.25rem) clamp(1rem, 3vw, 2rem) 3rem;
      -webkit-user-select: none;
      user-select: none
    }

    .gallery[hidden] {
      display: none
    }

    .g-head {
      max-width: 1180px;
      margin: 0 auto 1.6rem
    }

    .g-head h1 {
      margin: 0;
      font-size: clamp(1.6rem, 3.4vw, 2.4rem);
      font-weight: 900;
      letter-spacing: -.035em;
      line-height: 1.08;
      color: var(--ink)
    }

    .g-head p {
      margin: .7rem 0 0;
      max-width: 64ch;
      font-size: .9375rem;
      color: var(--ink-2)
    }

    .g-grid {
      max-width: 1180px;
      margin: 0 auto;
      display: grid;
      gap: 1.4rem;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))
    }

    .card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 1.3rem;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      text-align: left;
      padding: 0;
      font: inherit;
      color: inherit;
      transition: transform .3s var(--ease), box-shadow .3s var(--ease), border-color .3s
    }

    .card:hover {
      transform: translateY(-.3rem);
      box-shadow: 0 2rem 4rem -2rem rgb(0 0 0 / 20%);
      border-color: #cfd6dd
    }

    .card:focus-visible {
      outline: 2px solid var(--brand);
      outline-offset: 3px
    }

    .card .shot {
      aspect-ratio: 16/10;
      background: var(--line-2);
      border-bottom: 1px solid var(--line);
      overflow: hidden
    }

    .card .shot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block
    }

    .card .body {
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      gap: .6rem;
      flex: 1
    }

    .card .label {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      font-family: "DM Mono", monospace;
      font-size: .68rem;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--ink-3)
    }

    .card .sw i {
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      border: 1px solid rgb(0 0 0 / .14)
    }

    .card h2 {
      margin: 0;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -.03em;
      color: var(--ink)
    }

    .card p {
      margin: 0;
      font-size: .875rem;
      line-height: 1.55;
      color: var(--ink-2)
    }

    .card .meta {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--line-2);
      display: flex;
      flex-wrap: wrap;
      gap: .35rem
    }

    .card .meta span {
      font-family: "DM Mono", monospace;
      font-size: .66rem;
      color: var(--ink-3);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: .2rem .55rem
    }

    .card .open {
      display: inline-flex;
      align-items: center;
      gap: .45rem;
      margin-top: .9rem;
      font-weight: 700;
      font-size: .85rem;
      color: var(--ink);
      align-self: flex-start
    }

    .card .open::after {
      content: "→";
      transition: transform .25s var(--ease)
    }

    .card:hover .open::after {
      transform: translateX(4px)
    }

    .g-foot {
      max-width: 1180px;
      margin: 1.8rem auto 0;
      padding-top: 1.2rem;
      border-top: 1px solid var(--line);
      font-size: .8125rem;
      color: var(--ink-3);
      display: flex;
      flex-wrap: wrap;
      gap: .6rem 1.4rem
    }

    @media (max-width: 860px) {
      .g-grid {
        grid-template-columns: 1fr
      }
    }

    @media (prefers-reduced-motion: reduce) {

      *,
      *::before,
      *::after {
        animation-duration: .01ms !important;
        transition-duration: .01ms !important
      }
    }
  </style>
</head>

<body>
  <div class="app" id="app" data-cap="on" data-scroll="frame">

    <div class="bar">
      <div class="brand"><i></i>KaralaSoft <span>· design review</span></div>

      <div class="tabs" id="tabs" role="tablist" aria-label="Design directions"></div>

      <div class="spacer"></div>

      <div class="group">
        <div class="seg" id="widths" role="group" aria-label="Viewport width"></div>

        <button class="ico" id="scrollBtn" aria-pressed="false" title="Toggle: scroll inside the frame, or scroll the whole page">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M12 8v4M9.5 10.5 12 8l2.5 2.5M9.5 15.5 12 18l2.5-2.5" />
          </svg>
        </button>

        <button class="ico" id="capBtn" aria-pressed="true" title="Toggle the description bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 10h6M7 14h10" />
          </svg>
        </button>

        <button class="ico" id="dlBtn" title="Download this design as a standalone .html file">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 3v12M7.5 10.5 12 15l4.5-4.5M4 20h16" />
          </svg>
        </button>

        <button class="ico" id="fsBtn" title="Fullscreen (F)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          </svg>
        </button>
      </div>
    </div>

    <div class="caption" id="caption">
      <div class="sw" id="capSw"></div>
      <div class="cap-title">
        <b id="capName"></b>
        <small id="capFile"></small>
      </div>
      <p class="cap-text" id="capText"></p>
      <div class="chips" id="capChips"></div>
    </div>

    <div class="stage" id="stage"></div>

    <div class="gallery" id="gallery" hidden>
      <div class="g-head">
        <h1>Homepage design directions</h1>
        <p>Every KaralaSoft homepage build, in one file. Each one keeps its own typography, palette and layout
          rhythm — click a card to open that direction and read it properly. Keys <b>1</b>–<b>4</b> jump straight to a
          design, <b>0</b> or <b>Esc</b> returns here.</p>
      </div>
      <div class="g-grid" id="gGrid"></div>
      <div class="g-foot">
        <span>KaralaSoft · homepage directions</span>
        <span class="mono">B / C / D / C-alt</span>
        <span class="mono" id="gSize"></span>
      </div>
    </div>
  </div>

  <div class="toast" id="toast"></div>

  <script>
    var DESIGNS = __META__;
    var B64 = __PAYLOAD__;
    var WIDTHS = __WIDTHS__;

    var app = document.getElementById('app');
    var stage = document.getElementById('stage');
    var galleryEl = document.getElementById('gallery');
    var gGrid = document.getElementById('gGrid');
    var tabsEl = document.getElementById('tabs');
    var widthsEl = document.getElementById('widths');
    var toastEl = document.getElementById('toast');

    var frames = {};
    var docs = {};
    var current = null;

    var OVERVIEW = 'overview';

    function decode(b64) {
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder('utf-8').decode(bytes);
    }

    function dataUrl(html) {
      return 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    }

    function toast(msg) {
      toastEl.textContent = msg;
      toastEl.classList.add('on');
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toastEl.classList.remove('on') }, 1800);
    }

    function store(key, val) {
      try { localStorage.setItem('ks-all:' + key, val) } catch (e) { }
    }

    function recall(key) {
      try { return localStorage.getItem('ks-all:' + key) } catch (e) { return null }
    }

    /* ---------- tabs ---------- */

    var ovBtn = document.createElement('button');
    ovBtn.className = 'tab';
    ovBtn.type = 'button';
    ovBtn.setAttribute('role', 'tab');
    ovBtn.textContent = 'Overview';
    ovBtn.title = 'All directions  (0)';
    ovBtn.addEventListener('click', function () { show(OVERVIEW) });
    tabsEl.appendChild(ovBtn);

    DESIGNS.forEach(function (d, i) {
      var b = document.createElement('button');
      b.className = 'tab';
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.textContent = d.tab;
      b.title = d.name + '  (' + (i + 1) + ')';
      b.addEventListener('click', function () { show(d.id) });
      tabsEl.appendChild(b);
      d._el = b;
    });

    /* ---------- overview gallery ---------- */

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    DESIGNS.forEach(function (d) {
      var card = document.createElement('button');
      card.className = 'card';
      card.type = 'button';
      card.innerHTML =
        '<div class="shot">' + (d.shot ? '<img src="' + d.shot + '" alt="' + esc(d.name) + ' preview">' : '') + '</div>' +
        '<div class="body">' +
        '<span class="label">' + esc(d.tab) +
        '<span class="sw">' + d.swatches.map(function (c) { return '<i style="background:' + c + '"></i>' }).join('') + '</span>' +
        '</span>' +
        '<h2>' + esc(d.name) + '</h2>' +
        '<p>' + esc(d.blurb) + '</p>' +
        '<div class="meta">' + d.chips.map(function (c) { return '<span>' + esc(c) + '</span>' }).join('') + '</div>' +
        '<span class="open">Open design ' + esc(d.tab) + '</span>' +
        '</div>';
      card.addEventListener('click', function () { show(d.id) });
      gGrid.appendChild(card);
    });

    /* ---------- width presets ---------- */

    WIDTHS.forEach(function (w) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = w.label;
      b.title = w.title;
      b.addEventListener('click', function () { setWidth(w.key) });
      widthsEl.appendChild(b);
      w._el = b;
    });

    function setWidth(key) {
      WIDTHS.forEach(function (w) {
        w._el.setAttribute('aria-pressed', String(w.key === key));
      });
      var w = WIDTHS.filter(function (x) { return x.key === key })[0] || WIDTHS[0];
      Object.keys(frames).forEach(function (id) {
        frames[id].style.width = w.w ? w.w + 'px' : '100%';
      });
      store('width', key);
    }

    /* ---------- frames ---------- */

    function build(d) {
      var wrap = document.createElement('div');
      wrap.className = 'frame';
      wrap.hidden = true;
      wrap.setAttribute('role', 'tabpanel');

      var load = document.createElement('div');
      load.className = 'loading';
      load.innerHTML = '<div><s></s>loading ' + d.tab + '</div>';

      var ifr = document.createElement('iframe');
      ifr.title = 'KaralaSoft design ' + d.tab + ' — ' + d.name;
      ifr.loading = 'eager';

      wrap.appendChild(load);
      wrap.appendChild(ifr);
      stage.appendChild(wrap);

      frames[d.id] = wrap;
      docs[d.id] = decode(B64[d.id]);

      ifr.addEventListener('load', function () {
        load.hidden = true;
        measure(d.id);
      });

      ifr.srcdoc = docs[d.id];
      return wrap;
    }

    function measure(id) {
      if (app.dataset.scroll !== 'page') return;
      var f = frames[id];
      if (!f || f.hidden) return;
      var doc = f.querySelector('iframe').contentDocument;
      if (!doc) return;
      var h = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
      if (h) f.style.height = h + 1 + 'px';
    }

    function show(id, skipHash) {
      var isOverview = id === OVERVIEW;
      var d = DESIGNS.filter(function (x) { return x.id === id })[0];
      if (!isOverview && !d) id = OVERVIEW, isOverview = true;

      if (isOverview) {
        galleryEl.hidden = false;
        stage.hidden = true;
        app.dataset.cap = 'off';
        document.getElementById('capBtn').setAttribute('aria-pressed', 'false');
        ovBtn.setAttribute('aria-selected', 'true');
        DESIGNS.forEach(function (x) { x._el.setAttribute('aria-selected', 'false') });
        current = OVERVIEW;
        if (!skipHash) history.replaceState(null, '', '#' + OVERVIEW);
        return;
      }

      galleryEl.hidden = true;
      stage.hidden = false;

      if (!frames[id]) build(d);

      Object.keys(frames).forEach(function (k) { frames[k].hidden = k !== id });
      ovBtn.setAttribute('aria-selected', 'false');
      DESIGNS.forEach(function (x) { x._el.setAttribute('aria-selected', String(x.id === id)) });

      document.getElementById('capSw').innerHTML = d.swatches
        .map(function (c) { return '<i style="background:' + c + '"></i>' }).join('');
      document.getElementById('capName').textContent = d.name;
      document.getElementById('capFile').textContent = d.file;
      document.getElementById('capText').textContent = d.blurb;
      document.getElementById('capChips').innerHTML = d.chips
        .map(function (c) { return '<span>' + c + '</span>' }).join('');

      current = id;
      var w = WIDTHS.filter(function (x) { return x.key === (recall('width') || 'fit') })[0] || WIDTHS[0];
      frames[id].style.width = w.w ? w.w + 'px' : '100%';
      stage.scrollTop = 0;
      setTimeout(function () { measure(id) }, 60);

      if (!skipHash) history.replaceState(null, '', '#' + id);
    }

    /* ---------- controls ---------- */

    document.getElementById('capBtn').addEventListener('click', function () {
      var on = app.dataset.cap === 'on';
      app.dataset.cap = on ? 'off' : 'on';
      this.setAttribute('aria-pressed', String(!on));
    });

    document.getElementById('scrollBtn').addEventListener('click', function () {
      var page = app.dataset.scroll !== 'page';
      app.dataset.scroll = page ? 'page' : 'frame';
      this.setAttribute('aria-pressed', String(page));
      if (page) {
        Object.keys(frames).forEach(function (id) {
          frames[id].style.height = 'auto';
          measure(id);
        });
        toast('Scrolling the whole page');
      } else {
        Object.keys(frames).forEach(function (id) { frames[id].style.height = '100%' });
        toast('Scrolling inside the frame');
      }
      store('scroll', app.dataset.scroll);
    });

    document.getElementById('dlBtn').addEventListener('click', function () {
      var d = DESIGNS.filter(function (x) { return x.id === current })[0];
      if (!d) { toast('Pick a design first'); return }
      if (!docs[current]) docs[current] = decode(B64[current]);
      var a = document.createElement('a');
      a.href = dataUrl(docs[current]);
      a.download = d.file;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast('Saved ' + d.file);
    });

    document.getElementById('fsBtn').addEventListener('click', function () {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    });

    window.addEventListener('hashchange', function () {
      var id = (location.hash || '').slice(1);
      if (id && id !== current) show(id, true);
    });

    window.addEventListener('resize', function () {
      clearTimeout(window._rz);
      window._rz = setTimeout(function () { measure(current) }, 200);
    });

    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      var order = [OVERVIEW].concat(DESIGNS.map(function (d) { return d.id }));
      var i = order.indexOf(current);
      if (e.key === '0' || e.key === 'Escape') {
        show(OVERVIEW); e.preventDefault();
      } else if (e.key >= '1' && e.key <= '9') {
        var n = Number(e.key) - 1;
        if (DESIGNS[n]) { show(DESIGNS[n].id); e.preventDefault() }
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        show(order[(i + 1) % order.length]); e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === '[') {
        show(order[(i - 1 + order.length) % order.length]); e.preventDefault();
      } else if (e.key === 'f' || e.key === 'F') {
        document.getElementById('fsBtn').click();
      } else if (e.key === 'c' || e.key === 'C') {
        document.getElementById('capBtn').click();
      } else if (e.key === 'p' || e.key === 'P') {
        document.getElementById('scrollBtn').click();
      }
    });

    /* ---------- boot ---------- */

    setWidth(recall('width') || 'fit');
    var savedScroll = recall('scroll');
    if (savedScroll === 'page') document.getElementById('scrollBtn').click();

    var gSize = document.getElementById('gSize');
    gSize.textContent = DESIGNS.length + ' designs · self-contained';

    var start = (location.hash || '').slice(1);
    if (!start || !DESIGNS.some(function (d) { return d.id === start })) start = OVERVIEW;
    show(start, true);
  </script>
</body>

</html>
`;

const out = shell
  .replace('__META__', JSON.stringify(meta, null, 6))
  .replace('__PAYLOAD__', JSON.stringify(payload))
  .replace('__WIDTHS__', JSON.stringify(WIDTHS, null, 6));

const target = join(here, 'all-designs.html');
writeFileSync(target, out, 'utf8');
console.log('wrote ' + target + '  (' + (out.length / 1024).toFixed(1) + ' KB)');