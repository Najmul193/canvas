"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { nav, routes } from "@/data/site";
import { cn } from "@/lib/cn";

/**
 * Apple's header behaviour: transparent over the hero, then a blurred
 * translucent bar once you leave it. Never a hard-edged solid block.
 */
export function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
        "[transition-timing-function:var(--ease-out-apple)]",
        stuck || open
          ? "border-b border-rule-on-ink bg-black/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <div className="shell flex h-14 items-center gap-8 md:h-16">
        <a href="/" aria-label="Canvas — home" className="flex shrink-0 items-center">
          <Image
            src="/media/logo-emblem-wordmark-tight.png"
            alt="Canvas"
            width={112}
            height={58}
            priority
            className="h-8 w-auto md:h-9"
          />
        </a>

        <nav aria-label="Primary" className="mx-auto hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13px] text-text-on-ink-dim transition-colors duration-300 hover:text-text-on-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5 md:ml-0">
          <a
            href={routes.cart}
            className="flex items-center gap-2 text-[13px] text-text-on-ink"
          >
            Bag
            <span className="grid h-[18px] min-w-[18px] place-items-center rounded-full bg-berry px-1 text-[10px] font-semibold leading-none text-white">
              0
            </span>
          </a>
          <a
            href={routes.login}
            className="hidden text-[13px] text-text-on-ink-dim transition-colors hover:text-text-on-ink md:block"
          >
            Sign in
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 grid h-11 w-11 place-items-center md:hidden"
          >
            <span className="relative block h-[11px] w-[18px]">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-out-apple)]",
                  open ? "top-[5px] rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-current transition-transform duration-400 [transition-timing-function:var(--ease-out-apple)]",
                  open ? "top-[5px] -rotate-45" : "top-[10px]",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={cn(
          "overflow-hidden md:hidden",
          "transition-[max-height,opacity] duration-500 [transition-timing-function:var(--ease-out-apple)]",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="shell flex flex-col gap-1 pb-8 pt-4">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
              className={cn(
                "t-title border-b border-rule-on-ink py-4 transition-all duration-500",
                "[transition-timing-function:var(--ease-out-apple)]",
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href={routes.login}
            onClick={() => setOpen(false)}
            className="t-eyebrow mt-6 text-text-on-ink-dim"
          >
            Sign in
          </a>
        </nav>
      </div>
    </header>
  );
}
