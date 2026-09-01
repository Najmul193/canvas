import { AmbientVideo } from "@/components/motion/AmbientVideo";
import { Parallax } from "@/components/motion/Parallax";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { chapter, figures } from "@/data/story";
import { routes } from "@/data/site";

const din = figures.din;

/**
 * ০৬ · দিন — the day.
 *
 * The one symmetrical composition on the page. Every other chapter is set
 * hard to a left margin; this one is centred, because a wedding is the one
 * occasion the whole thing is actually built around and the page should stop
 * being clever for a screen and let the footage carry it.
 *
 * The clip loops rather than scrubbing, and drifts against the scroll. Giving
 * the bride a scrub bar would put the reader in charge of her, which is the
 * wrong relationship for this frame.
 */
export function Bridal() {
  return (
    <section
      id="din"
      className="relative grid min-h-[104svh] place-items-center overflow-hidden bg-ink"
    >
      {/* Oversized so the drift never exposes an edge. */}
      <Parallax y={70} className="absolute -inset-y-[8%] inset-x-0">
        <AmbientVideo
          src="/video/bridal.mp4"
          webm="/video/bridal.webm"
          poster="/video/bridal-poster.webp"
          position="50% 35%"
        />
      </Parallax>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,.35)_0%,rgba(0,0,0,.72)_58%,rgba(0,0,0,.92)_100%)]"
      />

      <div className="shell relative py-28 text-center md:py-36">
        <ChapterMark chapter={chapter.din} className="justify-center" />

        <p className="t-verse mt-12 text-text-on-ink">{din.bn}</p>
        <p className="t-eyebrow mt-4 text-gold">{din.rom}</p>
        <p className="mx-auto mt-3 max-w-[30ch] text-[14px] text-text-on-ink-dim">
          {din.gloss}
        </p>

        <SplitLines
          as="h2"
          className="t-display mx-auto mt-14 max-w-[15ch]"
          lines={["What she wears", "that afternoon,", "she keeps."]}
        />

        <Reveal delay={160}>
          <p className="t-body-lg mx-auto mt-8 max-w-[44ch] text-text-on-ink-dim">
            {din.line}
          </p>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a
              href="/shop/category/bridal-jewelry-65"
              className="rounded-full bg-berry px-8 py-4 text-[13px] font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-berry-deep"
            >
              The bridal collection
            </a>
            <a
              href={routes.custom}
              className="rounded-full border border-white/25 px-8 py-4 text-[13px] font-semibold tracking-wide text-text-on-ink transition-colors duration-300 hover:border-white/60"
            >
              Commission for a wedding
            </a>
          </div>
        </Reveal>

        <Reveal delay={340}>
          <p className="mx-auto mt-14 max-w-[46ch] text-[13px] leading-relaxed text-text-on-ink-dim">
            {din.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
