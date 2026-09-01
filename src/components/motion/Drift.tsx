"use client";

import { useEffect, useRef } from "react";
import { subscribeNear, viewportProgress, easeOut } from "@/lib/ticker";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/env";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Travel distance in px. Keep small — this is a drift, not a slide. */
  distance?: number;
  /** Offsets the element's own curve, so siblings resolve in sequence. */
  order?: number;
  /** Also drift horizontally. Used sparingly, for editorial asides. */
  x?: number;
  as?: "div" | "section" | "figure" | "li" | "p" | "span";
};

/**
 * Continuous, scroll-linked entrance.
 *
 * The distinction that matters: a triggered reveal fires once when an element
 * crosses a threshold and plays a fixed animation. It always lands the same
 * way regardless of how you scroll, and repeated across every section it is
 * the signature of a template.
 *
 * This instead maps the element's live position in the viewport to its own
 * opacity and offset, every frame. Scroll slowly and it resolves slowly; flick
 * and it snaps up; scroll back and it reverses. The page responds to you
 * rather than performing at you, which is most of what separates a considered
 * site from a marketing page.
 *
 * Touch and reduced-motion fall back to a plain static element — no drift, no
 * observer, nothing to stutter.
 *
 * NOTE: `Reveal` now uses this same technique by default, and every section on
 * the homepage goes through `Reveal`. This is the variant that also drifts
 * horizontally and takes an explicit distance — keep it for editorial asides,
 * reach for `Reveal` otherwise.
 */
export function Drift({
  children,
  className,
  distance = 26,
  order = 0,
  x = 0,
  as: tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || isCoarsePointer()) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    // Stagger by shifting where each sibling's curve begins, rather than by
    // delaying a transition — a delay would break the link to scroll position.
    const enter = 0.94 + order * 0.05;
    const settle = 0.58 + order * 0.05;

    let p = 0;
    let last = -1;

    return subscribeNear(el, {
      enter: () => {
        el.style.willChange = "opacity, transform";
      },
      leave: () => {
        el.style.willChange = "";
      },
      measure: () => {
        p = easeOut(viewportProgress(el, enter, settle));
      },
      apply: () => {
        if (Math.abs(p - last) < 0.002) return;   // skip redundant style writes
        last = p;
        el.style.opacity = String(p);
        const ty = (1 - p) * distance;
        const tx = (1 - p) * x;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      },
    });
  }, [distance, order, x]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={{ opacity: 0 }}
    >
      {children}
    </Tag>
  );
}
