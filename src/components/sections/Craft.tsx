import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { FigureNote } from "@/components/ui/Verse";
import { chapter, figures } from "@/data/story";

/**
 * ০৩ · রেখা — the line. Penciled Precious, the drawing.
 *
 * An earlier build cross-faded a sketch into a photograph of the finished
 * piece. Two unrelated images at half opacity always read as a rendering
 * fault, never as a transition. This instead pins the section and scrubs the
 * footage frame by frame, so the reader drives one continuous shot. Same
 * story, no ghosting.
 *
 * The alpona note beside it is the local version of the same idea, and it is
 * the reason this chapter sits third rather than first: in Bengal the line
 * always precedes the occasion.
 */
export function Craft() {
  return (
    <section id="rekha" className="relative bg-ink">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={chapter.rekha} />

        <div className="mt-10 grid gap-14 md:grid-cols-[1.15fr_1fr] md:gap-24">
          <div>
            <p className="t-eyebrow text-gold">Penciled Precious</p>
            <SplitLines
              as="h2"
              className="t-display mt-5 max-w-[13ch]"
              lines={["From graphite", "to gold."]}
            />
            <Reveal delay={120}>
              <p className="t-body-lg mt-8 max-w-[46ch] text-text-on-ink-dim">
                Every piece begins as a drawing. Nothing is bought in, nothing
                is copied — the line comes first, then the metal. A sketch that
                does not survive the pencil never reaches the bench.
              </p>
            </Reveal>
          </div>

          <FigureNote figure={figures.rekha} className="md:pt-6" />
        </div>
      </div>

      <ScrubVideo
        src="/video/sketch.mp4"
        poster="/video/sketch-poster.webp"
        track={2.6}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.5)_0%,transparent_22%,transparent_70%,rgba(0,0,0,.7)_100%)]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="shell flex flex-wrap items-baseline justify-between gap-4 pb-10">
            <p className="t-eyebrow text-gold">The drawing</p>
            <p className="t-eyebrow text-white/60">Scroll</p>
          </div>
        </div>
      </ScrubVideo>
    </section>
  );
}
