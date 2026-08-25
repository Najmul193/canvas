import Image from "next/image";
import { formatBDT, type Product } from "@/data/products";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <a href={product.href} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-ink-soft">
        <Image
          src={`/media/p-${product.slug}-800.webp`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-apple)] group-hover:scale-[1.05]"
        />
      </div>
      <h3 className="t-title mt-4">{product.name}</h3>
      <p className="num mt-1 text-sm text-gold">৳{formatBDT(product.price)}</p>
    </a>
  );
}
