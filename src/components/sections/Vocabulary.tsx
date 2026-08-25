"use client";

import Image from "next/image";
import { useState } from "react";
import { vocabulary } from "@/data/site";
import { SplitLines } from "@/components/motion/SplitLines";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/**
 * The taxonomy, in Bangla first.
 *
 * On a bone ground: inverting from the hero's black is what stops the page
 * feeling like one long tinted wash, and it lets the gold photography read
 * warm rather than murky.
 */
export function Vocabulary() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-bone text-text-on-bone">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="t-eyebrow text-gold-deep">The vocabulary</p>
        </Reveal>
        <SplitLines
          as="h2"
          className="t-display mt-6 max-w-[18ch]"
          lines={["Every piece has a name", "that predates us."]}
        />
        <Reveal delay={120}>
          <p className="t-body-lg mt-7 max-w-[52ch] text-text-on-bone-dim">
            These are not categories. They are the words the craft itself uses —
            and knowing them is knowing the work.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-[1fr_minmax(280px,420px)] md:gap-20">
          <ul className="border-t border-rule-on-bone">
            {vocabulary.map((v, i) => (
              <li key={v.rom} className="border-b border-rule-on-bone">
                <a
                  href={v.href}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-5 py-5 transition-[padding] duration-500 [transition-timing-function:var(--ease-out-apple)] md:hover:pl-4"
                >
                  <span className="relative h-14 w-11 shrink-0 overflow-hidden rounded-md md:hidden">
                    <Image
                      src={`/media/${v.img}-400.webp`}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <span className="t-bangla text-[clamp(1.4rem,3.2vw,2.15rem)] leading-none transition-colors duration-300 group-hover:text-gold-deep">
                    {v.bn}
                  </span>
                  <span className="t-eyebrow text-text-on-bone-dim">{v.rom}</span>
                  <span className="ml-auto hidden text-sm text-text-on-bone-dim sm:block">
                    {v.en}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-2xl bg-bone-sink">
              {vocabulary.map((v, i) => (
                <Image
                  key={v.rom}
                  src={`/media/${v.img}-800.webp`}
                  alt={`${v.rom} — ${v.en}`}
                  fill
                  sizes="420px"
                  className={cn(
                    "object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out-apple)]",
                    i === active ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
