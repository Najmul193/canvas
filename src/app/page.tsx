import { Hero } from "@/components/sections/Hero";
import { Vocabulary } from "@/components/sections/Vocabulary";
import { Craft } from "@/components/sections/Craft";
import { Collections } from "@/components/sections/Collections";
import { Ambient } from "@/components/sections/Ambient";
import { Maker } from "@/components/sections/Maker";
import { Featured } from "@/components/sections/Featured";

/**
 * Section order is a deliberate light/dark rhythm:
 * ink → bone → ink → bone → ink → bone → ink.
 * The inversion is what gives the page its cadence.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Vocabulary />
      <Craft />
      <Collections />
      <Ambient />
      <Maker />
      <Featured />
    </>
  );
}
