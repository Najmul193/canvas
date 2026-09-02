import Image from "next/image";
import { ChapterMark } from "@/components/ui/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { aboutSection, hand } from "@/data/about";

/**
 * ০৩ হাত — the drawing that starts a piece.
 *
 * The design sheets are the strongest evidence on this page and the only
 * assets that prove the claim rather than asserting it: an about page can say
 * "drawn by hand" in any typeface, and the sheet showing the repeat worked out
 * at full size is the thing that settles it. So they are shown at size, in a
 * row, captioned with what each one actually is — a caption that says
 * "craftsmanship" would waste them.
 *
 * The frames use the sheets' own 1047×1920 ratio rather than a tidy 2:3.
 * Cropping a technical drawing to make a grid line up cuts off the part that
 * carries the argument.
 */
export function Hand() {
  const mark = aboutSection.haat;

  return (
    <section id={mark.id} className="bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={mark} tone="bone" />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.05fr_1fr] md:gap-20">
          <SplitLines as="h2" className="t-display" lines={[...hand.lines]} />
          <Reveal delay={140}>
            <p className="max-w-[52ch] text-text-on-bone-dim md:pt-3">{hand.body}</p>
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-20 md:grid-cols-3 md:gap-x-8">
          {hand.sheets.map((sheet, i) => (
            <Reveal as="li" key={sheet.img} delay={i * 110}>
              <div className="relative aspect-[1047/1920] overflow-hidden rounded-2xl bg-bone-sink">
                <Image
                  src={`/media/${sheet.img}-1080.webp`}
                  alt={sheet.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-text-on-bone-dim">
                {sheet.caption}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
