"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  lines: string[];
  className?: string;
  lineClassName?: string;
  /** ms between each line. Apple sits around 60–90ms; tighter reads as crisp. */
  stagger?: number;
  as?: "h1" | "h2" | "p";
};

/**
 * Headline that reveals one line at a time.
 *
 * Lines are authored explicitly rather than measured from the DOM: measuring
 * wrapped lines forces a reflow, breaks on font swap, and produces different
 * splits at every breakpoint. Authoring them keeps the rhythm intentional.
 */
export function SplitLines({
  lines,
  className,
  lineClassName,
  stagger = 75,
  as: tag = "h2",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const kids = Array.from(el.querySelectorAll<HTMLElement>("[data-line]"));

    if (!("IntersectionObserver" in window)) {
      kids.forEach((k) => k.classList.add("is-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          kids.forEach((k, i) => {
            k.style.transitionDelay = `${i * stagger}ms`;
            k.classList.add("is-in");
          });
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [stagger]);

  const Tag = tag as React.ElementType;

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={className}>
      {lines.map((line, i) => (
        <span key={i} data-line="" className={cn("block", lineClassName)}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
