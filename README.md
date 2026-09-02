# Canvas

Storefront for [Canvas](https://www.canvas-bd.com/) — a handcrafted brass and
silver jewellery house in Dhaka, founded by Tanwy Kabir.

Next.js 16 · React 19 · TypeScript · Tailwind v4 · GSAP + Lenis · Docker

---

## Quick start

```bash
./start.sh          # http://localhost:3000
./stop.sh
```

That's it from a fresh clone. `start.sh` installs npm dependencies if they're
missing and builds `public/` from `brand/` on first run, creating the Python
venv it needs along the way.

| | |
|---|---|
| `./start.sh` | Dev server, hot reload |
| `./start.sh prod` | Production build, then serve it |
| `./start.sh docker` | Build the image and run the container |
| `./stop.sh` | Stop whichever of those is running |
| `PORT=4000 ./start.sh` | Use a different port |

`stop.sh` also frees the port if you started a server by hand in another
terminal, and removes the container if you used docker mode.

Logs: `tail -f .run/server.log`, or `docker logs -f canvas-bd-run`.

The video build needs `ffmpeg` on PATH (`brew install ffmpeg`). Without it
images still build and video is skipped.

<details>
<summary>Doing it manually</summary>

```bash
npm install
python3 -m venv .venv && .venv/bin/pip install pillow websocket-client
.venv/bin/python tools/build-media.py     # writes public/media + public/video
npm run dev
```

`public/media/` and `public/video/` are **git-ignored build output**. Sources
live in `brand/`, which is tracked. A fresh clone has no images until
`build-media.py` runs — if every image is broken, that's the step you skipped.
</details>

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
    about/page.tsx      Our Story — five parts, same rhythm
    globals.css         Design tokens + type/motion primitives
  components/
    layout/             Nav, Footer, ChapterRail, PageHero
    sections/           Hero, Courtyard, Vocabulary, Craft, Atelier,
                        Collections, Worn, Maker, Bridal, Ambient, Featured
    sections/about/     House, Vision, Hand, Founder, Visit
    motion/             SmoothScroll, ScrubVideo, AmbientVideo, Parallax,
                        Reveal, Enter, Drift, SplitLines
    ui/                 ProductCard, Chapter, Verse
  data/
    products.ts         78 products, generated from the live catalogue
    site.ts             Brand facts, routes, taxonomy, collections
    story.ts            The seven chapters, and the quotations
    about.ts            Our Story copy, and where each fact came from
  lib/                  env capability checks, cn(), shared rAF ticker, scroller

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

## Story

The homepage is **seven chapters**, and the shop either side of them. The order
is the life of a piece rather than a list of modules:

| | | | |
|---|---|---|---|
| ০১ | মাটি | the soil | courtyard — where the form comes from |
| ০২ | নাম | the names | — the taxonomy, in Bangla |
| ০৩ | রেখা | the line | sketch — the drawing that starts it |
| ০৪ | সোনা | the gold | atelier case — the metal, and the box it lives in |
| ০৫ | পরা | the wearing | jasmine · nupur — where on the body it belongs |
| ০৬ | দিন | the day | bridal — the occasion it is bought for |
| ০৭ | স্মৃতি | what remains | diya — what happens to it afterwards |

Chapters are marked with a hairline, a **Bangla numeral** and a Bangla name. If
the taxonomy is Bangla-first, the counting has to be too, or the Bangla reads as
ornament. `ChapterRail` puts the same seven marks down the left gutter as a
scroll position indicator — bare rules at 36px wide, names on hover, in two
colours picked to clear both grounds (neutral grey for the marks, gold-deep for
the active one: 5.3:1 on ink, 3.0:1 on bone). It used `mix-blend-mode:
difference` first, which is the obvious stateless answer to the ink → bone → ink
alternation — but a blended *fixed* element makes the browser rasterise the
whole scrolling page behind it every frame, and it also rendered the inactive
marks nearly invisible on bone.

**On the quotations** — this is a rule, not a preference. Only lines that can be
attributed exactly are set as verse: Jibanananda Das (রূপসী বাংলা), Tagore
(সোনার তরী), Nazrul (খোঁপায় তারার ফুল). Where the right idea belongs to a
poem but not to a line we can quote faithfully, it is set as a **figure**
instead — a named Bangla term (আলপনা, গায়ে হলুদ, নকশী কাঁথা) with our own
sentence beside it and the poem credited as a reference. Inventing a couplet and
hanging a poet's name on it would be the one unforgivable thing on a page about
authorship. `src/data/story.ts` holds both types and says which is which.

The Bangla is always the quotation and the English underneath is our gloss,
credited as ours. Setting the English at display size instead would quietly make
the translation the work and the original the footnote.

### Our Story

`/about` is **five parts**, on the same ink → bone → ink alternation:

| | | | |
|---|---|---|---|
| ০১ | ঘর | the house | what Canvas makes, and the trade it has chosen |
| ০২ | দৃষ্টি | the vision | why the craft is held exactly and the proportion moved |
| ০৩ | হাত | the hand | the sheet a piece is argued out on |
| ০৪ | নকশাকার | the designer | Tanwy Kabir, at length rather than in three lines |
| ০৫ | ঠিকানা | the address | where to stand and hold one |

The count restarts at ০১ rather than continuing from ০৭. It is a different
telling of the same house, not chapter eight — and because `ChapterRail`
observes the homepage's seven ids and finds none of these, it stays folded
away, which is the right answer for a page with no spine.

**Every fact on it comes from the brand's own about page**, crawled to
`tools/reference/site-mirror/pages/about.html`. Nothing was added. What changed
is the voice: the Odoo copy is written in the register of a catalogue listing,
and nowhere else on this site speaks that way. What is deliberately *absent*
matters as much — no founding year, no headcount, no artisan count, no award.
Those are the numbers an about page wants most, and none of them are on the
record. A house whose whole story is authorship cannot invent its own.

The three sheets in ০৩ are captioned from **the images themselves**, not from
`manifest.json`, which calls two of them "spec sheet" and is misleading. They
are not elevations and sections: each is a motif drawn from life, the belief
attached to it written out beside it, and the piece it becomes worked out
underneath. The first draft of this page described a pair of myna as a
technical drawing, which is what captioning an asset nobody has opened looks
like.

**Type.** Bodoni Moda for display — a high-contrast didone, continuing the voice
already on the brand's own product cards. Inter for UI, as the closest free
analogue to SF Pro. Noto Serif Bengali for Bangla, set at 1.7 line-height
because Bangla needs ~15% more leading than Latin at the same size.

## Motion

Slow and precise. 0.9–1.8s, `cubic-bezier(0.22, 1, 0.36, 1)`, no bounce.

**No two video sections use the same mechanic.** Masked reveal, scrub, scrub,
parallax pair, drifting loop, held loop. Giving all eight clips one treatment is
how a technique stops being a choice and becomes a template.

**`ScrubVideo`** is the centrepiece: scroll position drives `video.currentTime`
rather than the clip playing on its own, so the reader controls the footage.
Four things make it work:

1. Clips are encoded `-movflags +faststart` with a **GOP of 4**
   (`tools/build-media.py`). A normal 2-second GOP makes seeking visibly stutter.
2. The frame is held with CSS `position: sticky`, **not** GSAP `pin`. Pinning
   clones the element into a generated spacer and measures the document at build
   time — and because the trigger can only be created once video metadata has
   loaded, it always measured late and left an empty spacer rendering as a black
   band. Sticky has no spacer and cannot desync from the smooth-scroll layer.
3. Seeks are eased toward the target in one rAF loop, not assigned per scroll
   event — raw per-event seeking swamps the decoder and drops frames.
4. H.264 only for scrubbed clips. VP9 seeking is markedly worse in Safari.

`reveal` opens the frame as the scrub begins: the clip appears through a mask
that grows from a tall arch to full bleed. The **mask** moves, never the video —
scaling the footage to reveal it costs resolution at exactly the moment the
viewer is looking hardest. A counter-inset wrapper holds the image still in
stage coordinates while the window over it grows.

**`AmbientVideo`** is the looping counterpart, and the reason eight clips on one
page is affordable: `preload="none"` still downloads as soon as `src` is set, so
`src` itself is withheld until an `IntersectionObserver` says the element is
within a screen of the viewport. Scrolling the whole page fetches everything;
landing on it fetches one clip. It prefers VP9 where the browser reports it can
play it (diya: 268KB vs 451KB) — safe here because nothing seeks.

**One frame loop, split in two phases, driven in the right order.**
`lib/ticker.ts` is the only `requestAnimationFrame` on the page, and three
things about it matter:

1. **Read phase, then write phase.** `getBoundingClientRect()` after something
   else has written a transform forces the browser to flush layout before it can
   answer. A loop that goes read, write, read, write across a dozen elements
   pays a forced synchronous layout per element; running every `measure` first
   and every `apply` second pays one.
2. **Pumped from `gsap.ticker`, immediately after Lenis.** Lenis writes the
   scroll position from inside that ticker. A second, independent rAF would
   sometimes read positions from the frame before Lenis updated them — a
   one-frame lag between the page moving and the parallax responding, which is
   precisely what "not quite smooth" feels like. `SmoothScroll` calls
   `setDriven(true)` and adds `pump` after Lenis; with no smooth-scroll layer
   the loop drives itself.
3. **Subscriptions are gated on proximity.** `subscribeNear` adds an effect only
   while an IntersectionObserver says it is within 40% of the viewport. An IO
   costs nothing per frame — it is the browser's own bookkeeping — so this turns
   "every scroll-linked element measures itself 60 times a second" into "the two
   or three in play do".

Measured over four seconds of wheel input at 1440×900, before and after: five
separate rAF loops per frame → one, and 95th-percentile frame time **50ms → 16.7ms**
(three dropped frames → none). Three `ScrubVideo` instances were each polling
their own rect every frame for sections up to fifteen thousand pixels away.

**`will-change` is set on the way in and cleared on resolve.** There are ~40
reveals on this page. A `will-change` that is never released is a compositor
layer that is never released, and declaring it in CSS on `[data-reveal]` meant
all forty were promoted for the life of the page.

**Entrances are scroll-linked, not triggered.** `Reveal` maps an element's live
position in the viewport onto its own opacity and offset every frame, so
scrolling slowly resolves it slowly and flicking snaps it up. A triggered reveal
plays the same fixed 1s animation however you arrive, and repeated across every
section that is the signature of a template. Progress **latches at its maximum**
and the element unsubscribes the moment it resolves — which keeps the
steady-state cost at zero, and stops content anchored inside a sticky frame
(where the rect stops moving once the frame pins) being stranded at 84% opacity.

Headlines keep the triggered per-line stagger (`SplitLines`). A headline is a
typographic performance; body copy is not.

**Lenis runs in `lerp` mode, not `duration`.** In duration mode every wheel
event starts a fresh ~1s tween to a new target, so a continuous scroll is a
chain of restarts and the velocity profile is uneven — it reads as slightly
rubbery. `lerp: 0.09` is one exponential decay toward a target that keeps
moving. Lower is heavier.

**Scrubbing is a desktop enhancement.** Touch gets a plain looping video and
discrete `IntersectionObserver` reveals, because mid-range Android stutters on
scroll-linked animation and stutter reads as broken, not premium. Smooth scroll
and parallax are desktop-only for the same reason — native momentum beats
anything synthesised.

Everything degrades: no-JS, `prefers-reduced-motion`, and `save-data`/2G each
leave a complete, shoppable page. Under save-data no video downloads at all and
posters carry the sections. Much of this audience is on mid-range Android over
4G in Dhaka.

## Video

Eight Veo clips, 7.7MB total, and **all eight are on the homepage** — one per
chapter, with the hero holding the eighth before the count starts. Two needed
trimming: Veo inserted hard cuts into **01-hero** (~4.5s; the necklace becomes a
different piece after) and **04-atelier** (~1.75s) despite the prompt asking for
one continuous take. The trims live in `CLIPS` in `tools/build-media.py`.

04-atelier is only **2.0s** after the trim, which is why its scrub track is
shorter than the others (2.2× viewport, against 2.6–2.9×). A longer track slows
the dolly to a crawl and makes the seek quantisation visible.

**Clip 08 was not the brief.** It was prompted as an abstract ground to sit
behind the logo; Veo returned a lit diya. It has a subject so it can't hold a
mark — but it's the most quietly Bengali frame in the set, and a lamp is the
right image to end a story on, so it closes the page as chapter ০৭. The logo is
never generated.

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
- Shop, product and editorial pages are not built yet. The homepage and
  `/about` are; everything else the nav points at is still Odoo's.
- `npm run lint` does not work. `next lint` was removed in Next 16 and there
  is no `eslint.config.js` in the repo, so the script fails whichever way it
  is run. ESLint needs configuring before it can be part of the loop.
