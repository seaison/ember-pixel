# Contributing

Ember Pixel is a small design system, not a framework. Keep changes sharp and consistent.

## Source of truth

`SKILL.md` is canonical. `AGENTS.md` and `prompt.md` are adapters for agents that read different files. If you change a token, font rule, or non-negotiable, update all three.

## Before you open a PR

```bash
npm run check
python scripts/check-subset.py
```

If you changed text in `assets/styleguide.html`, rebuild the web subset:

```bash
pip install fonttools brotli
python scripts/build-subset.py
```

## Design rules

- Radius 0; 1px structure, 2px emphasis; no blur or gradients.
- Ember `#FC5C1E` is a signal; never cream on ember.
- Doto only for ≥32px Latin display; Chinese uses Fusion Pixel.
- Motion uses `steps()`, never easing curves or scale.
- New components must include hover, focus-visible, disabled, and reduced-motion states.

## License

By contributing you agree that code and documentation are released under the MIT License. Fonts remain under the SIL Open Font License 1.1.
