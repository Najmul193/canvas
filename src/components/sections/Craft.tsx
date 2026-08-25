"use client";

import { ScrubVideo } from "@/components/motion/ScrubVideo";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Penciled Precious — the drawing.
 *
 * The previous build cross-faded a sketch into a photograph of the finished
 * piece. Two unrelated images at half opacity always read as a rendering
 * fault, never as a transition. This instead pins the section and scrubs the
 * footage frame by frame, so the reader drives one continuous shot. Same
 * story, no ghosting.
 */
export function Craft() {
  return (
    <section className="relative bg-ink">
      <div className="shell py-24 text-center md:py-32">
        <Reveal>
          <p className="t-eyebrow text-gold">Penciled Precious</p>
        </Reveal>
        <SplitLines
          as="h2"
          className="t-display mx-auto mt-6 max-w-[16ch]"
          lines={["From graphite", "to gold."]}
        />
        <Reveal delay={120}>
          <p className="t-body-lg mx-auto mt-7 max-w-[46ch] text-text-on-ink-dim">
            Every piece begins as a drawing. Nothing is bought in, nothing is
            copied — the line comes first, then the metal.
          </p>
        </Reveal>
      </div>

      <ScrubVideo
        src="/video/sketch.mp4"
        poster="/video/sketch-poster.webp"
        scrollLength={2.2}
        className="relative h-[100svh] w-full overflow-hidden"
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
