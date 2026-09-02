import Image from "next/image";
import { ChapterMark } from "@/components/ui/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { Parallax } from "@/components/motion/Parallax";
import { aboutSection, vision } from "@/data/about";

/**
 * ০২ দৃষ্টি — the vision.
 *
 * The two atelier stills are the only landscape photography in the set, which
 * is why they get the wide band: everything else the brand has shot is 9:16,
 * and cropping a portrait frame this wide throws away most of the picture.
 *
 * They are offset against each other with a small parallax rather than a
 * shared one. Two images travelling at the same rate read as a single flat
 * plane; give them different rates and the eye reads distance between them.
 */
export function Vision() {
  const mark = aboutSection.drishti;

  return (
    <section id={mark.id} className="bg-ink">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={mark} tone="ink" />

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1.05fr_1fr] md:gap-20">
          <SplitLines as="h2" className="t-display" lines={[...vision.lines]} />

          <div className="max-w-[52ch] space-y-6 md:pt-3">
            {vision.body.map((para, i) => (
              <Reveal key={i} delay={140 + i * 90}>
                <p className="text-text-on-ink-dim">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:mt-24 md:grid-cols-[1.55fr_1fr] md:gap-8">
          <Reveal>
            <Parallax y={-28} className="overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] bg-ink-soft">
                <Image
                  src="/media/atelier-jewellery-box-velvet-1600.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          </Reveal>

          <Reveal delay={120}>
            <Parallax y={24} className="overflow-hidden rounded-2xl">
              <div className="relative aspect-[16/10] bg-ink-soft">
                <Image
                  src="/media/atelier-hasuli-in-case-1080.webp"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
