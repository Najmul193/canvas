import Image from "next/image";
import { ChapterMark } from "@/components/ui/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { PullQuote } from "@/components/ui/Verse";
import { aboutSection, founder } from "@/data/about";
import { site } from "@/data/site";

/**
 * ০৪ নকশাকার — the designer.
 *
 * The homepage carries a three-line version of this with the same portrait, so
 * the two have to be told apart at a glance or the reader arriving from
 * "Read our story" gets the same card again. The homepage sets it on bone as a
 * quotation with a short gloss; this is on ink, and it is the bio the
 * quotation was standing in for.
 *
 * The portrait is capped at 400px because 587×587 is the largest source that
 * exists — `brand/source/manifest.json` flags it for a reshoot, and until then
 * the honest thing is to set it small rather than upscale it into a column it
 * cannot fill.
 */
export function Founder() {
  const mark = aboutSection.nokshakar;

  return (
    <section id={mark.id} className="bg-ink">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={mark} tone="ink" />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[minmax(240px,400px)_1fr] md:gap-20">
          <div>
            <Reveal>
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-ink-soft">
                <Image
                  src="/media/founder-tanwy-kabir-640.webp"
                  alt={`${site.founder.name}, founder of Canvas`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={110}>
              <p className="t-bangla mt-7 text-xl">{site.founder.nameBn}</p>
              <p className="t-eyebrow mt-2 text-text-on-ink-dim">
                {site.founder.name}
                <span aria-hidden="true" className="mx-2 opacity-40">
                  ·
                </span>
                {site.founder.role}
              </p>
            </Reveal>

            <PullQuote
              text={founder.credo.text}
              attribution={founder.credo.attribution}
              tone="ink"
              size="sm"
              className="mt-12"
            />
          </div>

          <div className="md:pt-3">
            <SplitLines as="h2" className="t-display" lines={[...founder.lines]} />
            <div className="mt-8 max-w-[52ch] space-y-6">
              {founder.body.map((para, i) => (
                <Reveal key={i} delay={150 + i * 90}>
                  <p className="text-text-on-ink-dim">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
