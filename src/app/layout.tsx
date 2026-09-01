import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Noto_Serif_Bengali } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Nav } from "@/components/layout/Nav";
import { ChapterRail } from "@/components/layout/ChapterRail";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/data/site";
import "./globals.css";

/**
 * Bodoni Moda: high-contrast didone. The brand's own product cards already set
 * names in a didone with ball terminals, so this continues an existing voice
 * rather than importing one.
 * Inter: the closest free analogue to SF Pro, which is the right call for an
 * interface built on Apple's motion and layout language.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bangla = Noto_Serif_Bengali({
  subsets: ["bengali"],
  variable: "--font-bangla",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.canvas-bd.com"),
  title: {
    default: "Canvas — Handcrafted Jewellery, Dhaka",
    template: "%s · Canvas",
  },
  description:
    "Handcrafted brass and silver jewellery from Dhaka. Hasuli, jhumka, nupur, bicha — traditional Bengali ornament, made to be worn now.",
  openGraph: {
    type: "website",
    siteName: "CANVAS",
    title: "Canvas — Handcrafted Jewellery, Dhaka",
    description:
      "Handcrafted brass and silver jewellery from Dhaka. Every piece tells a story.",
    images: ["/media/logo-emblem-wordmark-stacked-480.webp"],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/media/logo-emblem-wordmark-tight.png" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  alternateName: site.nameBn,
  url: "https://www.canvas-bd.com/",
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
  founder: { "@type": "Person", name: site.founder.name },
  sameAs: [site.social.facebook, site.social.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${inter.variable} ${bangla.variable}`}
    >
      <body>
        {/* Without JS the reveal base state would hide everything permanently. */}
        <noscript>
          <style>{`[data-reveal],[data-line]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-gold focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>

        <SmoothScroll />
        <Nav />
        <ChapterRail />
        <main id="main">{children}</main>
        <Footer />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </body>
    </html>
  );
}
