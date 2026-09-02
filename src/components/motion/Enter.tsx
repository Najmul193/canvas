"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** ms. A real delay here, unlike `Reveal` — nothing is linked to scroll. */
  delay?: number;
  as?: "div" | "p" | "h1" | "figure" | "span" | "li";
};

/**
 * The entrance for content that is already on screen when the page loads.
 *
 * `Reveal` cannot do this job. It maps an element's live position in the
 * viewport onto its own progress, and an element sitting above the fold is
 * already past the settle point on the first frame — so it latches at 1
 * immediately and simply appears. That is correct behaviour for the forty
 * reveals further down the page and useless for a hero.
 *
 * So: no scroll link, no observer, just a staged transition on mount. It
 * borrows the `[data-reveal]` base state rather than defining its own, which
 * means the `<noscript>` block in the root layout and the
 * `prefers-reduced-motion` rule in `globals.css` already cover it — a second
 * pair of hidden-by-default styles would need both written again, and the one
 * that gets forgotten is how a page ships invisible.
 *
 * The homepage hero uses a GSAP timeline instead, because it also has to
 * sequence a video scale-in and hand off to a scrub on exit. Interior heroes
 * have none of that, and a timeline library is a poor way to add two hundred
 * milliseconds of delay.
 */
export function Enter({ children, className, delay = 0, as: tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;

    // Two frames, not one. Adding the class in the same frame the element
    // first paints means the browser never observes the "from" state and
    // skips straight to the end with no transition at all.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => el.classList.add("is-in"));
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [delay]);

  const Tag = tag as React.ElementType;

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
