"""Cut the supplier collage into separate product shots (3x upscaled + sharpened).

Run:  python tools/heated-gloves/crop_product.py
Input:  public/heated-gloves/images/source-collage.png (647x667)
Output: public/heated-gloves/images/p-*.png
Boxes are in source pixels. Replace with higher-res photos from the listing if you get them.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
DIR = ROOT / "public" / "heated-gloves" / "images"
SCALE = 3

# name: (box, circle?)  — circle crops keep only the round photo (transparent outside)
CROPS = {
    "p-heat-hand": ((0, 0, 204, 228), None),
    "p-phone": ((206, 22, 416, 232), (105, 104, 104)),
    "p-pink-pair": ((440, 120, 628, 238), None),
    "p-heated-pair": ((262, 250, 498, 514), None),
    "p-navy": ((494, 240, 630, 376), None),
    "p-black-flip": ((494, 376, 630, 520), None),
    "p-mint": ((234, 520, 360, 658), None),
    "p-blue": ((366, 520, 494, 658), None),
    "p-grey": ((494, 520, 632, 658), None),
    "p-flip-hands": ((2, 424, 234, 656), (116, 114, 112)),
}


def main() -> None:
    src = Image.open(DIR / "source-collage.png").convert("RGBA")
    for name, (box, circle) in CROPS.items():
        im = src.crop(box)
        im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS)
        im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))
        if circle:
            cx, cy, r = (v * SCALE for v in circle)
            mask = Image.new("L", im.size, 0)
            ImageDraw.Draw(mask).ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)
            im.putalpha(mask)
            im = im.crop((cx - r, cy - r, cx + r, cy + r))
        im.save(DIR / f"{name}.png")
        print(name, im.size)


if __name__ == "__main__":
    main()
