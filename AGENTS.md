# Ember Pixel — Agent Instructions

> 黑是画布，橙是信号，点阵是骨架。

A **tool-agnostic** UI design system. Use it for dashboards, landing pages, docs, and component work that needs a black canvas, an ember signal, and dot-matrix type. It works in any agent that can read a file or accept a prompt — no DSH-only APIs, no framework lock-in.

## When to use

- The user asks for a black + orange interface, a dark terminal aesthetic, pixel / dot-matrix type, or references Armin Grotesk `#FC5C1E`.
- You need one coherent system for a dark product UI with a strong point of view.
- Not for soft/airy consumer apps, light backgrounds, or long-form reading products.

## Read order

1. `SKILL.md` — canonical rules, components, page recipes, QA.
2. `assets/ember.css` — tokens + component library. Copy it; don't fork it.
3. `assets/styleguide.html` — visual reference. Open it in a browser.
4. `assets/fonts/` — Doto / Silkscreen / Fusion Pixel, all OFL.

If you can only read this file, it is enough to start. Do not invent colors, radii, shadows, or fonts.

## Non-negotiables

1. **Canvas** `#060606`; panel `#0B0B0A`; raised `#131211`. Never blue-black.
2. **Ember** `#FC5C1E` is a signal: ≤10% of a screen, one solid primary button per viewport, one large orange moment per product page.
3. **Never cream on ember** (2.8:1). On ember use near-black `#0A0705` (6.4:1).
4. **Radius 0.** No pills, no circles except status dots and avatars.
5. **1px structure, 2px emphasis.** Hard shadow `4px 4px 0` if any. No blur, glass, gradients.
6. **8px spacing grid.** 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96. Container 1280, 12 columns, 24 gutter.
7. **Doto** only for ≥32px Latin display (prefer 48+). Never body, never Chinese.
8. **Silkscreen** for UI: uppercase, 8–16px; 8/10 only metadata, 12/16 controls.
9. **Fusion Pixel** for body and Chinese: 12 / 16 / 24 / 36px. No faux bold, no synthetic weights.
10. **Motion** `steps(2 / 4 / 8)`, 90 / 160 / 320ms, color/transform/opacity only. No bounce, spring, blur, or `scale(1.1)`.
11. **Hover** only under `(hover: hover)`; focus-visible 2px ember with 3px offset; respect `prefers-reduced-motion`.
12. **Icons** 16×16, 2px strokes, `shape-rendering: crispEdges`.

## Tokens

```css
:root {
  --ep-bg: #060606;
  --ep-panel: #0b0b0a;
  --ep-raised: #131211;
  --ep-line: #2e2924;
  --ep-line-strong: #4f463d;

  --ep-ember: #fc5c1e;
  --ep-ember-hot: #ff7c46;
  --ep-ember-deep: #c2400c;
  --ep-ember-ink: #0a0705;

  --ep-cream: #f7f1e7;
  --ep-muted: #b7ac9e;
  --ep-dim: #8a7f72;
  --ep-danger: #ff3b24;

  --ep-font-display: "Doto", "Silkscreen", monospace;
  --ep-font-ui: "Silkscreen", "Fusion Pixel", monospace;
  --ep-font-body: "Fusion Pixel", "DotGothic16", monospace;

  --ep-radius: 0;
  --ep-container: 1280px;

  --ep-t-fast: 90ms;
  --ep-t-med: 160ms;
  --ep-t-slow: 320ms;
  --ep-ease-step: steps(2, end);
  --ep-ease-step-4: steps(4, end);
}
```

## Type

```css
.ep-display {
  font-family: var(--ep-font-display);
  font-weight: 900;
  font-variation-settings: "ROND" 100, "wght" 900;
  line-height: 0.85;
  letter-spacing: -0.01em;
}
.ep-ui {
  font-family: var(--ep-font-ui);
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

Sizes come from the scale: 8 / 10 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 160 / 240. No 13/14/15.

## Components

Use the classes in `assets/ember.css`; do not re-style them with radius or soft shadows. If `assets/` is unavailable, implement the classes from the tokens above (48px height, 2px border, 0 radius, 8px gaps) — or use the starter CSS in `prompt.md`.

- `.ep-btn` + `--primary / --secondary / --ghost / --danger`, sizes `--sm / --lg`
- `.ep-field`, `.ep-input`, `.ep-select`, `.ep-textarea`, `.ep-check`, `.ep-radio`, `.ep-switch`
- `.ep-card`, `.ep-brackets`, `.ep-badge`, `.ep-table-wrap`, `.ep-table`, `.ep-progress`
- `.ep-tabs`, `.ep-tab`, `.ep-tabpanel`, `.ep-toast`, `.ep-dialog`, `.ep-empty`, `.ep-avatar`

```html
<button class="ep-btn ep-btn--primary">Deploy</button>

<div class="ep-field">
  <label class="ep-field__label" for="callsign">Callsign <span>Required</span></label>
  <input class="ep-input" id="callsign" type="text" value="NOVA-07">
  <span class="ep-field__hint">4–12 个字符。</span>
</div>

<article class="ep-card ep-brackets">
  <div class="ep-card__label"><span>Node 07</span><span>Live</span></div>
  <div class="ep-stat__value">98.4<span>%</span></div>
</article>
```

## Page recipe

1. **Topbar** 72px, black, 1px bottom line, 32px ember logo mark, Silkscreen nav.
2. **One orange moment**: a full-bleed ember hero with black Doto 160–260px, or a black hero with one ember CTA. Only one per product page.
3. **Ticker** (optional): black, ember separators, 10px Silkscreen, slow linear loop; stop under reduced motion.
4. **Sections**: index + Doto title + Chinese label + 1px rule; 96–112px vertical rhythm.
5. **One real interface**: sidebar + 3 stats + chart + log table, to prove composition.
6. **Footer**: ember block with black Doto statement and a 2px stamp; or black with ember type.

## Motion

```css
transition:
  background-color 90ms steps(2, end),
  border-color 90ms steps(2, end),
  color 90ms steps(2, end),
  transform 90ms steps(2, end);
```

Press feedback is `translate(2px, 2px)`. Panel transitions use `steps(4)`, overlays `steps(8)`. Only LIVE dots blink (1.2s, `steps(2)`).

## Accessibility

- Text contrast on black: cream 18:1, muted 9.1:1, dim 5.2:1, ember 6.45:1, danger 5.7:1.
- Ember background only with near-black text.
- Targets ≥24×24 (WCAG AA), primary controls 44–48px.
- Labels always visible; errors include text + `aria-invalid`.
- Status uses text + color, never color alone.
- Native `<dialog>` for modals; `role="status"` for toasts.

## Output contract

- Write production-ready code in the user's stack; complete files, no TODOs.
- Use the tokens; no unlisted colors.
- Responsive at 390 / 768 / 1440; no horizontal overflow.
- Include hover, focus-visible, and reduced-motion states.
- If the repo assets are unavailable, inline the tokens and load fonts from Google Fonts + Fontsource.

## Do not

- Use cream on ember, orange gradients, or two or more primary CTAs.
- Add rounded corners, blurred shadows, glassmorphism, or glows.
- Use Doto / Silkscreen for Chinese, or Doto for body copy.
- Use `ease`, `cubic-bezier`, spring, bounce, or scale animations.
- Use color alone to communicate status.

## Repo map

```
SKILL.md               canonical skill
AGENTS.md              this file
prompt.md              standalone prompt for chat-only agents
assets/ember.css       tokens + components
assets/styleguide.html visual reference
assets/fonts/          OFL fonts
docs/                  README preview images
```
