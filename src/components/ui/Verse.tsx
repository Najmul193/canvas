import type { Figure, Verse as VerseData } from "@/data/story";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { cn } from "@/lib/cn";

type Tone = "ink" | "bone";

const tones = {
  ink: {
    text: "text-text-on-ink",
    dim: "text-text-on-ink-dim",
    rule: "bg-rule-on-ink",
    gold: "text-gold",
  },
  bone: {
    text: "text-text-on-bone",
    dim: "text-text-on-bone-dim",
    rule: "bg-rule-on-bone",
    gold: "text-gold-deep",
  },
} as const;

/**
 * An attributed quotation, Bangla first.
 *
 * The Bangla is the quotation; the English underneath is our gloss, and it is
 * credited as ours rather than presented as the poem in translation. Setting
 * the English at display size instead would quietly make the translation the
 * work and the original the footnote, which is the wrong way round on a page
 * about Bengali ornament.
 *
 * Lines are authored, not measured — see SplitLines. In verse that is not an
 * optimisation, it is the point: the break is the poet's.
 */
export function Verse({
  verse,
  tone = "ink",
  className,
}: {
  verse: VerseData;
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];

  // Sized in rem, not ch: `ch` measures the zero of the *inherited* sans
  // face, which has nothing to do with how wide these Bangla lines set.
  return (
    <figure className={cn("max-w-[36rem]", className)}>
      <blockquote>
        <SplitLines
          as="p"
          lines={verse.bn}
          stagger={140}
          className={cn("t-verse", t.text)}
        />
      </blockquote>

      <Reveal delay={220}>
        <span aria-hidden="true" className={cn("mt-8 block h-px w-12", t.rule)} />
        <p className={cn("mt-6 text-[15px] leading-relaxed", t.dim)}>“{verse.en}”</p>
        <figcaption className="mt-5">
          <span className={cn("t-bangla text-[17px]", t.gold)}>{verse.poetBn}</span>
          <span className={cn("t-eyebrow mt-1 block", t.dim)}>{verse.poet}</span>
          <span className={cn("mt-2 block text-[12px] tracking-wide", t.dim, "opacity-70")}>
            {verse.source}
          </span>
        </figcaption>
      </Reveal>
    </figure>
  );
}

/**
 * A named Bangla figure of speech, with our own sentence beside it.
 *
 * Used where the analogy belongs to a poem but the wording is ours. Keeping
 * this visually distinct from `Verse` — no quote marks, no poet's name in the
 * display position — is what stops the page from implying an attribution it
 * cannot support.
 */
export function FigureNote({
  figure,
  tone = "ink",
  className,
}: {
  figure: Figure;
  tone?: Tone;
  className?: string;
}) {
  const t = tones[tone];

  return (
    <div className={cn("max-w-[36rem]", className)}>
      <Reveal>
        <p className={cn("t-verse", t.text)}>{figure.bn}</p>
        <p className={cn("t-eyebrow mt-4", t.gold)}>{figure.rom}</p>
        <p className={cn("mt-2 text-[15px] leading-relaxed", t.dim)}>{figure.gloss}</p>
      </Reveal>
      <Reveal delay={140}>
        <span aria-hidden="true" className={cn("mt-8 block h-px w-12", t.rule)} />
        <p className={cn("t-body-lg mt-6", t.text)}>{figure.line}</p>
        <p className={cn("mt-4 text-[13px] leading-relaxed", t.dim, "opacity-80")}>
          {figure.note}
        </p>
      </Reveal>
    </div>
  );
}

/**
 * A plain attributed quotation, set large.
 *
 * The third kind, and it needs to be distinguishable from the other two at a
 * glance. `Verse` is Bangla poetry with our gloss beneath it; `FigureNote` is
 * a Bangla term with our own sentence beside it and no attribution claimed.
 * This is someone else's sentence, in English, quoted exactly — so it gets the
 * quote marks that `FigureNote` is denied and the em-dash credit that `Verse`
 * sets in Bangla. The same rule governs all three: it is here because it can
 * be attributed, and it would not be here otherwise.
 */
export function PullQuote({
  text,
  attribution,
  tone = "ink",
  /**
   * `lg` is for a quote standing on its own across a wide measure. `sm` is for
   * one sitting inside a column beside something else — at display size in a
   * 400px column a seven-word sentence sets as seven lines and takes over the
   * section it was meant to annotate.
   */
  size = "lg",
  className,
}: {
  text: string;
  attribution: string;
  tone?: Tone;
  size?: "lg" | "sm";
  className?: string;
}) {
  const t = tones[tone];

  return (
    <figure className={cn(size === "lg" ? "max-w-[30rem]" : "max-w-[26rem]", className)}>
      <Reveal>
        <span aria-hidden="true" className={cn("block h-px w-12", t.rule)} />
      </Reveal>
      <Reveal delay={90}>
        <blockquote
          className={cn("italic", size === "lg" ? "t-headline mt-8" : "t-title mt-6", t.text)}
        >
          &ldquo;{text}&rdquo;
        </blockquote>
        <figcaption className={cn("t-eyebrow", t.gold, size === "lg" ? "mt-7" : "mt-5")}>
          — {attribution}
        </figcaption>
      </Reveal>
    </figure>
  );
}
