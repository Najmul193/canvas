# Canvas — video generation prompts

For **Google Flow (Veo)**, image-to-video. Eight clips for the redesigned site.

Each numbered folder holds its `SOURCE` still. Upload that still to Flow, paste the
matching prompt, paste the negative prompt, generate. Drop takes back into the same folder.

---

## Before you generate — read this

**These must not look animated.** The failure mode with AI video on jewellery is not
"slightly off" — it is a plastic, over-smooth, faintly cartoon look that instantly reads
as fake, and on a page selling ৳22,500 handcrafted pieces that destroys trust.

Three rules that produce industry-grade footage instead:

**1. Every prompt names a real camera, lens and stock.** Naming physical equipment pulls
the model toward live-action cinematography and away from illustration and 3D render. All
eight prompts below do this. Don't strip it out to shorten them.

**2. The jewellery never moves.** AI video invents and smears fine metal between frames —
chain links merge, filigree crawls, engraving rewrites itself. It is the one unforgivable
artefact here, because the customer is buying that exact object. So the camera, fabric,
light and air move; the piece stays rigid. Every prompt states this explicitly.

**3. Skin must keep its texture.** "Visible skin texture and pores, natural skin tone" is
in every prompt with a person. Without it Veo renders waxy, poreless skin — the single
biggest tell of AI footage.

**Settings:** 1080×1920 vertical unless noted. **3–5 seconds.** Longer clips drift and
degrade. Generate 4–6 takes per prompt and expect to reject most.

---

## Shared negative prompt

Paste into Flow's negative prompt field for **every** clip.

```
cartoon, anime, illustration, painting, drawing, 3D render, CGI, video game,
animation, stylized, plastic skin, waxy skin, poreless skin, airbrushed,
smooth blurry face, distorted face, deformed hands, extra fingers,
morphing jewelry, warping metal, melting jewelry, changing necklace shape,
flickering detail, oversaturated, HDR glow, neon, harsh contrast,
text, watermark, logo, subtitles, captions, split screen, jump cut,
fast zoom, whip pan, shaky camera, slow motion ramp, time lapse
```

---

## 01 — Hero, arch reveal

`01-hero-arch-reveal/SOURCE.jpg` · **3–5s** · 1080×1920, also crop 16:9 for desktop

```
Photorealistic live-action footage. A woman in a black sleeveless dress wearing an
ornate antique gold collar necklace stands before dark tropical foliage at dusk.
The camera pushes in extremely slowly on a locked dolly, no more than a few
centimetres over the whole shot. She breathes; one strand of hair drifts in a faint
breeze; the leaves behind her sway gently. Warm gold rim-light grazes the metal as
the camera moves. The necklace holds its exact shape and position throughout,
completely rigid, no deformation. Natural visible skin texture and pores, realistic
skin tone. Deep shadows, low-key chiaroscuro lighting, shallow depth of field.
Shot on ARRI Alexa, 35mm anamorphic prime, fine 35mm film grain. Single continuous
take, no cuts.
```

Primary hero. The arch mask animates over this in CSS — the footage itself is full-frame.

---

## 02 — Olive courtyard

`02-olive-courtyard/SOURCE.jpg` · **4s** · 1080×1920

```
Photorealistic live-action footage. A woman in a deep magenta silk saree sits in an
old courtyard with weathered olive-green painted walls, warm late-afternoon light
falling from the left. The silk catches the light and shifts subtly as she settles.
Dust motes drift slowly through the light shaft. The camera rises a few centimetres
on a locked vertical axis, very slow. Her jewellery stays perfectly stable and
unchanged. Natural visible skin texture and pores. Warm painterly light, deep olive
and berry tones, unhurried. Shot on ARRI Alexa, 50mm prime, natural available light,
fine film grain. Single continuous take, no cuts.
```

Section transition where the ground shifts to deep olive.

---

## 03 — Penciled Precious

`03-penciled-precious/SOURCE.jpg` · **4–5s** · 16:9 landscape

```
Photorealistic live-action footage. Overhead locked shot of a detailed pencil sketch
of an ornate crescent hasuli necklace on textured cotton paper, a graphite pencil
resting beside it. The camera pushes in slowly and rotates two or three degrees.
Soft directional light moves gently across the paper, raising the grain and tooth of
the surface. Graphite catches the light with a faint sheen. The drawing itself does
not change, redraw, or animate — it is a static object being filmed. Quiet,
reverent, documentary. Shot on RED Komodo, 60mm macro, natural window light,
subtle film grain. Single continuous take, no cuts, no hands in frame.
```

The strongest storytelling moment on the site — sketch dissolving into the finished
piece, scrubbed by scroll. **Reject any take where the drawing draws itself.** That
effect is a cliché and it will read as a gimmick.

---

## 04 — Atelier, the case

`04-atelier-case/SOURCE.jpg` · **4s** · 16:9 landscape

