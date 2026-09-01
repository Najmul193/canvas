import { AmbientVideo } from "@/components/motion/AmbientVideo";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterMark } from "@/components/ui/Chapter";
import { FigureNote } from "@/components/ui/Verse";
import { chapter, figures } from "@/data/story";

/**
 * ০৭ · স্মৃতি — what remains. The diya band, and the last chapter.
 *
 * This clip was generated as an abstract backdrop for the logo; Veo returned a
 * lit diya instead. It has a subject, so it can't sit behind a mark — but it
 * is the most quietly Bengali frame in the whole set, and a lamp is the right
 * image to end a story on. It closes the page instead.
 *
 * The kantha note beneath it is the argument the whole scroll has been making:
 * the thing is made to be handed on. Everything after this is commerce.
 */
export function Ambient() {
  return (
    <section id="smriti" className="relative bg-ink">
      <div className="relative grid min-h-[78svh] place-items-center overflow-hidden py-24">
        <AmbientVideo
          src="/video/diya.mp4"
          webm="/video/diya.webm"
          poster="/video/diya-poster.webp"
          className="absolute inset-0"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

        <div className="shell relative text-center">
          <ChapterMark chapter={chapter.smriti} className="justify-center" />
          <p className="t-eyebrow mt-10 text-gold">Made in Bangladesh</p>
          <SplitLines
            as="h2"
            className="t-headline mx-auto mt-6 max-w-[22ch]"
            lines={["Every piece tells a story.", "Some become history."]}
          />
        </div>
      </div>

      <div className="shell grid gap-14 border-t border-rule-on-ink py-24 md:grid-cols-2 md:gap-24 md:py-32">
        <FigureNote figure={figures.smriti} />

        <Reveal delay={140} className="md:pt-4">
          <p className="t-headline max-w-[18ch]">
            The best thing we can be told is that it was given away.
          </p>
          <p className="mt-8 max-w-[48ch] text-text-on-ink-dim">
            Brass darkens. Silver takes a patina. Neither is a fault — they are
            how an object records the years it spent being worn, and they are
            the reason a piece looks better on the second person than it did on
            the first.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
