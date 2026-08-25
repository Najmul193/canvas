import Image from "next/image";
import { routes, site } from "@/data/site";
import { Reveal } from "@/components/motion/Reveal";

export function Maker() {
  return (
    <section className="bg-bone text-text-on-bone">
      <div className="shell grid items-center gap-12 py-24 md:grid-cols-[minmax(240px,400px)_1fr] md:gap-20 md:py-32">
        <Reveal>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-bone-sink">
            <Image
              src="/media/founder-tanwy-kabir-large-1080.webp"
              alt={`${site.founder.name}, founder of Canvas`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="t-eyebrow text-gold-deep">The maker</p>
          <blockquote className="t-headline mt-6 italic">
            “To create something exceptional, your mindset must be relentlessly
            focused on the smallest detail.”
          </blockquote>
          <div className="mt-8">
            <p className="t-bangla text-xl">{site.founder.nameBn}</p>
            <p className="t-eyebrow mt-1 text-text-on-bone-dim">
              {site.founder.name} · {site.founder.role}
            </p>
          </div>
          <p className="mt-7 max-w-[54ch] text-text-on-bone-dim">
            An architect by training, Tanwy founded Canvas to carry forward the
            hands, hearts and heritage behind Bengali ornament — translating the
            essence of traditional form into pieces built for how women dress today.
          </p>
          <a
            href={routes.about}
            className="mt-9 inline-flex rounded-full border border-black/20 px-7 py-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 hover:border-black/60"
          >
            Read our story
          </a>
        </Reveal>
      </div>
    </section>
  );
}
