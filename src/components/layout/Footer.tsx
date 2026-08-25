import Image from "next/image";
import { routes, site } from "@/data/site";

const shopLinks = [
  { label: "Neckpiece", href: "/shop/category/neckpiece-9" },
  { label: "Earpiece", href: "/shop/category/earpiece-7" },
  { label: "Hand Jewelry", href: "/shop/category/hand-jewelry-38" },
  { label: "Foot Jewelry", href: "/shop/category/foot-jewelry-19" },
  { label: "Hairpiece", href: "/shop/category/hairpiece-11" },
  { label: "Bags", href: "/shop/category/bags-71" },
];

const houseLinks = [
  { label: "Our Story", href: routes.about },
  { label: "Custom Jewelry", href: routes.custom },
  { label: "Journal", href: routes.blog },
  { label: "Careers", href: routes.jobs },
  { label: "Contact", href: routes.contact },
];

export function Footer() {
  return (
    <footer className="border-t border-rule-on-ink bg-ink">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:py-20">
        <div>
          <Image
            src="/media/logo-emblem-wordmark-stacked.png"
            alt="Canvas"
            width={104}
            height={69}
            className="h-16 w-auto"
          />
          <p className="t-eyebrow mt-5 text-text-on-ink-dim">{site.tagline}</p>
        </div>

        <FooterCol title="Shop" links={shopLinks} />
        <FooterCol title="Canvas" links={houseLinks} />

        <div>
          <h2 className="t-eyebrow text-gold">Visit</h2>
          <address className="mt-5 space-y-2 text-sm not-italic text-text-on-ink-dim">
            <p>
              {site.address.line1}
              <br />
              {site.address.line2}
              <br />
              {site.address.city}
            </p>
            <p className="pt-2">
              <a className="transition-colors hover:text-gold" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
            <p>
              <a className="transition-colors hover:text-gold" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
          </address>
          <div className="mt-5 flex gap-5 text-sm text-text-on-ink-dim">
            <a className="transition-colors hover:text-gold" href={site.social.facebook} rel="noopener noreferrer" target="_blank">
              Facebook
            </a>
            <a className="transition-colors hover:text-gold" href={site.social.instagram} rel="noopener noreferrer" target="_blank">
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="shell flex flex-wrap justify-between gap-4 border-t border-rule-on-ink py-7 text-xs text-text-on-ink-dim">
        <p>© {new Date().getFullYear()} Canvas. Handcrafted in Dhaka, Bangladesh.</p>
        <p className="flex gap-5">
          <a className="transition-colors hover:text-gold" href={routes.terms}>Terms</a>
          <a className="transition-colors hover:text-gold" href={routes.privacy}>Privacy</a>
        </p>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="t-eyebrow text-gold">{title}</h2>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="text-sm text-text-on-ink-dim transition-colors hover:text-text-on-ink"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
