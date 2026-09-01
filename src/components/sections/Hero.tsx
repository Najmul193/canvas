"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { routes } from "@/data/site";
import { prefersReducedMotion, isCoarsePointer, isSaveData } from "@/lib/env";

/**
 * Full-bleed hero. The footage plays; the type arrives on a single sequenced
 * timeline; the whole frame scales back very slightly as you scroll away.
 *
 * That last move is the Apple signature — the hero doesn't slide off, it
 * recedes. It reads as depth rather than as a transition.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    const vid = video.current;
    if (!el) return;

    const reduced = prefersReducedMotion();

    // Video: attach late, skip entirely on save-data.
    if (vid && !isSaveData()) {
      vid.src = "/video/hero-collar.mp4";
      vid.load();
      if (!reduced) vid.play().catch(() => undefined);
    }

    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);

      const tl = gsap.timeline({ delay: 0.15 });
      tl.from("[data-hero-media]", {
        scale: 1.08,
        opacity: 0,
        duration: 1.8,
        ease: "power2.out",
      })
        .from("[data-hero-eyebrow]", { y: 16, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.45)
        .from("[data-hero-bn]", { y: 16, opacity: 0, duration: 0.9, ease: "power3.out" }, 0.5)
        .from("[data-hero-line]", {
          yPercent: 110,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.08,
        }, 0.55)
        .from("[data-hero-sub]", { y: 14, opacity: 0, duration: 0.9, ease: "power2.out" }, 0.95)
        .from("[data-hero-cta] > *", {
          y: 12,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.07,
        }, 1.1)
        .from("[data-hero-cue]", { y: 10, opacity: 0, duration: 0.9, ease: "power2.out" }, 1.5);

      // Recede on exit. Desktop only — pinning the hero on touch costs more
      // than it gives.
      if (!isCoarsePointer()) {
        gsap.to("[data-hero-media]", {
          scale: 0.92,
          yPercent: -4,
          borderRadius: 28,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
        gsap.to("[data-hero-copy], [data-hero-cue]", {
          y: -60,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "60% top", scrub: 0.6 },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink">
      <div data-hero-media className="absolute inset-0 overflow-hidden will-change-transform">
        <video
          ref={video}
          poster="/video/hero-collar-poster.webp"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Two-stop scrim: darkens the type zone without flattening the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.45)_0%,rgba(0,0,0,.05)_28%,rgba(0,0,0,.25)_60%,rgba(0,0,0,.85)_100%)]"
        />
      </div>

      <div
        data-hero-copy
        className="shell relative flex h-full flex-col justify-end pb-[14svh] md:justify-center md:pb-0"
      >
        <p data-hero-eyebrow className="t-eyebrow text-gold">
          Handcrafted in Dhaka
        </p>

        {/* Chapter zero.
            This line is not the headline in another script — a Bangla line
            that only restates the English is decoration, and it reads as
            decoration. It says the thing the English cannot: নকশা is the same
            word the page uses for নকশী কাঁথা seven chapters later, and "নতুন
            হাতে" means the maker's hands and the wearer's at once.
            The hairline is the mark the seven chapters carry, so the hero
            joins the count without being numbered. */}
        <div data-hero-bn className="mt-7 flex items-center gap-4 md:gap-6">
          <span aria-hidden="true" className="h-px w-10 shrink-0 bg-gold md:w-14" />
          <p className="t-lede-bn">পুরোনো নকশা, নতুন হাতে</p>
        </div>

        <h1 className="t-hero mt-6 max-w-[13ch]">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">Heritage,</span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block italic">worn now.</span>
          </span>
        </h1>

        <p data-hero-sub className="t-body-lg mt-6 max-w-[38ch] text-text-on-ink-dim">
          Brass and silver, drawn from the ornament of Bengal and made
          for how women dress today.
        </p>

        <div data-hero-cta className="mt-9 flex flex-wrap gap-3">
          <a
            href={routes.shop}
            className="rounded-full bg-berry px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-colors duration-300 hover:bg-berry-deep"
          >
            Explore the collection
          </a>
          <a
            href={routes.custom}
            className="rounded-full border border-white/25 px-7 py-3.5 text-[13px] font-semibold tracking-wide text-text-on-ink transition-colors duration-300 hover:border-white/60"
          >
            Commission a piece
          </a>
        </div>
      </div>

      {/* Tells the reader the page has a shape and a length before they commit
          to scrolling it. A bare chevron says "there is more"; this says how
          much more, which is the difference between a prompt and a contract. */}
      <a
        data-hero-cue
        href="#mati"
        className="absolute inset-x-0 bottom-6 z-10 mx-auto hidden w-max items-center gap-4 md:flex"
      >
        <span className="t-bangla text-[15px] leading-none text-gold">সাতটি অধ্যায়</span>
        <span aria-hidden="true" className="h-px w-10 bg-white/30" />
        <span className="t-eyebrow text-text-on-ink-dim">Seven chapters</span>
      </a>
    </section>
  );
}
