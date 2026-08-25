"use client";

import { useEffect, useRef } from "react";
import { SplitLines } from "@/components/motion/SplitLines";
import { isSaveData, prefersReducedMotion } from "@/lib/env";

/**
 * The diya band.
 *
 * This clip was generated as an abstract backdrop for the logo; Veo returned a
 * lit diya instead. It has a subject, so it can't sit behind a mark — but it
 * is the most quietly Bengali frame in the whole set, so it carries the line
 * about stories instead.
 */
export function Ambient() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = video.current;
    if (!vid || isSaveData()) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!vid.src) {
              vid.src = "/video/diya.mp4";
              vid.load();
            }
            if (!prefersReducedMotion()) vid.play().catch(() => undefined);
          } else if (vid.src) {
            vid.pause();
          }
        }
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(vid);
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative grid min-h-[72svh] place-items-center overflow-hidden bg-ink py-24">
      <video
        ref={video}
        poster="/video/diya-poster.webp"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

      <div className="shell relative text-center">
        <p className="t-eyebrow text-gold">Made in Bangladesh</p>
        <SplitLines
          as="h2"
          className="t-headline mx-auto mt-6 max-w-[22ch]"
          lines={["Every piece tells a story.", "Some become history."]}
        />
      </div>
    </section>
  );
}
