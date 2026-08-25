import Image from "next/image";
import { collections } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";

export function Collections() {
  return (
    <section className="bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="t-eyebrow text-gold-deep">Collections</p>
        </Reveal>
        <SplitLines as="h2" className="t-display mt-6" lines={["Three ways in."]} />

        <div className="mt-14 grid gap-8 md:mt-16 md:grid-cols-3">
          {collections.map((c, i) => (
            <Reveal key={c.href} delay={i * 110}>
              <a href={c.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-bone-sink">
                  <Image
                    src={`/media/${c.img}-1080.webp`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-apple)] group-hover:scale-[1.04]"
                  />
                </div>
                <h3 className="t-headline mt-6">{c.title}</h3>
                <p className="t-eyebrow mt-2 text-text-on-bone-dim">{c.note}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
