#!/usr/bin/env python3
"""
Slice sticker-pack sprite sheets into individual transparent PNGs.

Usage (from repo root):
    python3 scripts/process-stickers.py

Place the four source sheets in public/assets/ before running:
    princess-stickerpack.png   — 5 cols × 4 rows (20 princess stickers)
    mermaid-stickerpack.png    — 5 cols × 4 rows (20 mermaid stickers)
    kpop-stickerpack.png       — 5 cols × 4 rows (20 kpop stickers)
    kpop-superstickerpack.png  — 5 cols × 3 rows (15 super stickers:
                                   row 0 = princess supers 00–04
                                   row 1 = mermaid supers  05–09
                                   row 2 = kpop supers     10–14)
    nyc-stickerpack.png        — 5 cols × 2 rows (10 nyc stickers,  nyc-00..09)
    nyc-stickerpack2.png       — 5 cols × 2 rows (10 nyc stickers,  nyc-10..19)
    nyc-superstickerpack.png   — 5 cols × 1 row  (5 nyc supers,    super-15..19)

Output goes to public/assets/stickers/.

NOTES:
- The nyc sheets' source cells are larger than the others, so regular nyc
  outputs are resized to the standard 280×280 (alpha-trimmed, centered) and
  nyc supers to 400×400 after slicing.
- nyc-stickerpack2.png (nyc-10..19) and nyc-superstickerpack.png (super-15..19)
  use offset output numbering and were processed inline rather than via the
  SHEETS table below (which numbers each prefix from 00). The supers are also
  filtered to their largest connected blob to drop neighbor slivers. See the
  NYC punch-list entries in the spec.
"""

from PIL import Image
import numpy as np
from collections import deque
import os
import sys

ASSETS     = "public/assets"
OUTPUT_DIR = "public/assets/stickers"

SHEETS = [
    {"file": "princess-stickerpack.png",    "cols": 5, "rows": 4, "prefix": "princess"},
    {"file": "mermaid-stickerpack.png",     "cols": 5, "rows": 4, "prefix": "mermaid"},
    {"file": "kpop-stickerpack.png",        "cols": 5, "rows": 4, "prefix": "kpop"},
    {"file": "kpop-superstickerpack.png",   "cols": 5, "rows": 3, "prefix": "super"},
    {"file": "nyc-stickerpack.png",         "cols": 5, "rows": 2, "prefix": "nyc"},
]


def remove_background(img, tolerance=28):
    """
    Make white/near-white pixels transparent using BFS flood-fill from
    the image edges only — so interior sparkles and highlights are preserved.
    """
    img  = img.convert("RGBA")
    data = np.array(img, dtype=np.uint8)
    h, w = data.shape[:2]

    r = data[:, :, 0].astype(np.int16)
    g = data[:, :, 1].astype(np.int16)
    b = data[:, :, 2].astype(np.int16)
    near_white = (r >= 255 - tolerance) & (g >= 255 - tolerance) & (b >= 255 - tolerance)

    visited = np.zeros((h, w), dtype=bool)
    queue   = deque()

    def seed(y, x):
        if near_white[y, x] and not visited[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(w):
        seed(0, x)
        seed(h - 1, x)
    for y in range(1, h - 1):
        seed(y, 0)
        seed(y, w - 1)

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx] and near_white[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))

    result = data.copy()
    result[visited, 3] = 0
    return Image.fromarray(result)


def process_sheet(cfg):
    path = os.path.join(ASSETS, cfg["file"])
    if not os.path.exists(path):
        print(f"  SKIP (not found): {path}")
        return 0

    img  = Image.open(path)
    iw, ih = img.size
    cw = iw // cfg["cols"]
    ch = ih // cfg["rows"]
    print(f"  {cfg['file']}: {iw}×{ih}px  →  {cfg['cols']}×{cfg['rows']} cells @ {cw}×{ch}px each")

    count = 0
    for row in range(cfg["rows"]):
        for col in range(cfg["cols"]):
            left, top     = col * cw, row * ch
            right, bottom = left + cw, top + ch
            cell = img.crop((left, top, right, bottom))
            cell = remove_background(cell)
            fname = f"{cfg['prefix']}-{count:02d}.png"
            cell.save(os.path.join(OUTPUT_DIR, fname), "PNG")
            count += 1

    return count


if __name__ == "__main__":
    os.chdir(os.path.join(os.path.dirname(__file__), ".."))
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    total = 0
    missing = []
    for sheet in SHEETS:
        print(f"Processing {sheet['file']} ...")
        n = process_sheet(sheet)
        if n == 0:
            missing.append(sheet["file"])
        total += n

    print(f"\n✓ {total} sticker PNGs written to {OUTPUT_DIR}/")
    if missing:
        print(f"\n⚠  Missing source files (add to {ASSETS}/ and re-run):")
        for f in missing:
            print(f"     {f}")
        sys.exit(1)
