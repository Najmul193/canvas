import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { House } from "@/components/sections/about/House";
import { Vision } from "@/components/sections/about/Vision";
import { Hand } from "@/components/sections/about/Hand";
import { Founder } from "@/components/sections/about/Founder";
import { Visit } from "@/components/sections/about/Visit";
import { hero } from "@/data/about";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Canvas is a handcrafted jewellery house in Dhaka. Brass and silver, drawn " +
    "by hand and finished by hand, founded by architect and designer Tanwy Kabir.",
  alternates: { canonical: "/about" },
  openGraph: {
    type: "profile",
    title: "Our Story · Canvas",
    description:
      "A handcrafted jewellery house in Dhaka. The house, the vision, the hand, " +
      "and the designer behind it.",
    url: "/about",
    images: ["/media/founder-tanwy-kabir-640.webp"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "Our Story · Canvas",
  url: "https://www.canvas-bd.com/about",
  about: {
    "@type": "Organization",
    name: site.name,
    alternateName: site.nameBn,
    url: "https://www.canvas-bd.com/",
    founder: {
      "@type": "Person",
      name: site.founder.name,
      alternateName: site.founder.nameBn,
      jobTitle: site.founder.role,
    },
  },
};

/**
 * Five marks, ink → bone → ink → bone → ink → bone.
 *
 *   ০১ ঘর        the house      what Canvas makes, and the trade it has chosen
 *   ০২ দৃষ্টি     the vision     why the craft is held and the proportion moved
 *   ০৩ হাত       the hand       the sheet the piece is argued out on
 *   ০৪ নকশাকার   the designer   Tanwy Kabir, at length rather than in three lines
 *   ০৫ ঠিকানা    the address    where to stand and hold one
 *
 * The count restarts at ০১ rather than continuing the homepage's seven. This
 * is a different telling of the same house, not chapter eight — and
 * `ChapterRail` keys on the homepage ids, finds none of these, and stays
 * folded away, which is the correct answer for a page with no spine.
 *
 * The alternation matters more here than it does on the homepage, because
 * there is no video to break the sections up. Six screens of type on one
 * ground would read as a document; the inversion is what keeps it a page.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        img="hero-seated-heritage-courtyard"
        eyebrow={hero.eyebrow}
        bn={hero.bn}
        lines={hero.lines}
        sub={hero.sub}
        cue={{ href: "#ghor", bn: "পাঁচটি পর্ব", en: "Five parts" }}
      />
      <House />
      <Vision />
      <Hand />
      <Founder />
      <Visit />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
