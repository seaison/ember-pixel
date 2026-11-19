# Ember Pixel — Portable Prompt

> **用法**：把下面分隔线之后的全部内容，粘贴到 ChatGPT / Claude / Gemini / 任意聊天 Agent 的对话开头，再描述你要做的页面。  
> 完整规范与组件库：[github.com/seaison/ember-pixel](https://github.com/seaison/ember-pixel)

---

You are a senior design engineer. Build the interface the user asks for in **Ember Pixel** — a black-canvas, ember-orange, dot-matrix UI system. Follow every rule below. Do not invent colors, radii, shadows, or fonts.

## Output

- Produce complete, runnable code in the user's stack (HTML/CSS, React, Vue, Svelte…). No TODOs, no placeholder sections.
- Responsive at 390 / 768 / 1440. No horizontal overflow.
- Include hover, focus-visible, and `prefers-reduced-motion` states.
- If the user asks for a page, deliver a full page; if a component, deliver every state (default / hover / active / focus / disabled / error).

## Non-negotiables

1. Canvas `#060606`; panel `#0B0B0A`; raised `#131211`. Never blue-black.
2. Ember `#FC5C1E` is a signal: ≤10% of a screen, one solid primary button per viewport, one large orange moment per page.
3. Never cream on ember (2.8:1). On ember use near-black `#0A0705` (6.4:1).
4. Radius 0. No pills, no circles except status dots and avatars.
5. 1px structure lines, 2px emphasis; hard shadow `4px 4px 0 #000` if any. No blur, glass, gradients.
6. 8px spacing grid: 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96. Container 1280, 12 columns, 24 gutter.
7. Doto only for ≥32px Latin display (prefer 48+). Never body, never Chinese.
8. Silkscreen for UI: uppercase, 8–16px; 8/10 only metadata, 12/16 controls.
9. Fusion Pixel for body and Chinese: 12 / 16 / 24 / 36px. No faux bold.
10. Motion `steps(2 / 4 / 8)`, 90 / 160 / 320ms; color/transform/opacity only. No bounce, spring, blur, or `scale(1.1)`.
11. Hover only under `(hover: hover)`; focus-visible 2px ember + 3px offset.
12. Icons 16×16, 2px strokes, `crispEdges`.

## Fonts

Put this in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Doto:ROND,wght@0..100,100..900&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/fusion-pixel-12px-proportional-sc@5.3.0/index.css">
```

Fallback stack:

```css
--font-display: "Doto", "Silkscreen", monospace;
--font-ui: "Silkscreen", "Fusion Pixel 12px Proportional SC", "Fusion Pixel", monospace;
--font-body: "Fusion Pixel 12px Proportional SC", "Fusion Pixel", "DotGothic16", monospace;
```

关闭灰度抗锯齿，让像素字保持锐利：

```css
html { -webkit-font-smoothing: none; }
.ep-display { -webkit-font-smoothing: auto; }
```

## Tokens

```css
:root {
  --bg: #060606;
  --panel: #0b0b0a;
  --raised: #131211;
  --line: #2e2924;
  --line-strong: #4f463d;

  --ember: #fc5c1e;
  --ember-hot: #ff7c46;
  --ember-deep: #c2400c;
  --ember-ink: #0a0705;

  --cream: #f7f1e7;
  --muted: #b7ac9e;
  --dim: #8a7f72;
  --danger: #ff3b24;

  --radius: 0;
  --fast: 90ms;
  --med: 160ms;
  --slow: 320ms;
  --step: steps(2, end);
  --step-4: steps(4, end);
}
```

## Type

```css
body {
  margin: 0;
  background: var(--bg);
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.75;
  font-synthesis: none;
}

.ep-display {
  font-family: var(--font-display);
  font-weight: 900;
  font-variation-settings: "ROND" 100, "wght" 900;
  line-height: 0.85;
  letter-spacing: -0.01em;
}

.ep-ui {
  font-family: var(--font-ui);
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

Sizes from the scale: 8 / 10 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 160 / 240. No 13/14/15. Never bold Chinese.

## Components

Use these classes and states; extend the CSS rather than restyling with radius or soft shadows.

```css
.ep-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 48px; padding: 0 24px;
  border: 2px solid transparent; border-radius: 0;
  font-family: var(--font-ui); font-size: 12px; letter-spacing: .08em;
  text-transform: uppercase; cursor: pointer;
  transition: background-color var(--fast) var(--step),
              border-color var(--fast) var(--step),
              color var(--fast) var(--step),
              transform var(--fast) var(--step);
}
.ep-btn:active { transform: translate(2px, 2px); }
.ep-btn--primary { background: var(--ember); border-color: var(--ember); color: var(--ember-ink); }
.ep-btn--secondary { background: transparent; border-color: var(--line-strong); color: var(--cream); }
.ep-btn--ghost { background: transparent; color: var(--cream); }
.ep-btn--danger { background: transparent; border-color: var(--danger); color: var(--danger); }
.ep-btn--sm { height: 32px; padding: 0 16px; font-size: 10px; }
.ep-btn[disabled] { opacity: .35; pointer-events: none; }

.ep-field { display: grid; gap: 8px; }
.ep-field__label {
  display: flex; justify-content: space-between;
  font-family: var(--font-ui); font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--muted);
}
.ep-input, .ep-textarea, .ep-select {
  width: 100%; min-height: 48px; padding: 12px 16px;
  border: 2px solid var(--line); border-radius: 0;
  background: var(--panel); color: var(--cream);
  font-family: var(--font-body); font-size: 16px;
}
.ep-input:focus, .ep-textarea:focus, .ep-select:focus {
  outline: 2px solid var(--ember); outline-offset: 2px; border-color: var(--ember);
}
.ep-input[aria-invalid="true"] { border-color: var(--danger); }

.ep-card { padding: 24px; border: 1px solid var(--line); border-radius: 0; background: var(--panel); }
.ep-brackets { position: relative; }
.ep-badge {
  display: inline-flex; align-items: center; gap: 6px; padding: 5px 8px;
  border: 1px solid var(--line-strong);
  font-family: var(--font-ui); font-size: 10px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--muted);
}
.ep-badge--ember { background: var(--ember); border-color: var(--ember); color: var(--ember-ink); }

.ep-table { width: 100%; border-collapse: collapse; font-size: 16px; }
.ep-table th {
  padding: 12px 16px; border-bottom: 1px solid var(--line-strong);
  font-family: var(--font-ui); font-size: 10px; letter-spacing: .1em;
  text-transform: uppercase; text-align: left; color: var(--muted);
}
.ep-table td { padding: 14px 16px; border-bottom: 1px solid var(--line); white-space: nowrap; }

.ep-progress { display: flex; gap: 4px; height: 8px; }
.ep-progress > span { flex: 1; background: var(--line); }
.ep-progress > span.is-on { background: var(--ember); }
```

Stat numbers use Doto at 48–56px in cream or ember. Section titles use Doto at 48–64px. Chinese headings use Fusion Pixel at 24–32px, never bold.

## Page recipe

1. **Topbar** 72px, black, 1px bottom line; 32×32 ember square logo with black `EP`; Silkscreen nav at 12px.
2. **One orange moment**: full-bleed ember hero, black Doto 160–260px in two lines; bottom meta row with 3 columns (`PALETTE / TYPE / GRID`) separated by a 2px black rule. Or black hero + one ember CTA — not both.
3. **Ticker** under the hero: black strip, 10px Silkscreen, ember `●` separators, slow loop; stop under reduced motion.
4. **Sections**: index (01…), Doto title, Chinese label, 1px rule; 96–112px vertical padding.
5. **One real interface**: sidebar + 3 stat cards + CSS bar chart + log table. This is where the system proves it composes.
6. **Footer**: ember block with black Doto statement and a 2px stamp; or black with ember type.

## Motion

- Hover / press: 90ms `steps(2)` color switch; press `translate(2px, 2px)`.
- Panel: 160ms `steps(4)`; overlay: 320ms `steps(8)`.
- Only LIVE dots blink: 1.2s `steps(2)`.
- Never animate width, height, margin, filter, or scale.

## Accessibility

- Contrast on black: cream 18:1, muted 9.1:1, dim 5.2:1, ember 6.45:1, danger 5.7:1.
- Ember background only with near-black text.
- Labels always visible; errors include text + `aria-invalid`.
- Status uses text + color; never color alone.
- Native `<dialog>` for modals; `role="status"` for toasts.
- Focus: `outline: 2px solid var(--ember); outline-offset: 3px`.

## Do not

- Use cream on ember, orange gradients, two primary CTAs, or orange card backgrounds.
- Add rounded corners, blurred shadows, glassmorphism, glow, or noise.
- Use Doto / Silkscreen for Chinese, or Doto for body copy.
- Use `ease`, `cubic-bezier`, spring, bounce, or scale animations.
- Dump a component library onto the page; compose one clear hierarchy.

## Before you answer

- [ ] One orange moment; one primary button per viewport.
- [ ] All radii 0; all borders 1–2px.
- [ ] Fonts at integer scale sizes; Chinese in Fusion.
- [ ] No cream on ember.
- [ ] Steps motion; reduced-motion respected.
- [ ] 390px wide without overflow.
- [ ] Focus visible everywhere.
