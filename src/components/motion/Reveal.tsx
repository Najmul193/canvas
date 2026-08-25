"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms, for siblings revealed as a group. */
  delay?: number;
  as?: "div" | "section" | "figure" | "li" | "p";
};

/**
 * The universal entrance. IntersectionObserver rather than ScrollTrigger:
 * it is cheap, works identically on touch, and never depends on the
 * smooth-scroll layer being active.
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

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = tag as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-reveal=""
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
