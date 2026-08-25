#!/usr/bin/env python3
"""
Regenerate every web derivative in src/assets/ from the sources in assets/ and video/.

Everything this writes is disposable and git-ignored — run it after a fresh clone,
or whenever a source asset changes.

    .venv/bin/python scripts/build-assets.py [--images] [--video]

Requires: Pillow (images), ffmpeg on PATH (video).
"""
import os, sys, glob, json, shutil, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IMG = os.path.join(ROOT, "assets")
SRC_VID = os.path.join(ROOT, "video")
OUT_IMG = os.path.join(ROOT, "src", "assets", "img")
OUT_VID = os.path.join(ROOT, "src", "assets", "video")

# Editorial tiers get three widths; products two; logos keep alpha.
TIERS = {
    "02-hero":           [480, 800, 1280],
    "03-bridal":         [480, 800, 1280],
    "04-atelier":        [480, 800, 1280],
    "05-detail":         [480, 800, 1280],
    "06-design-sheets":  [480, 800, 1280],
    "08-press":          [480, 800, 1280],
    "09-product-cards":  [480, 800, 1280],
    "07-product":        [400, 800],
}
QUALITY = 74

# clip -> (source folder, start seconds, duration seconds)
# Trims are QC decisions: Veo inserted hard cuts into 01 and 04 despite the
# prompt asking for a single continuous take. See video/PROMPTS.md.
CLIPS = {
    "hero-collar":  ("01-hero-arch-reveal", 0.15, 4.05),   # cut at ~4.5s; necklace changes after
    "courtyard":    ("02-olive-courtyard",  0.10, 3.85),
    "sketch":       ("03-penciled-precious",0.10, 3.85),
    "atelier-case": ("04-atelier-case",     1.95, 2.00),   # cut at ~1.75s; 2nd segment is clean
    "jasmine":      ("05-macro-jasmine",    0.10, 3.85),
    "bridal":       ("06-bridal",           0.10, 3.85),
    "nupur":        ("07-nupur",            0.10, 3.85),
    "diya":         ("08-logo-backdrop",    0.10, 3.85),
}


def build_images():
    from PIL import Image
    Image.MAX_IMAGE_PIXELS = None
    os.makedirs(OUT_IMG, exist_ok=True)
    n = 0

    # Logos keep transparency: PNG passthrough + two webp sizes.
    for f in sorted(glob.glob(os.path.join(SRC_IMG, "01-brand", "logo*.png"))):
        stem = os.path.splitext(os.path.basename(f))[0]
        im = Image.open(f).convert("RGBA")
        im.save(os.path.join(OUT_IMG, stem + ".png"), "PNG", optimize=True)
        for w in (320, 640):
            r = im.copy(); r.thumbnail((w, w * 4), Image.LANCZOS)
            r.save(os.path.join(OUT_IMG, f"{stem}-{w}.webp"), "WEBP", quality=88, method=6)
        n += 1

    # Everything else, including non-logo files in 01-brand (founder portraits).
    jobs = []
    for f in sorted(glob.glob(os.path.join(SRC_IMG, "01-brand", "*"))):
        if not os.path.basename(f).startswith("logo"):
            jobs.append((f, "", [480, 800, 1280]))
    for tier, widths in TIERS.items():
        prefix = "p-" if tier == "07-product" else ""
        for f in sorted(glob.glob(os.path.join(SRC_IMG, tier, "*"))):
            jobs.append((f, prefix, widths))

    for f, prefix, widths in jobs:
        stem = prefix + os.path.splitext(os.path.basename(f))[0]
        im = Image.open(f).convert("RGB")
        made = False
        for w in widths:
            if im.width < w * 0.75:
                continue
            r = im.copy(); r.thumbnail((w, w * 4), Image.LANCZOS)
            r.save(os.path.join(OUT_IMG, f"{stem}-{w}.webp"), "WEBP", quality=QUALITY, method=6)
            made = True
        if not made:  # source smaller than the smallest target — emit at native size
            im.save(os.path.join(OUT_IMG, f"{stem}-{im.width}.webp"), "WEBP", quality=QUALITY, method=6)
        t = im.copy(); t.thumbnail((20, 20))
        t.save(os.path.join(OUT_IMG, f"{stem}-lqip.webp"), "WEBP", quality=40)
        n += 1

    total = sum(os.path.getsize(os.path.join(OUT_IMG, x)) for x in os.listdir(OUT_IMG))
    print(f"images: {n} sources -> {len(os.listdir(OUT_IMG))} files, {total/1048576:.1f}MB")


def build_video():
    if not shutil.which("ffmpeg"):
        print("video: ffmpeg not on PATH — skipping", file=sys.stderr)
        return
    from PIL import Image
    os.makedirs(OUT_VID, exist_ok=True)

    for name, (folder, start, dur) in CLIPS.items():
        srcs = glob.glob(os.path.join(SRC_VID, folder, "*.mp4"))
        if not srcs:
            print(f"  ! no source in video/{folder}", file=sys.stderr)
            continue
        src = srcs[0]
        common = ["-ss", str(start), "-t", str(dur), "-i", src, "-an",
                  "-vf", "scale='min(1080,iw)':-2:flags=lanczos"]
        subprocess.run(["ffmpeg", "-v", "error", *common,
                        "-c:v", "libx264", "-profile:v", "high", "-crf", "27", "-preset", "slow",
                        "-movflags", "+faststart", "-pix_fmt", "yuv420p",
                        os.path.join(OUT_VID, name + ".mp4"), "-y"], check=True)
        subprocess.run(["ffmpeg", "-v", "error", *common,
                        "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0",
                        "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
                        os.path.join(OUT_VID, name + ".webm"), "-y"], check=True)
        # Poster via Pillow — this ffmpeg build has no webp encoder.
        tmp = os.path.join(OUT_VID, f".{name}.png")
        subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(OUT_VID, name + ".mp4"),
                        "-frames:v", "1", tmp, "-y"], check=True)
        Image.open(tmp).convert("RGB").save(
            os.path.join(OUT_VID, name + "-poster.webp"), "WEBP", quality=72, method=6)
        os.remove(tmp)
        kb = os.path.getsize(os.path.join(OUT_VID, name + ".mp4")) // 1024
        print(f"  {name:14} {dur:.2f}s  {kb}KB mp4")

    total = sum(os.path.getsize(os.path.join(OUT_VID, x)) for x in os.listdir(OUT_VID))
    print(f"video: {len(CLIPS)} clips, {total/1048576:.1f}MB total")


if __name__ == "__main__":
    args = sys.argv[1:]
    do_img = "--images" in args or not args
    do_vid = "--video" in args or not args
    if do_img: build_images()
    if do_vid: build_video()
