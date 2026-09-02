import { ChapterMark } from "@/components/ui/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { aboutSection, house, pillars } from "@/data/about";

/**
 * ০১ ঘর — what the house is.
 *
 * The three pillars underneath are the only place this page is allowed to be
 * terse. Everything a brand wants to claim about itself compresses into a
 * short row like this, and the compression is what stops it reading as a
 * mission statement.
 */
export function House() {
  const mark = aboutSection.ghor;

  return (
    <section id={mark.id} className="bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={mark} tone="bone" />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.05fr_1fr] md:gap-20">
          <div>
            <SplitLines as="h2" className="t-display" lines={[...house.lines]} />
            <Reveal delay={130}>
              <p className="t-body-lg mt-8 max-w-[32ch]">{house.lede}</p>
            </Reveal>
          </div>

          <div className="max-w-[52ch] space-y-6 md:pt-3">
            {house.body.map((para, i) => (
              <Reveal key={i} delay={170 + i * 90}>
                <p className="text-text-on-bone-dim">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <ul className="mt-20 grid gap-10 md:mt-28 md:grid-cols-3 md:gap-14">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.rom} delay={i * 100}>
              <span aria-hidden="true" className="block h-px w-full bg-rule-on-bone" />
              <p className="t-bangla mt-6 text-[19px] leading-none text-gold-deep">{p.bn}</p>
              <p className="t-eyebrow mt-3">{p.rom}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-text-on-bone-dim">
                {p.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
