#!/usr/bin/env python3
"""Rebuild the 19KB web subset used by assets/styleguide.html."""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML = ROOT / "assets/styleguide.html"
FULL = ROOT / "assets/fonts/FusionPixel-12px-SC.woff2"
SUBSET = ROOT / "assets/fonts/FusionPixel-12px-SC-web.woff2"

try:
    import fontTools  # noqa: F401
except ImportError:
    print("fonttools is required: pip install fonttools brotli", file=sys.stderr)
    sys.exit(2)

text = HTML.read_text(encoding="utf-8")
chars = "".join(sorted({ch for ch in text if ord(ch) >= 32 and not ch.isspace()}))

with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as handle:
    handle.write(chars)
    text_file = handle.name

subprocess.run(
    [
        sys.executable, "-m", "fontTools.subset", str(FULL),
        f"--text-file={text_file}",
        "--flavor=woff2",
        f"--output-file={SUBSET}",
    ],
    check=True,
)

print(f"subset written: {SUBSET.relative_to(ROOT)} ({SUBSET.stat().st_size / 1024:.1f}KB, {len(chars)} chars)")
