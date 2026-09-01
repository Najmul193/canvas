import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { Parallax } from "@/components/motion/Parallax";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { Verse } from "@/components/ui/Verse";
import { chapter, verses } from "@/data/story";
import { vocabulary } from "@/data/site";

const facts = [
  { k: "Metal", v: "Brass and sterling silver" },
  { k: "Made", v: "By hand, Gulshan-1, Dhaka" },
  { k: "Run", v: "Small — most pieces once" },
];

/**
 * ০৪ · সোনা — the gold.
 *
 * Written on bone, then dropped into the dark. That fall is the point: the
 * page is at its brightest one screen before the velvet case opens, and the
 * contrast does more for the metal than any amount of gold in the palette
 * would. It is also why gold is a hairline here and never a fill.
 *
 * The argument is set to the verse rather than the other way round. সোনার তরী
 * ends with the boat taking the harvest and leaving the man who grew it, so
 * this chapter is about the work leaving — into a box in somebody else's
 * house, to be consulted by people the maker will never meet. An earlier draft
 * headed it "Kept, not stored", which is the buyer's side of the same object
 * and left the couplet underneath it saying the opposite.
 *
 * The clip is a lateral dolly, so the type over it drifts the other way. Two
 * planes crossing is the cheapest honest depth cue there is.
 */
export function Atelier() {
  return (
    <section id="shona" className="relative bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={chapter.shona} tone="bone" />

        {/* Centred, not top-aligned: the headline runs to four lines of display
            type and the verse is barely a third of that, so aligning their tops
            left the right column hanging over 400px of empty bone. */}
        <div className="mt-10 grid gap-14 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-24">
          <div>
            <SplitLines
              as="h2"
              className="t-display max-w-[14ch]"
              lines={["We keep", "the drawing.", "You keep", "the piece."]}
            />
            <Reveal delay={120}>
              <p className="t-body-lg mt-8 max-w-[46ch] text-text-on-bone-dim">
                Everything we make leaves. It goes into a box in somebody's
                house — the box that outlives the house — and it is taken out
                and put back for forty years by people we will never meet.
                That, and not the sale, is the brief we design against.
              </p>
            </Reveal>

            <dl className="mt-12 border-t border-rule-on-bone">
              {facts.map((f, i) => (
                <Reveal key={f.k} delay={160 + i * 90}>
                  <div className="flex items-baseline gap-6 border-b border-rule-on-bone py-4">
                    <dt className="t-eyebrow w-24 shrink-0 text-text-on-bone-dim">
                      {f.k}
                    </dt>
                    <dd className="text-[15px]">{f.v}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>

          <Verse verse={verses.shona} tone="bone" />
        </div>
      </div>

      {/* 2.0s of footage. A longer track here only slows the dolly to a crawl
          and makes the seek quantisation visible. */}
      <ScrubVideo
        src="/video/atelier-case.mp4"
        poster="/video/atelier-case-poster.webp"
        track={2.2}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.55)_0%,transparent_28%,transparent_58%,rgba(0,0,0,.88)_100%)]"
        />

        <div className="pointer-events-none absolute inset-x-0 top-[13svh]">
          <div className="shell">
            <p className="t-eyebrow text-gold">The case</p>
          </div>
        </div>

        {/* Counter-drift. Wider than the viewport on purpose — the row must
            never run out of words mid-travel. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-[22svh] overflow-hidden"
        >
          <Parallax x={-220} className="flex w-max gap-10 whitespace-nowrap px-[10vw]">
            {[...vocabulary, ...vocabulary].map((v, i) => (
              <span
                key={`${v.rom}-${i}`}
                className="t-verse-sm text-white/25"
              >
                {v.bn}
              </span>
            ))}
          </Parallax>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="shell flex flex-wrap items-baseline justify-between gap-4 pb-10">
            <p className="t-headline max-w-[20ch] text-text-on-ink">
              It came out of a box like this one. It goes back into one.
            </p>
            <p className="t-eyebrow text-white/50">Scroll</p>
          </div>
        </div>
      </ScrubVideo>
    </section>
  );
}
