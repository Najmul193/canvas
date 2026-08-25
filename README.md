# Canvas

Storefront for [Canvas](https://www.canvas-bd.com/) — a handcrafted brass and
silver jewellery house in Dhaka, founded by Tanwy Kabir.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · GSAP + Lenis · Docker

---

## Quick start

```bash
npm install
python3 -m venv .venv && .venv/bin/pip install pillow websocket-client
.venv/bin/python tools/build-media.py     # writes public/media + public/video
npm run dev
```

<http://localhost:3000>

`public/media/` and `public/video/` are **git-ignored build output**. Sources
live in `brand/`, which is tracked. A fresh clone has no images until you run
`build-media.py` — if every image is broken, that's the step you skipped.

The video step needs `ffmpeg` on PATH (`brew install ffmpeg`).

| Command | |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

## Docker

```bash
docker build -t canvas-bd .
docker run -p 3000:3000 canvas-bd
```

353MB image, multi-stage, runs as a non-root user with a healthcheck.
`output: "standalone"` in `next.config.ts` is what keeps it small — the runtime
stage copies a self-contained server rather than all of `node_modules`.

## Deploying to Render

`render.yaml` is a Blueprint. Push the repo, then in Render: **New → Blueprint →
select this repo**. It reads the file and provisions the service.

Two defaults worth knowing:

- **`plan: starter`, not free.** The free tier sleeps after inactivity and cold
  starts take ~30s — unacceptable for a storefront.
- **`region: singapore`**, the closest Render region to Dhaka.

---

## Structure

```
src/
  app/
    layout.tsx          Fonts, metadata, JSON-LD, smooth scroll, nav/footer
    page.tsx            Section order (the light/dark rhythm)
    globals.css         Design tokens + type/motion primitives
  components/
    layout/             Nav, Footer
    sections/           Hero, Vocabulary, Craft, Collections, Ambient, Maker, Featured
    motion/             SmoothScroll, ScrubVideo, Reveal, SplitLines
    ui/                 ProductCard
  data/
    products.ts         78 products, generated from the live catalogue
    site.ts             Brand facts, routes, taxonomy, collections
  lib/                  env capability checks, cn()

public/                 Build output (git-ignored)
brand/
  source/               110 curated stills — the design source of truth
  video/                Veo footage + PROMPTS.md (prompts, negative prompt, QC)
tools/
  build-media.py        Regenerate public/ from brand/
  shoot.py              Screenshot at true device sizes over CDP
  reference/            Crawl of the live Odoo site
```

## Design

**Colour is monochrome by discipline.** Grounds are `#000` and `#f5f5f7`;
photography is the only saturated thing on screen. Gold `#ddb15b` appears as
hairlines and small labels. Berry `#8c144b` appears on exactly two elements —
the primary CTA and the bag badge — and nowhere else.

Sections alternate ink → bone → ink → bone. That inversion is what gives the
page cadence and stops any single ground going muddy. An earlier build tinted
every surface olive and it read as drab; the fix was to stop tinting grounds at
all and let the jewellery carry the colour.

**Type.** Bodoni Moda for display — a high-contrast didone, continuing the voice
already on the brand's own product cards. Inter for UI, as the closest free
analogue to SF Pro. Noto Serif Bengali for Bangla, set at 1.7 line-height
because Bangla needs ~15% more leading than Latin at the same size.

## Motion

Slow and precise. 0.9–1.8s, `cubic-bezier(0.22, 1, 0.36, 1)`, no bounce.

**`ScrubVideo`** is the centrepiece: the section pins and scroll position drives
`video.currentTime` rather than playing in real time, so the reader controls the
footage. Three things make it work:

1. Clips are encoded `-movflags +faststart` with a **GOP of 4**
   (`tools/build-media.py`). A normal 2-second GOP makes seeking visibly stutter.
2. Seeks are throttled through `gsap.quickTo` — assigning `currentTime` on every
   scroll event overwhelms the decoder.
3. H.264 only for scrubbed clips. VP9 seeking is markedly worse in Safari.

**Scrubbing is a desktop enhancement.** Touch gets a plain looping video and
discrete `IntersectionObserver` reveals, because mid-range Android stutters on
scroll-linked animation and stutter reads as broken, not premium. Smooth scroll
is desktop-only for the same reason — native momentum beats anything synthesised.

Everything degrades: no-JS, `prefers-reduced-motion`, and `save-data`/2G each
leave a complete, shoppable page. Under save-data no video downloads at all and
posters carry the sections. Much of this audience is on mid-range Android over
4G in Dhaka.

## Video

Eight Veo clips, 7.7MB total. Two needed trimming — Veo inserted hard cuts into
**01-hero** (~4.5s; the necklace becomes a different piece after) and
**04-atelier** (~1.75s) despite the prompt asking for one continuous take. The
trims live in `CLIPS` in `tools/build-media.py`.

**Clip 08 was not the brief.** It was prompted as an abstract ground to sit
behind the logo; Veo returned a lit diya. It has a subject so it can't hold a
mark — but it's the most quietly Bengali frame in the set, so it carries the
"Every piece tells a story" band instead. The logo is never generated.

`brand/video/PROMPTS.md` holds all eight prompts, the shared negative prompt,
and the QC checklist.

## Screenshots

```bash
.venv/bin/python tools/shoot.py --url http://localhost:3000/
.venv/bin/python tools/shoot.py --url http://localhost:3000/ desktop --scroll 0,3400
```

Chrome's headless `--window-size` **clamps the viewport to 500px minimum**,
which silently makes narrow screenshots wrong — they render at 500px and crop.
`shoot.py` uses `Emulation.setDeviceMetricsOverride` over CDP, which doesn't
clamp. `--scroll` exists because full-page capture is meaningless on a pinned
page: ScrollTrigger inflates the document and the tall capture comes out garbled.

## Odoo

Odoo still owns commerce. Every storefront route is preserved and must not
change — they're indexed:

`/shop` · `/shop/category/*` · `/shop/<slug>-<id>` · `/shop/cart` · `/web/login`
· `/blog` · `/about` · `/custom-jewelry` · `/jobs` · `/tc` · `/privacy` ·
`/contactus`

Cart and account links point at Odoo. Swapping `src/data/products.ts` for the
Odoo API is the seam if this later goes headless.

## Known gaps

- **No vector logo exists.** The best available mark is a 1000×667 transparent
  PNG. The `.svg` files on the Odoo site are decorative image frames with the
  raster embedded as base64 — not artwork. A real SVG needs redrawing.
- **All brand photography is 9:16**, reels-first. Fine for the full-bleed hero,
  limiting for wide desktop compositions.
- Generated video is 720×1280, below the 1080×1920 spec.
- Only the homepage is built. Shop, product, and editorial pages are next.
