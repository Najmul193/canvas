"use client";

import { useEffect, useRef } from "react";
import { isSaveData, prefersReducedMotion } from "@/lib/env";
import { cn } from "@/lib/cn";

type Props = {
  /** H.264 fallback. Always required — it is the universally decodable one. */
  src: string;
  /** VP9 alternative, used when the browser reports it can play it. */
  webm?: string;
  poster: string;
  className?: string;
  /** Object-position, for clips whose subject sits off-centre. */
  position?: string;
};

/**
 * A looping background clip that costs nothing until it is nearly on screen.
 *
 * With eight clips on one page, `preload` is not the lever that matters — even
 * `preload="none"` downloads as soon as `src` is set. So `src` itself is
 * withheld until an IntersectionObserver says the element is within a screen
 * of the viewport, and playback is paused the moment it leaves. Scrolling the
 * whole page top to bottom fetches everything; landing on it fetches one clip.
 *
 * Save-data and 2G get the poster and no network request at all. Reduced
 * motion gets the first frame, held.
 */
export function AmbientVideo({ src, webm, poster, className, position }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = ref.current;
    if (!vid || isSaveData()) return;

    const reduced = prefersReducedMotion();

    const attach = () => {
      if (vid.src) return;
      // VP9 is markedly smaller here (diya: 268KB vs 451KB) and there is no
      // seeking involved, which is the only thing it is bad at.
      const useWebm =
        webm && vid.canPlayType('video/webm; codecs="vp9"') === "probably";
      vid.src = useWebm ? webm : src;
      vid.load();
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            attach();
            if (!reduced) vid.play().catch(() => undefined);
          } else if (vid.src) {
            vid.pause();
          }
        }
      },
      { rootMargin: "100% 0px" },
    );

    io.observe(vid);
    return () => io.disconnect();
  }, [src, webm]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      style={position ? { objectPosition: position } : undefined}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
