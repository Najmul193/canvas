import Image from "next/image";
import { Enter } from "@/components/motion/Enter";
import { cn } from "@/lib/cn";

type Props = {
  /** Media stem in `public/media`, without the width suffix. */
  img: string;
  /** Empty when the image is decorative — which it is whenever the copy says the same thing. */
  alt?: string;
  eyebrow: string;
  /**
   * The Bangla line. Optional, and it should stay optional: a Bangla line that
   * only restates the English underneath it is decoration, and it reads as
   * decoration. Pass one when there is something the English cannot say.
   */
  bn?: string;
  /** Authored line breaks — see SplitLines on why these are never measured. */
  lines: readonly string[];
  sub?: string;
  /** Anchor for the first section, shown as the scroll cue. */
  cue?: { href: string; bn: string; en: string };
  className?: string;
};

/**
 * The interior-page hero: one full-bleed still, a scrim, and the type.
 *
 * Deliberately a still and not a clip. All eight Veo clips are spoken for on
 * the homepage, one per chapter — the whole argument of that page is that no
 * two of them get the same treatment. Reusing one here would spend a chapter's
 * footage on a page that has no chapters, and the reader who arrives from the
 * homepage would recognise it immediately.
 *
 * Full viewport height on purpose. The header is transparent until you are
 * 55% of a screen down, so a short hero would leave white-on-photo nav links
 * sitting over whatever the next section happens to be.
 */
export function PageHero({ img, alt = "", eyebrow, bn, lines, sub, cue, className }: Props) {
  return (
    <section className={cn("relative h-[100svh] overflow-hidden bg-ink", className)}>
      <div className="absolute inset-0">
        <Image
          src={`/media/${img}-1600.webp`}
          alt={alt}
          fill
          sizes="100vw"
          preload
          className="object-cover"
        />
        {/* Two-stop scrim: darkens the type zone without flattening the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.5)_0%,rgba(0,0,0,.12)_30%,rgba(0,0,0,.3)_62%,rgba(0,0,0,.88)_100%)]"
        />
      </div>

      <div className="shell relative flex h-full flex-col justify-end pb-[16svh] md:justify-center md:pb-0">
        <Enter as="p" className="t-eyebrow text-gold">
          {eyebrow}
        </Enter>

        {bn ? (
          <Enter delay={90} className="mt-7 flex items-center gap-4 md:gap-6">
            <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold md:w-14" />
            <span className="t-lede-bn">{bn}</span>
          </Enter>
        ) : null}

        <h1 className="t-display mt-6 max-w-[16ch]">
          {lines.map((line, i) => (
            <Enter key={line} as="span" delay={180 + i * 90} className="block">
              {line}
            </Enter>
          ))}
        </h1>

        {sub ? (
          <Enter
            as="p"
            delay={180 + lines.length * 90 + 60}
            className="t-body-lg mt-6 max-w-[42ch] text-text-on-ink-dim"
          >
            {sub}
          </Enter>
        ) : null}
      </div>

      {cue ? (
        <Enter
          delay={900}
          className="absolute inset-x-0 bottom-6 z-10 mx-auto hidden w-max md:block"
        >
          <a href={cue.href} className="flex items-center gap-4">
            <span className="t-bangla text-[15px] leading-none text-gold">{cue.bn}</span>
            <span aria-hidden="true" className="h-px w-10 bg-white/30" />
            <span className="t-eyebrow text-text-on-ink-dim">{cue.en}</span>
          </a>
        </Enter>
      ) : null}
    </section>
  );
}
