/** Runtime capability checks. All are safe to call during SSR (return false). */

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isCoarsePointer = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

/**
 * True when the visitor has asked us to use less data, or is on a slow link.
 * Much of this audience is on mid-range Android over 4G in Dhaka — video is a
 * progressive enhancement there, never a requirement.
 */
export const isSaveData = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!c) return false;
  return c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? "");
};
