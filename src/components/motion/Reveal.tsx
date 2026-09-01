"use client";

import { useEffect, useRef } from "react";
import { subscribeNear, viewportProgress, easeOut } from "@/lib/ticker";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/env";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger, in ms, for siblings revealed as a group. See note below. */
  delay?: number;
  as?: "div" | "section" | "figure" | "li" | "p";
};

/**
 * The universal entrance — scroll-linked, not triggered.
 *
 * The distinction is most of what separates a considered site from a marketing
 * page. A triggered reveal fires once when an element crosses a threshold and
 * then plays a fixed 1s animation: it lands exactly the same way whether you
 * eased down or flicked past, and repeated across every section it is the
 * signature of a template. This instead maps the element's live position in the
 * viewport onto its own opacity and offset, every frame. Scroll slowly and it
 * resolves slowly; flick and it snaps up. The page answers you rather than
 * performing at you.
 *
 * Three things keep that affordable:
 *
 * 1. It shares the page-wide two-phase loop (`lib/ticker`) rather than starting
 *    its own, and only subscribes while it is near the viewport.
 * 2. **Progress latches at its maximum** and the element unsubscribes the
 *    moment it resolves, so the steady-state cost of forty of these is zero.
 *    Latching also means content anchored inside a sticky frame — where the
 *    rect stops moving once the frame pins — can never be left stranded at 84%
 *    opacity, which a purely positional mapping does.
 * 3. `will-change` is set on entry and cleared on exit, so a page of reveals is
 *    not a page of permanent compositor layers.
 *
 * Touch and reduced motion keep the one-shot IntersectionObserver path. Per
 * frame scroll-linked work is exactly what a mid-range Android cannot afford,
 * and there the stutter reads as broken where the plain fade does not.
 *
 * `delay` is kept as the prop name because every call site already passes it,
 * but on the scroll-linked path it is not a delay — a delay would break the
 * link to scroll position. It offsets where the element's own curve begins, so
 * siblings still resolve in sequence.
 */
export function Reveal({ children, className, delay = 0, as: tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    if (prefersReducedMotion() || isCoarsePointer()) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            if (delay) (e.target as HTMLElement).style.transitionDelay = `${delay}ms`;
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    // The CSS transition would restart on every per-frame write and lag a full
    // second behind the scroll. Drive the styles directly instead.
    el.style.transition = "none";

    const order = delay / 130;
    const enter = 0.95 + order * 0.045;
    const settle = 0.62 + order * 0.045;

    let p = 0;
    let last = -1;
    let off: (() => void) | null = null;

    const frame = {
      enter: () => {
        el.style.willChange = "opacity, transform";
      },
      leave: () => {
        el.style.willChange = "";
      },
      measure: () => {
        // Latched: monotonically increasing, never reversing.
        p = Math.max(p, easeOut(viewportProgress(el, enter, settle)));
      },
      apply: () => {
        if (Math.abs(p - last) < 0.002) return;
        last = p;
        el.style.opacity = String(p);
        el.style.transform =
          p >= 1 ? "none" : `translate3d(0, ${((1 - p) * 26).toFixed(2)}px, 0)`;

        if (p >= 1) {
          // Resolved for good. Stop measuring it.
          el.style.willChange = "";
          off?.();
          off = null;
        }
      },
    };

    off = subscribeNear(el, frame);
    return () => {
      off?.();
      off = null;
    };
  }, [delay]);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal=""
      className={className}
    >
      {children}
    </Tag>
  );
}
