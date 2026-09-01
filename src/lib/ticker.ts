/**
 * One shared frame loop for every scroll-linked effect on the page, split into
 * a read phase and a write phase.
 *
 * **The split is the point.** Calling `getBoundingClientRect()` after something
 * else has written a transform forces the browser to flush layout before it can
 * answer. A loop that goes read, write, read, write across a dozen elements
 * therefore pays a forced synchronous layout per element; running every measure
 * first and every apply second pays one.
 *
 * **Ordering is the other point.** Lenis writes the scroll position from inside
 * `gsap.ticker`. If these effects ran in a second, independent
 * `requestAnimationFrame`, they would sometimes read positions from the frame
 * before Lenis updated them — a one-frame lag that shows up as parallax
 * jittering against the page. So `SmoothScroll` calls `setDriven(true)` and
 * pumps this loop from inside the same ticker, immediately after Lenis. With no
 * smooth-scroll layer (touch, reduced motion) it drives itself.
 *
 * Effects subscribe only while they are near the viewport — see
 * `subscribeNear` — so the steady-state cost is the few elements actually
 * resolving, not every element on a 19,000px page.
 */

export type Frame = {
  /** Read phase. Layout queries go here — never style writes. */
  measure(): void;
  /** Write phase. Style writes go here — never layout queries. */
  apply(): void;
  /** Called when the element comes near the viewport. Promote layers here. */
  enter?(): void;
  /** Called when it leaves, or on teardown. Release layers here. */
  leave?(): void;
};

const frames = new Set<Frame>();
let raf = 0;
let driven = false;

/** Run one frame. Exported so an external driver can order it correctly. */
export function pump() {
  for (const f of frames) f.measure();
  for (const f of frames) f.apply();
}

const loop = () => {
  raf = requestAnimationFrame(loop);
  pump();
};

const startSelf = () => {
  if (!raf && !driven && frames.size) raf = requestAnimationFrame(loop);
};

const stopSelf = () => {
  if (raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
};

/**
 * Hand the loop over to an external driver (the GSAP ticker that also runs
 * Lenis), or take it back.
 */
export function setDriven(on: boolean) {
  driven = on;
  if (on) stopSelf();
  else startSelf();
}

export function subscribe(frame: Frame): () => void {
  frames.add(frame);
  startSelf();
  return () => {
    frames.delete(frame);
    if (!frames.size) stopSelf();
  };
}

/**
 * Subscribe only while `el` is within `margin` of the viewport.
 *
 * An IntersectionObserver costs nothing per frame — it is the browser's own
 * bookkeeping — so gating on one turns "every scroll-linked element on the page
 * measures itself 60 times a second" into "the two or three currently in play
 * do". On this page that is the difference between ~40 rect reads a frame and
 * ~3.
 */
export function subscribeNear(el: Element, frame: Frame, margin = "40%"): () => void {
  let off: (() => void) | null = null;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !off) {
          frame.enter?.();
          off = subscribe(frame);
        } else if (!e.isIntersecting && off) {
          off();
          off = null;
          frame.leave?.();
        }
      }
    },
    { rootMargin: `${margin} 0px` },
  );

  io.observe(el);

  return () => {
    io.disconnect();
    if (off) {
      off();
      off = null;
      frame.leave?.();
    }
  };
}

/** Clamp helper. */
export const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/**
 * How far an element has travelled through the viewport, 0 → 1.
 *
 * 0 when its top edge is at `enter` (fraction of viewport height, measured
 * from the bottom), 1 once it reaches `settle`. Values outside are clamped, so
 * this is safe to read every frame regardless of scroll position.
 */
export function viewportProgress(el: Element, enter = 0.92, settle = 0.55): number {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const start = vh * enter;
  const end = vh * settle;
  if (start === end) return rect.top <= end ? 1 : 0;
  return clamp((start - rect.top) / (start - end));
}

/** Smooth, symmetric ease. Matches the CSS easing used elsewhere closely enough. */
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Frame-rate independent smoothing factor.
 *
 * `current += (target - current) * 0.12` is the usual shorthand and it is
 * wrong: it converges twice as fast on a 120Hz display as on a 60Hz one, so the
 * same code feels different on different machines. This returns the correct
 * factor for the elapsed time and a given time constant, in seconds.
 */
export const approach = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);
