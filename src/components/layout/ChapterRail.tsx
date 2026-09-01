"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/data/story";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/cn";

/**
 * The spine. Seven marks down the left edge, one per chapter, the current one
 * lit.
 *
 * A page this long has to answer "where am I and how much is left" without
 * being asked, or the reader starts flicking to find out — and flicking is
 * how a scrubbed page gets seen at its worst. The rail is the cheapest
 * possible answer: it is smaller than the type it sits beside and it never
 * moves.
 *
 * **Not `mix-blend-mode`.** Difference blending is the obvious way to survive
 * the ink → bone → ink alternation without tracking which ground you are over,
 * and it was the first implementation — but a blended *fixed* element forces
 * the browser to rasterise the whole scrolling page behind it as a texture on
 * every frame, which is a large price for a 36px rule. It also made the
 * inactive marks almost invisible on bone, because the element's own alpha
 * scales the blend. Two colours picked to clear both grounds cost nothing and
 * read better: a neutral grey for the marks, and gold-deep for the active one
 * (5.3:1 on ink, 3.0:1 on bone) — which is what gold is for on this page.
 *
 * Desktop only, and hidden until the first chapter is reached — over the hero
 * it would be a widget interrupting a photograph.
 *
 * Idle width is 36px against a 4vw gutter, which is the whole reason the marks
 * are bare rules and the labels are absolutely positioned: anything that took
 * part in layout pushed the rail into the first column of type. The names
 * appear on hover, over the copy, because by then the reader has aimed at it.
 */
export function ChapterRail() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    // A band across the middle of the viewport: whichever chapter is crossing
    // it, is the chapter you are reading. Between chapters nothing matches and
    // the last value is deliberately kept, so the rail holds rather than
    // blanking over Collections, Maker and the grid.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className={cn(
        "group fixed left-0 top-1/2 z-[90] hidden -translate-y-1/2 lg:block",
        "transition-opacity duration-700 [transition-timing-function:var(--ease-out-apple)]",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <ol className="flex flex-col">
        {chapters.map((c) => {
          const on = c.id === active;
          return (
            <li key={c.id} className="relative">
              <button
                type="button"
                onClick={() => scrollToId(c.id)}
                aria-current={on ? "true" : undefined}
                className="flex h-7 items-center pl-3 pr-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-700",
                    "[transition-timing-function:var(--ease-out-apple)]",
                    on ? "w-6 bg-gold-deep" : "w-3 bg-[#86868b]/55",
                  )}
                />
                {/* Absolute, so naming the chapters costs the rail no width. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute left-11 top-1/2 flex -translate-y-1/2",
                    "items-center gap-2.5 whitespace-nowrap",
                    "translate-x-[-4px] opacity-0 transition-all duration-500",
                    "[transition-timing-function:var(--ease-out-apple)]",
                    "group-hover:translate-x-0 group-hover:opacity-100",
                  )}
                >
                  <span className="t-bangla text-[11px] leading-none tabular-nums text-[#86868b]">
                    {c.num}
                  </span>
                  <span
                    className={cn(
                      "t-bangla text-[13px] leading-none",
                      on ? "text-gold-deep" : "text-[#86868b]",
                    )}
                  >
                    {c.bn}
                  </span>
                </span>
                <span className="sr-only">
                  {c.num} {c.rom} — {c.en}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
