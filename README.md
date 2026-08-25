# Canvas — website redesign

Redesign of [canvas-bd.com](https://www.canvas-bd.com/), a handcrafted brass and
silver jewellery house in Dhaka founded by Tanwy Kabir.

The existing site runs on **Odoo eCommerce** and works — 78 products, cart,
checkout, accounts, blog, careers. The problem is presentation, not plumbing.
This repo holds the new front end, the curated asset library behind it, and the
generated motion footage.

---

## What's here

```
assets/          Curated source library (110 files). The design source of truth.
  01-brand/      Logo lockups (transparent PNG), founder portraits
  02-hero/       Full-bleed editorial verticals
  03-bridal/     Bridal campaign
  04-atelier/    Making-of, sketches, the workbench
  05-detail/     Macro product and worn detail
  06-design-sheets/  Illustrated spec sheets
  07-product/    78 catalogue shots, one per live product
  08-press/      The Daily Star coverage
  09-product-cards/  Branded product cards

video/           Veo/Flow footage. PROMPTS.md holds the eight prompts,
                 the shared negative prompt, QC checklist and delivery specs.
                 Each NN-name/ folder holds its SOURCE still + the generated clip.

src/             The site
  index.html     Homepage
  assets/css/    tokens.css (design system) → base.css → site.css
  assets/js/     motion.js + vendored GSAP, ScrollTrigger, Lenis
  assets/products.json   78 products scraped from the live catalogue

scripts/
  build-assets.py  Regenerate every web derivative from assets/ and video/
  shoot.py         Screenshot the site at true device sizes over CDP

site-mirror/     Reference crawl of the live Odoo site (crawl scripts + data
                 tracked; the ~70MB of downloads is gitignored and reproducible)
```

## Running it

```bash
python3 -m venv .venv && .venv/bin/pip install pillow websocket-client
.venv/bin/python scripts/build-assets.py    # writes src/assets/img + video
cd src && python3 -m http.server 8099
```

Then <http://localhost:8099/>.

`src/assets/img/` and `src/assets/video/` are **git-ignored build output**. A
fresh clone has no images until you run `build-assets.py`. Sources are tracked;
derivatives are not, so re-encodes don't bloat history.

Requires `ffmpeg` on PATH for the video step (`brew install ffmpeg`).

## Screenshots

```bash
.venv/bin/python scripts/shoot.py                       # all four presets
.venv/bin/python scripts/shoot.py mobile --scroll 0,900,2400
```

Chrome's headless `--window-size` **clamps the viewport to 500px minimum**, which
silently makes narrow-viewport screenshots wrong — they look like mobile but
render at 500px and crop. `shoot.py` uses `Emulation.setDeviceMetricsOverride`
over the DevTools Protocol, which doesn't clamp. Use it rather than
`--screenshot` for anything below 500px.

`--scroll` exists because full-page capture is meaningless here: the pinned
ScrollTrigger inflates the document and the tall capture comes out garbled.
Capture at scroll positions instead.

---

## The design system

Colour is sampled from the actual logo file, not guessed:

| Token | Hex | Role |
|---|---|---|
| `--c-berry` | `#8C144B` | 72% of the logo mark. Structure and moments. |
| `--c-gold` | `#DDB15B` | 23% of the mark. Detail, rules, labels. |
| `--c-olive` | `#3A3B2A` | **The ground.** Aged brass patina. |
| `--c-olive-gold` | `#7E7849` | The brand's own body-copy olive. |
| `--c-ink` | `#1F150B` | Wordmark ink. |
| `--c-paper` | `#F6F0E6` | Long-form reading ground. |

Ratio to hold sitewide: **olive ~70% / gold ~20% / berry ~10%.** Olive carries the
dark ground, which frees berry to mean something instead of filling backgrounds.
Pure black is the obvious luxury default and reads as generic; olive is the
material this house actually works in, and it makes antique gold glow.

**Type.** Cormorant Garamond (display) / Karla (body) / Noto Serif Bengali. Bangla
runs at `--lh-bangla: 1.72` — it needs ~15% more leading than Latin at the same
size, and setting both at one value is the most common way bilingual pages look
broken.

**Four motifs, one job each** — drawn from the logo and the craft:
the **arch** masks every image, the **spiral rose** is the only spinner/marker,
the **hasuli crescent** replaces horizontal rules, and the **nakshi kantha running
stitch** is every border (`1px dashed`).

## Motion

Slow — 600–1100ms. Reveal, never bounce. **The product never moves; camera and
light do.**

Scroll-scrubbing is a **desktop-only enhancement**. Touch devices get discrete
IntersectionObserver reveals instead, because mid-range Android stutters on
scroll-linked animation and stutter reads as broken, not luxurious. Much of this
audience is on a mid-range Android on 4G in Dhaka.

Everything degrades: no JS, `prefers-reduced-motion`, and `save-data` / 2G each
leave a complete, shoppable page. Video never autoloads — sources attach only
near the viewport, and not at all under save-data, where posters carry the page.

## Video

Eight clips, all under budget (264–736KB mp4). Two needed trimming: Veo inserted
hard cuts into **01-hero** (~4.5s, the necklace changes after) and **04-atelier**
(~1.75s) despite the prompt asking for a single continuous take. Trims are
encoded in `CLIPS` in `scripts/build-assets.py`.

**08 was not the brief** — the prompt asked for abstract light with no subject, to
sit behind the logo; Veo produced a diya flame. It's beautiful and culturally
apt, so it now carries the "Every piece tells a story" band instead. The logo is
never generated — it's the real transparent PNG composited over footage.

## Porting to Odoo

The homepage is deliberately plain HTML so it maps onto QWeb templates. Preserve
every existing route — `/shop`, `/shop/category/*`, `/shop/cart`, `/web/login`,
`/blog`, `/about`, `/custom-jewelry`, `/jobs`, `/tc`, `/privacy`, `/contactus` —
and the 10 top-level shop categories with their subcategories. Product URLs
(`/shop/<slug>-<id>`) must not change; they're indexed.

## Known gaps

- **No vector logo anywhere.** The best available mark is a 1000×667 transparent
  PNG. The Odoo "SVG" attachments are decorative image frames with the raster
  embedded as base64 — not artwork. A real SVG needs to be redrawn.
- **All brand photography is 9:16**, reels-first. The desktop hero holds the
  vertical frame in an arch rather than force-cropping it to landscape.
- **Category counts are not shown** — the live category pages render products via
  JS, so the crawl couldn't produce real per-category counts.
- Generated video is 720×1280, below the 1080×1920 spec.
