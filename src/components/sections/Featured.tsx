import { products } from "@/data/products";
import { routes } from "@/data/site";
import { ProductCard } from "@/components/ui/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";

const FEATURED = [
  "bunon-haar",
  "bagh-o-bon",
  "shapla-bil-box-clutch",
  "zura-hashuli",
  "anardana-neckpiece",
  "golap-jorowa-haar",
  "coin-bicha",
  "hiya-bindu-choker",
];

export function Featured() {
  const picks = FEATURED.map((slug) => products.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <section className="bg-ink">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="t-eyebrow text-gold">Selected pieces</p>
        </Reveal>
        <SplitLines as="h2" className="t-display mt-6" lines={["Made once, by hand."]} />

        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-16 md:grid-cols-4 md:gap-x-8">
          {picks.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 4) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 text-center">
            <a
              href={routes.shop}
              className="inline-flex rounded-full bg-berry px-8 py-4 text-[13px] font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-berry-deep"
            >
              View all {products.length} pieces
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
