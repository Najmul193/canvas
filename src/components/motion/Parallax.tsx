"use client";

import { useEffect, useRef } from "react";
import { subscribeNear, clamp } from "@/lib/ticker";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/env";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Total travel across a full viewport traverse, in px. Sign sets direction. */
  y?: number;
  x?: number;
  as?: "div" | "figure" | "span";
};

/**
 * Depth by differential speed.
 *
 * Two elements that scroll at the same rate read as one flat plane; give them
 * different rates and the eye reads distance. That is the whole trick — but it
 * only works while the numbers stay small. Anything past ~80px stops reading
 * as depth and starts reading as a widget sliding around.
 *
 * Shares the one page-wide rAF loop rather than starting its own, and drops
 * out entirely on touch and under reduced motion.
 */
export function Parallax({ children, className, y = 0, x = 0, as: tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || isCoarsePointer()) return;

    let p = 0;
    let last = Number.NaN;

    return subscribeNear(el, {
      // Promote only while it is in play. A `will-change` that is never
      // released is a compositor layer that is never released, and forty of
      // those is how a page runs out of GPU memory on a mid-range phone.
      enter: () => {
        el.style.willChange = "transform";
      },
      leave: () => {
        el.style.willChange = "";
      },
      measure: () => {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // -0.5 → 0.5 as the element travels from below the fold to above it.
        p = clamp((vh - rect.top) / (vh + rect.height)) - 0.5;
      },
      apply: () => {
        if (Math.abs(p - last) < 0.0008) return;
        last = p;
        el.style.transform = `translate3d(${(p * x).toFixed(2)}px, ${(p * y).toFixed(2)}px, 0)`;
      },
    });
  }, [x, y]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
    >
      {children}
    </Tag>
  );
}
