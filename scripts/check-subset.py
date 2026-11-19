#!/usr/bin/env python3
"""Verify the hosted styleguide's font subset covers every glyph it can render."""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "assets/styleguide.html"
FULL = ROOT / "assets/fonts/FusionPixel-12px-SC.woff2"
SUBSET = ROOT / "assets/fonts/FusionPixel-12px-SC-web.woff2"

try:
    from fontTools.ttLib import TTFont
except ImportError:
    print("fonttools is required: pip install fonttools brotli", file=sys.stderr)
    sys.exit(2)

text = HTML.read_text(encoding="utf-8")
required = {ord(ch) for ch in text if ord(ch) >= 32 and not ch.isspace()}

full_cmap = set(TTFont(FULL).getBestCmap())
subset_cmap = set(TTFont(SUBSET).getBestCmap())

renderable = required & full_cmap
unsupported = required - full_cmap
missing = sorted(renderable - subset_cmap)

if unsupported:
    print(f"note: {len(unsupported)} character(s) are not in the full Fusion font and will fall back")

if missing:
    print("font subset is missing:", "".join(chr(code) for code in missing), file=sys.stderr)
    print(f"{len(missing)} missing glyph(s). Rebuild with: python scripts/build-subset.py", file=sys.stderr)
    sys.exit(1)

print(f"font subset OK: {len(subset_cmap)} glyphs, {len(renderable)} page characters covered")