```
Photorealistic live-action footage. Slow lateral dolly across an open wooden jewellery
box lined with deep red velvet, filled with antique gold Bengali necklaces and bangles.
Warm low-key light rakes across the metal as the camera travels, so highlights bloom
and fade along the surfaces. Velvet pile and wood grain hold fine texture. Every piece
stays exactly in place, rigid and unchanged. Chiaroscuro, candle-warm colour, macro
depth of field. Shot on RED Komodo, 50mm macro, practical tungsten light, fine film
grain. Single continuous take, no cuts, no hands in frame.
```

Lateral moves reveal metal without deforming it — the safest camera choice for a frame
this full of jewellery.

---

## 05 — Macro, jasmine and gold

`05-macro-jasmine/SOURCE.png` · **3–4s** · 1080×1920

```
Photorealistic live-action macro footage. Extreme close-up of a golden leaf hairpiece
set into a dark braided bun, encircled by a garland of fresh white jasmine flowers.
Focus racks gently from the jasmine petals in the foreground to the gold leaf behind.
One petal trembles very slightly in still air. Warm soft window light. The hairpiece
is rigid and unchanged throughout. Individual hair strands and petal veins stay sharp
and detailed. Shot on RED Komodo, 100mm macro lens, T2.8, creamy natural bokeh, fine
film grain. Single continuous take, no cuts.
```

The one clip that can carry a focus rack — the organic subject beside the metal gives
the model something safe to move.

---

## 06 — Bridal

`06-bridal/SOURCE.jpg` · **4s** · 1080×1920

```
Photorealistic live-action footage. A Bengali bride in a deep red benarasi saree and
layered antique gold jewellery sits among marigold flowers in warm lamplight. She turns
her head very slightly and lowers her eyes. Her veil settles softly. Lamplight flickers
gently across the gold. All jewellery holds its exact form, completely rigid. Natural
visible skin texture and pores, realistic warm skin tone. Rich reds and golds, low-key
painterly lighting, deep shadow. Shot on ARRI Alexa, 85mm prime, practical oil-lamp
light, fine 35mm film grain. Single continuous take, no cuts.
```

Bridal landing page. **Keep the head-turn small** — larger movement distorts the necklace.

---

## 07 — Nupur

`07-nupur/SOURCE.png` · **3s** · 1080×1920

```
Photorealistic live-action macro footage. Close shot of an ornate gold nupur anklet on
a foot resting on cool stone, red silk saree fabric pooled around it. The silk shifts
and settles very slightly. Warm light moves slowly across the stone surface. The anklet
stays completely still and unchanged. Skin texture natural and detailed, stone grain
visible. Intimate, warm, shallow depth of field. Shot on RED Komodo, 85mm macro,
natural window light, fine film grain. Single continuous take, no cuts.
```

Category header for **নূপুর**. Three seconds is enough — don't extend it.

---

## 08 — Logo backdrop

`08-logo-backdrop/SOURCE.png` · **2–3s** · square, seamless loop

**Do not generate video from the logo.** Veo will deform the mark — the arch will
breathe, the rose will crawl. Animate the real transparent PNG in After Effects or CSS.

Generate only the backdrop it sits on:

```
Photorealistic abstract background. Deep olive-black surface with faint warm gold light
slowly blooming outward from the centre, like candlelight falling on dark raw silk.
Very subtle drifting texture and soft light falloff. No objects, no faces, no hands, no
text, no logos, no symbols. Slow, elegant, minimal. Shot on ARRI Alexa, 50mm, shallow
focus, fine film grain. Seamless loop, single continuous take.
```

Composite `assets/01-brand/logo-emblem-wordmark-stacked.png` over this in post.

---

## QC checklist — run on every take before approving

Play at **full size, slowed to 0.25×**. Most artefacts are invisible at speed.

- [ ] **Metal holds shape.** Scrub frame by frame across the jewellery. Any link that
      merges, any engraved line that shifts — reject. No exceptions.
- [ ] **Skin has pores and texture.** Waxy or airbrushed means reject.
- [ ] **Hands and fingers correct** where visible. Count them.
- [ ] **Eyes and mouth stable** — no drifting features, no uncanny blink.
- [ ] **Fabric drapes with real weight.** Silk that floats like smoke is a tell.
- [ ] **No invented text, watermark or logo** anywhere in frame.
- [ ] **Loops cleanly** if it's a hero or ambient clip.
- [ ] **Colour matches the palette** — berry #8C144B, gold #DDB15B, olive #3A3B2A.
      Grade it back if Veo pushes saturation.

---

## Delivery specs

Approved clips go to `_approved/` and then get encoded for the site:

| | Desktop | Mobile |
|---|---|---|
| Resolution | 1920×1080 | 1080×1920 |
| Codec | H.264 MP4 + WebM (VP9) | same |
| **Budget** | **≤ 1.5 MB** hero | **≤ 900 KB** hero |
| Poster | WebP, ≤ 120 KB | WebP, ≤ 80 KB |

Attributes: `muted playsinline preload="none"` with a poster frame. Never autoplay on
`save-data` or 2G. A static image fallback must carry the section on its own.

Much of this audience is on a mid-range Android on 4G in Bangladesh. A 12 MB hero video
is a bounce, not a brand statement — if a clip can't meet the budget, cut the clip.
