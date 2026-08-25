#!/usr/bin/env python3
"""
Build web media for the Next.js app from the sources in brand/.

    .venv/bin/python tools/build-media.py [--images] [--video]

Writes to public/media (images) and public/video (clips + posters).
Everything it writes is disposable and git-ignored.

Requires Pillow, and ffmpeg on PATH for the video step.
"""
import glob
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IMG = os.path.join(ROOT, "brand", "source")
SRC_VID = os.path.join(ROOT, "brand", "video")
OUT_IMG = os.path.join(ROOT, "public", "media")
OUT_VID = os.path.join(ROOT, "public", "video")

TIERS = {
    "02-hero": [640, 1080, 1600],
    "03-bridal": [640, 1080, 1600],
    "04-atelier": [640, 1080, 1600],
    "05-detail": [640, 1080, 1600],
    "06-design-sheets": [640, 1080],
    "08-press": [640, 1080],
    "09-product-cards": [640, 1080],
    "07-product": [400, 800, 1200],
}
QUALITY = 78

# clip -> (folder, start, duration)
# Trims are QC decisions. Veo inserted hard cuts into 01 and 04 despite the
# prompt asking for one continuous take; 01 changes necklace after ~4.5s.
CLIPS = {
    "hero-collar": ("01-hero-arch-reveal", 0.15, 4.05),
    "courtyard": ("02-olive-courtyard", 0.10, 3.85),
    "sketch": ("03-penciled-precious", 0.10, 3.85),
    "atelier-case": ("04-atelier-case", 1.95, 2.00),
    "jasmine": ("05-macro-jasmine", 0.10, 3.85),
    "bridal": ("06-bridal", 0.10, 3.85),
    "nupur": ("07-nupur", 0.10, 3.85),
    "diya": ("08-logo-backdrop", 0.10, 3.85),
}

# Clips that get scroll-scrubbed need dense keyframes so seeking is smooth.
# A normal ~2s GOP makes scrubbing visibly stutter. Every frame a keyframe
# fixes that but triples the file, which is unaffordable on 4G — a GOP of 4
# lands the seek within a frame or two and the decoder covers the rest.
SCRUBBED = {"hero-collar", "sketch", "atelier-case"}


def build_images() -> None:
    from PIL import Image

    Image.MAX_IMAGE_PIXELS = None
    os.makedirs(OUT_IMG, exist_ok=True)
    count = 0

    # Logos keep alpha.
    for f in sorted(glob.glob(os.path.join(SRC_IMG, "01-brand", "logo*.png"))):
        stem = os.path.splitext(os.path.basename(f))[0]
        im = Image.open(f).convert("RGBA")
        im.save(os.path.join(OUT_IMG, f"{stem}.png"), "PNG", optimize=True)
        for w in (240, 480):
            r = im.copy()
            r.thumbnail((w, w * 4), Image.LANCZOS)
            r.save(os.path.join(OUT_IMG, f"{stem}-{w}.webp"), "WEBP", quality=90, method=6)
        count += 1

    jobs: list[tuple[str, str, list[int]]] = []
    for f in sorted(glob.glob(os.path.join(SRC_IMG, "01-brand", "*"))):
        if not os.path.basename(f).startswith("logo"):
            jobs.append((f, "", [640, 1080, 1600]))
    for tier, widths in TIERS.items():
        prefix = "p-" if tier == "07-product" else ""
        for f in sorted(glob.glob(os.path.join(SRC_IMG, tier, "*"))):
            jobs.append((f, prefix, widths))

    for path, prefix, widths in jobs:
        stem = prefix + os.path.splitext(os.path.basename(path))[0]
        im = Image.open(path).convert("RGB")
        wrote = False
        for w in widths:
            if im.width < w * 0.75:
                continue
            r = im.copy()
            r.thumbnail((w, w * 4), Image.LANCZOS)
            r.save(os.path.join(OUT_IMG, f"{stem}-{w}.webp"), "WEBP", quality=QUALITY, method=6)
            wrote = True
        if not wrote:
            im.save(os.path.join(OUT_IMG, f"{stem}-{im.width}.webp"), "WEBP",
                    quality=QUALITY, method=6)
        count += 1

    total = sum(os.path.getsize(os.path.join(OUT_IMG, f)) for f in os.listdir(OUT_IMG))
    print(f"images: {count} sources -> {len(os.listdir(OUT_IMG))} files, {total / 1048576:.1f}MB")


def build_video() -> None:
    if not shutil.which("ffmpeg"):
        print("video: ffmpeg not on PATH — skipping", file=sys.stderr)
        return
    from PIL import Image

    os.makedirs(OUT_VID, exist_ok=True)

    for name, (folder, start, dur) in CLIPS.items():
        sources = glob.glob(os.path.join(SRC_VID, folder, "*.mp4"))
        if not sources:
            print(f"  ! no source in brand/video/{folder}", file=sys.stderr)
            continue
        src = sources[0]
        scrub = name in SCRUBBED

        args = [
            "ffmpeg", "-v", "error",
            "-ss", str(start), "-t", str(dur), "-i", src, "-an",
            "-vf", f"scale='min({960 if scrub else 1280},iw)':-2:flags=lanczos",
            "-c:v", "libx264", "-profile:v", "high", "-preset", "slow",
            "-crf", "26" if scrub else "27",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
        ]
        if scrub:
            args += ["-g", "4", "-keyint_min", "4", "-sc_threshold", "0"]
        args += [os.path.join(OUT_VID, f"{name}.mp4"), "-y"]
        subprocess.run(args, check=True)

        # WebM for browsers that prefer it. Not used for scrubbed clips —
        # VP9 seeking is markedly worse than H.264 in Safari.
        if not scrub:
            subprocess.run([
                "ffmpeg", "-v", "error",
                "-ss", str(start), "-t", str(dur), "-i", src, "-an",
                "-vf", "scale='min(1280,iw)':-2:flags=lanczos",
                "-c:v", "libvpx-vp9", "-crf", "38", "-b:v", "0",
                "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
                os.path.join(OUT_VID, f"{name}.webm"), "-y",
            ], check=True)

        tmp = os.path.join(OUT_VID, f".{name}.png")
        subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(OUT_VID, f"{name}.mp4"),
                        "-frames:v", "1", tmp, "-y"], check=True)
        Image.open(tmp).convert("RGB").save(
            os.path.join(OUT_VID, f"{name}-poster.webp"), "WEBP", quality=76, method=6)
        os.remove(tmp)

        kb = os.path.getsize(os.path.join(OUT_VID, f"{name}.mp4")) // 1024
        print(f"  {name:14} {dur:.2f}s  {kb:>5}KB mp4{'  [scrub: gop4]' if scrub else ''}")

    total = sum(os.path.getsize(os.path.join(OUT_VID, f)) for f in os.listdir(OUT_VID))
    print(f"video: {len(CLIPS)} clips, {total / 1048576:.1f}MB total")


if __name__ == "__main__":
    args = sys.argv[1:]
    if "--images" in args or not args:
        build_images()
    if "--video" in args or not args:
        build_video()
