import { ChapterMark } from "@/components/ui/Chapter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { aboutSection, visit } from "@/data/about";
import { routes, site } from "@/data/site";

/**
 * ০৫ ঠিকানা — where the work is.
 *
 * No opening hours. They are not on the record anywhere in the crawl, and an
 * about page that invents them is the one that gets someone standing outside a
 * closed door in Gulshan traffic. The phone number is the answer to that
 * question and it is already here.
 */
export function Visit() {
  const mark = aboutSection.thikana;

  return (
    <section id={mark.id} className="bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <ChapterMark chapter={mark} tone="bone" />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-[1.05fr_1fr] md:gap-20">
          <div>
            <SplitLines as="h2" className="t-display" lines={[...visit.lines]} />
            <Reveal delay={130}>
              <p className="t-body-lg mt-8 max-w-[34ch]">{visit.body}</p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={routes.shop}
                  className="rounded-full bg-berry px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-berry-deep"
                >
                  Explore the collection
                </a>
                <a
                  href={routes.custom}
                  className="rounded-full border border-black/20 px-7 py-3.5 text-[13px] font-semibold tracking-wide transition-colors duration-300 hover:border-black/60"
                >
                  Commission a piece
                </a>
              </div>
            </Reveal>
          </div>

          <div className="md:pt-3">
            <Reveal>
              <span aria-hidden="true" className="block h-px w-full bg-rule-on-bone" />
              <p className="t-eyebrow mt-6 text-gold-deep">Shop &amp; workshop</p>
              <address className="mt-4 text-[15px] not-italic leading-relaxed text-text-on-bone-dim">
                {site.address.line1}
                <br />
                {site.address.line2}
                <br />
                {site.address.city}
              </address>
            </Reveal>

            <Reveal delay={110}>
              <span aria-hidden="true" className="mt-10 block h-px w-full bg-rule-on-bone" />
              <p className="t-eyebrow mt-6 text-gold-deep">Get in touch</p>
              <ul className="mt-4 space-y-2 text-[15px] text-text-on-bone-dim">
                <li>
                  <a className="transition-colors hover:text-text-on-bone" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </li>
                <li>
                  <a className="num transition-colors hover:text-text-on-bone" href={site.phoneHref}>
                    {site.phone}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={200}>
              <span aria-hidden="true" className="mt-10 block h-px w-full bg-rule-on-bone" />
              <p className="t-eyebrow mt-6 text-gold-deep">Follow</p>
              <ul className="mt-4 flex gap-6 text-[15px] text-text-on-bone-dim">
                <li>
                  <a
                    className="transition-colors hover:text-text-on-bone"
                    href={site.social.facebook}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    className="transition-colors hover:text-text-on-bone"
                    href={site.social.instagram}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
