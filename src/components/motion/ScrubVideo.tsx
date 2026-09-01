"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, isCoarsePointer, isSaveData } from "@/lib/env";
import { clamp, easeOut, approach, subscribeNear } from "@/lib/ticker";
import { cn } from "@/lib/cn";

type Props = {
  src: string;          // .mp4 (H.264, faststart, short GOP) — must be seekable
  poster: string;
  className?: string;
  /** Scroll track length as a multiple of viewport height. 2–3 feels right. */
  track?: number;
  /**
   * Open the frame as the scrub begins: the clip is revealed through a mask
   * that grows from a tall arch to full bleed. The footage itself never
   * scales — only the window onto it — so the image cannot go soft.
   */
  reveal?: boolean;
  children?: React.ReactNode;
};

/** How much of the track the mask takes to open. The rest is pure scrub. */
const REVEAL_SPAN = 0.42;

/**
 * Scroll-scrubbed video: scroll position drives `video.currentTime` rather
 * than the clip playing on its own, so the reader controls the footage.
 *
 * The frame is held with CSS `position: sticky`, deliberately not GSAP's
 * `pin`. Pinning clones the element into a generated spacer and measures the
 * document at build time — and because the ScrollTrigger here can only be
 * created once video metadata has loaded, it always measured late and left an
 * empty spacer rendering as a black band. Sticky has no spacer, no
 * measurement step, and cannot desync from the smooth-scroll layer.
 *
 * Encoding matters as much as the code: clips need `-movflags +faststart` and
 * a short GOP (see tools/build-media.py) or seeking visibly stutters.
 *
 * `src` is withheld until the track is within a screen and a half of the
 * viewport. Scrubbing needs the clip fully buffered, so this cannot use
 * `preload="metadata"` to stay light — the only way to keep three scrubbed
 * sections off the critical path is to not name the file yet.
 */
export function ScrubVideo({
  src,
  poster,
  className,
  track = 2.5,
  reveal = false,
  children,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const holdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trackEl = trackRef.current;
    const vid = videoRef.current;
    if (!trackEl || !vid) return;

    if (isSaveData()) return;               // poster only, no download

    const reduced = prefersReducedMotion();
    const coarse = isCoarsePointer();

    // Deferred attach. Loading starts a screen and a half out, which on a
    // 1.05s Lenis scroll is comfortably more time than the fetch needs.
    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      vid.src = src;
      // Scrubbing needs the whole clip buffered — a seek into unbuffered data
      // renders a black frame, which is exactly what "it goes black" looks like.
      vid.preload = "auto";
      vid.load();
      if (coarse && !reduced) vid.play().catch(() => undefined);
    };

    const loader = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) attach();
          else if (attached) vid.pause();
        }
      },
      { rootMargin: "150% 0px" },
    );
    loader.observe(trackEl);

    if (reduced) return () => loader.disconnect();

    // Touch: plain loop. Seeking per scroll frame is far too expensive on a
    // mid-range phone, and stutter reads as broken rather than premium.
    if (coarse) {
      vid.loop = true;
      vid.muted = true;
      const play = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) vid.play().catch(() => undefined);
            else vid.pause();
          }
        },
        { rootMargin: "150px 0px" },
      );
      play.observe(vid);
      return () => {
        loader.disconnect();
        play.disconnect();
      };
    }

    const mask = reveal ? maskRef.current : null;
    const hold = reveal ? holdRef.current : null;

    // Closed state, written before the first frame so the mask never flashes
    // open. If JS never runs at all the CSS leaves it open, which is the
    // right failure: a full-bleed frame, just without the opening move.
    const paint = (e: number) => {
      if (!mask || !hold) return;
      const insetY = (1 - e) * 13;              // svh
      const insetX = (1 - e) * 26;              // vw
      const radius = (1 - e) * 340 + 4;         // px
      mask.style.inset = `${insetY}svh ${insetX}vw`;
      mask.style.borderRadius = `${radius}px ${radius}px ${radius * 0.12}px ${radius * 0.12}px`;
      hold.style.inset = `-${insetY}svh -${insetX}vw`;
    };
    paint(0);

    let duration = 0;
    let ready = false;

    const onReady = () => {
      duration = Number.isFinite(vid.duration) ? vid.duration : 0;
      ready = duration > 0;
    };
    if (vid.readyState >= 1) onReady();
    vid.addEventListener("loadedmetadata", onReady);

    let progress = 0;
    let live = false;
    let current = 0;
    let lastReveal = -1;
    let t = performance.now();

    // Shares the page-wide loop rather than running a fourth
    // requestAnimationFrame of its own. Three of these each polling their own
    // rect every frame — for sections that may be fifteen thousand pixels away
    // — was most of the scroll cost on this page.
    const stop = subscribeNear(trackEl, {
      measure: () => {
        const rect = trackEl.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;
        live = distance > 0;
        if (live) progress = clamp(-rect.top / distance);
      },
      apply: () => {
        if (!live) return;

        if (mask) {
          const e = easeOut(clamp(progress / REVEAL_SPAN));
          if (Math.abs(e - lastReveal) > 0.001) {
            lastReveal = e;
            paint(e);
          }
        }

        if (!ready) return;

        const now = performance.now();
        const dt = Math.min(0.05, (now - t) / 1000);
        t = now;

        // Ease toward the target rather than assigning it: raw per-event
        // seeking swamps the decoder and drops frames. The factor is derived
        // from elapsed time, so a 120Hz display converges at the same rate as
        // a 60Hz one instead of twice as fast.
        const target = progress * duration;
        current += (target - current) * approach(dt, 0.13);
        if (Math.abs(target - current) < 0.005) current = target;

        if (vid.seeking) return;
        if (Math.abs(vid.currentTime - current) > 0.01) {
          vid.currentTime = current;
        }
      },
    }, "15%");

    return () => {
      stop();
      loader.disconnect();
      vid.removeEventListener("loadedmetadata", onReady);
    };
  }, [src, reveal]);

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${track * 100}svh` }}
    >
      <div className={cn("sticky top-0 h-[100svh] w-full overflow-hidden", className)}>
        {/* The mask. Open by default; the effect closes it and scroll re-opens
            it, so every non-JS path still gets the full frame. */}
        <div ref={maskRef} className="absolute inset-0 overflow-hidden">
          {/* Counter-inset: cancels the mask's inset so the footage holds its
              position in the stage while the window over it grows. */}
          <div ref={holdRef} className="absolute inset-0">
            <video
              ref={videoRef}
              poster={poster}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
