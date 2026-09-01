"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion, isCoarsePointer } from "@/lib/env";
import { setScroller } from "@/lib/scroll";
import { pump, setDriven } from "@/lib/ticker";

/**
 * Lenis + ScrollTrigger + the shared frame loop, wired together once at the
 * root, in that order.
 *
 * **Order is the reason this file owns the loop.** Lenis writes the scroll
 * position from inside `gsap.ticker`. Anything that reads element positions
 * has to run after that write, in the same frame — otherwise it reads last
 * frame's layout, and a one-frame lag between the page moving and the parallax
 * responding is exactly what "not quite smooth" feels like. So `pump` is added
 * to the same ticker immediately after Lenis rather than running its own
 * `requestAnimationFrame`, and `setDriven(true)` stops the loop self-driving.
 *
 * **`lerp`, not `duration`.** In duration mode every wheel event starts a fresh
 * ~1s tween to a new target, so a continuous scroll is a chain of restarts and
 * the velocity profile is uneven — it reads as slightly rubbery. `lerp` is one
 * exponential decay toward a target that keeps moving, which is the weighted,
 * continuous glide this page wants. Lower is heavier; 0.09 is roughly a 110ms
 * time constant.
 *
 * Smooth scroll is desktop-only on purpose. On touch, native momentum is
 * better than anything synthesised, and hijacking it is the fastest way to
 * make a site feel broken on a mid-range Android.
 */
export function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion() || isCoarsePointer()) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);
    setScroller(lenis);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.add(pump);        // reads positions Lenis has just written
    gsap.ticker.lagSmoothing(0);
    setDriven(true);

    ScrollTrigger.refresh();

    return () => {
      setDriven(false);
      setScroller(null);
      gsap.ticker.remove(pump);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
