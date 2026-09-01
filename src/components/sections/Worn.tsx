import { AmbientVideo } from "@/components/motion/AmbientVideo";
import { Parallax } from "@/components/motion/Parallax";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { Verse } from "@/components/ui/Verse";
import { chapter, verses } from "@/data/story";

const panels = [
  {
    src: "/video/jasmine.mp4",
    webm: "/video/jasmine.webm",
    poster: "/video/jasmine-poster.webp",
    bn: "খোঁপার কাঁটা",
    rom: "Khopar Kata",
    en: "The hairpin",
    note: "Gold set into the bun, ringed with jasmine. Nazrul put star-flowers there first.",
    href: "/shop/category/hairpiece-khopar-kata-22",
    drift: -46,
  },
  {
    src: "/video/nupur.mp4",
    webm: "/video/nupur.webm",
    poster: "/video/nupur-poster.webp",
    bn: "নূপুর",
    rom: "Nupur",
    en: "The anklet",
    note: "The only ornament that speaks. She is heard down the corridor before she is seen.",
    href: "/shop/category/foot-jewelry-nupur-32",
    drift: 52,
  },
] as const;

/**
 * ০৫ · পরা — the wearing.
 *
 * Two clips, both 9:16 macro, both about three seconds. Cutting between them
 * would waste them; running them side by side at different heights and
 * different scroll speeds turns two short loops into one composition with
 * depth. The verse sits in the gap and holds the two together — the hairpin
 * clip is literally the image in Nazrul's line.
 *
 * These loop rather than scrub. A three-second macro has no narrative to
 * scrub through, and giving every video section the same mechanic is how a
 * technique stops being a choice and becomes a template.
 */
export function Worn() {
  return (
    <section id="pora" className="relative overflow-hidden bg-ink">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={chapter.pora} />

        {/* Headline and argument sit side by side rather than stacked: the
            diptych below is symmetrical, and an opening that runs down one
            column leaves the right half of the screen empty above it. */}
        <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-24">
          <SplitLines
            as="h2"
            className="t-display max-w-[16ch]"
            lines={["Not displayed.", "Worn."]}
          />
          <Reveal delay={120}>
            <p className="t-body-lg max-w-[46ch] text-text-on-ink-dim md:pb-3">
              Bengali ornament is positional — every piece belongs to one part
              of the body and to nowhere else. The hair, the throat, the waist,
              the ankle. Knowing where a thing goes is most of knowing what it
              is.
            </p>
          </Reveal>
        </div>

        <div className="mt-20 grid items-center gap-16 md:mt-28 md:grid-cols-[1fr_minmax(280px,1.05fr)_1fr] md:gap-12 lg:gap-20">
          <Panel {...panels[0]} />

          <Verse verse={verses.pora} className="mx-auto md:px-2" />

          <Panel {...panels[1]} />
        </div>
      </div>
    </section>
  );
}

function Panel({
  src,
  webm,
  poster,
  bn,
  rom,
  en,
  note,
  href,
  drift,
}: (typeof panels)[number]) {
  return (
    <Parallax as="figure" y={drift} className="group">
      <a href={href} className="block">
        <div className="relative aspect-[9/14] overflow-hidden rounded-[20px] bg-ink-soft">
          <AmbientVideo
            src={src}
            webm={webm}
            poster={poster}
            className="transition-transform duration-[1200ms] [transition-timing-function:var(--ease-out-apple)] group-hover:scale-[1.05]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,.55),transparent_45%)]"
          />
        </div>

        <figcaption className="mt-6">
          <p className="t-bangla text-[clamp(1.3rem,2.4vw,1.8rem)] leading-none text-text-on-ink transition-colors duration-500 group-hover:text-gold">
            {bn}
          </p>
          <p className="t-eyebrow mt-3 text-text-on-ink-dim">
            {rom}
            <span aria-hidden="true" className="mx-2 opacity-40">
              ·
            </span>
            {en}
          </p>
          <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-text-on-ink-dim">
            {note}
          </p>
        </figcaption>
      </a>
    </Parallax>
  );
}
