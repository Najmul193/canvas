import type { Chapter } from "@/data/story";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

type Props = {
  chapter: Chapter;
  tone?: "ink" | "bone";
  className?: string;
};

/**
 * The chapter mark: a hairline, a Bangla numeral, a Bangla name.
 *
 * This is the device that turns seven sections into seven chapters. It is
 * deliberately tiny — the count and the rule do the work, and the moment the
 * mark competes with the headline beneath it the page stops feeling composed.
 *
 * Bangla numerals, not Latin ones. If the taxonomy is going to be in Bangla
 * first, the counting has to be too, or the Bangla reads as ornament.
 */
export function ChapterMark({ chapter, tone = "ink", className }: Props) {
  const dim = tone === "ink" ? "text-text-on-ink-dim" : "text-text-on-bone-dim";
  const rule = tone === "ink" ? "bg-rule-on-ink" : "bg-rule-on-bone";
  const gold = tone === "ink" ? "text-gold" : "text-gold-deep";

  return (
    <Reveal className={cn("flex items-center gap-4 md:gap-6", className)}>
      <span
        aria-hidden="true"
        className={cn("t-bangla text-[15px] leading-none tabular-nums", gold)}
      >
        {chapter.num}
      </span>
      <span aria-hidden="true" className={cn("h-px w-10 shrink-0 md:w-16", rule)} />
      <span className={cn("t-bangla text-[17px] leading-none md:text-[19px]", gold)}>
        {chapter.bn}
      </span>
      <span className={cn("t-eyebrow", dim)}>
        {chapter.rom}
        <span aria-hidden="true" className="mx-2 opacity-40">
          ·
        </span>
        {chapter.en}
      </span>
    </Reveal>
  );
}
