/**
 * A handle on whatever is currently doing the scrolling.
 *
 * Anchor links and Lenis disagree: a plain `#id` jump moves the native scroll
 * position out from under the smooth layer, which lands hard and leaves
 * ScrollTrigger a frame behind. So the smooth-scroll root registers itself
 * here, and anything that wants to move the page asks through this instead of
 * setting `location.hash`.
 *
 * The fallback is the native path, which is what runs on touch, under
 * reduced motion, and before hydration — all three of which are cases where
 * native is the right answer anyway.
 */

type Scroller = {
  scrollTo: (target: string | HTMLElement | number, options?: Record<string, unknown>) => void;
};

let scroller: Scroller | null = null;

export function setScroller(s: Scroller | null) {
  scroller = s;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (scroller) {
    scroller.scrollTo(el, { duration: 1.4, offset: 0 });
    return;
  }

  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
