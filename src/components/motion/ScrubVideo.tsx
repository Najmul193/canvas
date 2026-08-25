"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, isCoarsePointer, isSaveData } from "@/lib/env";

type Props = {
  src: string;          // .mp4 (H.264, faststart) — seekable
  poster: string;
  className?: string;
  /** Scroll distance to scrub across, as a multiple of viewport height. */
  scrollLength?: number;
  children?: React.ReactNode;
};

/**
 * Scroll-scrubbed video: the section pins, and scroll position drives
 * `video.currentTime` instead of playing in real time. This is the technique
 * behind Apple's product pages — the reader controls the footage, which is
 * what makes it feel authored rather than decorative.
 *
 * Three requirements make or break it:
 *   1. The file must be encoded with `-movflags +faststart` and a short
 *      keyframe interval, or seeking stutters.
 *   2. Seeks are throttled through gsap.quickTo — assigning currentTime on
 *      every scroll event overwhelms the decoder.
 *   3. It degrades to a plain looping video on touch, and to the poster alone
 *      under reduced-motion or save-data.
 */
export function ScrubVideo({
  src,
  poster,
  className,
  scrollLength = 2.5,
  children,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const vid = video.current;
    if (!el || !vid) return;

    // Poster only — no download at all.
    if (isSaveData()) return;

    const reduced = prefersReducedMotion();
    const coarse = isCoarsePointer();

    vid.src = src;
    vid.load();

    // Touch or reduced motion: plain loop, no scrubbing, no pin.
    if (coarse || reduced) {
      if (reduced) return;
      vid.loop = true;
      vid.muted = true;
      vid.play().catch(() => {
        /* autoplay refused — poster stands */
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    let trigger: ScrollTrigger | undefined;

    const build = () => {
      const duration = vid.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      // Throttle seeks: one per frame at most, eased toward the target.
      const seek = gsap.quickTo(vid, "currentTime", {
        duration: 0.35,
        ease: "power2.out",
      });

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${window.innerHeight * scrollLength}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => seek(self.progress * duration),
      });
    };

    if (vid.readyState >= 1) build();
    else vid.addEventListener("loadedmetadata", build, { once: true });

    return () => {
      trigger?.kill();
    };
  }, [src, scrollLength]);

  return (
    <div ref={wrap} className={className}>
      <video
        ref={video}
        poster={poster}
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        className="h-full w-full object-cover"
      />
      {children}
    </div>
  );
}
