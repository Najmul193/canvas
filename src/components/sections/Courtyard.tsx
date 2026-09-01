import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { Verse } from "@/components/ui/Verse";
import { chapter, verses } from "@/data/story";

/**
 * ০১ · মাটি — the soil.
 *
 * The first chapter has one job: establish that this is a place before it is a
 * shop. So the section opens closed — the footage is revealed through a mask
 * that grows from a tall arch, the shape of every old Dhaka doorway, into full
 * bleed. Scroll opens the door, then scrubs the shot behind it.
 *
 * The arch is masked, never scaled. Scaling the video to reveal it costs
 * resolution at exactly the moment the viewer is looking hardest.
 */
export function Courtyard() {
  return (
    <section id="mati" className="relative bg-ink">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={chapter.mati} />
        <SplitLines
          as="h2"
          className="t-display mt-10 max-w-[15ch]"
          lines={["Before it is", "an ornament,", "it is a place."]}
        />
        <Reveal delay={140}>
          <p className="t-body-lg mt-8 max-w-[48ch] text-text-on-ink-dim">
            Weathered walls, late light, the particular unhurried afternoon of an
            old courtyard. Every form Canvas makes was worn here first, by
            somebody's grandmother, for a reason nobody had to explain.
          </p>
        </Reveal>
      </div>

      <ScrubVideo
        src="/video/courtyard.mp4"
        poster="/video/courtyard-poster.webp"
        track={2.9}
        reveal
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.45)_0%,transparent_30%,transparent_46%,rgba(0,0,0,.82)_100%)]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <div className="shell pb-14 md:pb-20">
            <Verse verse={verses.mati} />
          </div>
        </div>
      </ScrubVideo>
    </section>
  );
}
