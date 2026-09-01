import { Hero } from "@/components/sections/Hero";
import { Courtyard } from "@/components/sections/Courtyard";
import { Vocabulary } from "@/components/sections/Vocabulary";
import { Craft } from "@/components/sections/Craft";
import { Atelier } from "@/components/sections/Atelier";
import { Collections } from "@/components/sections/Collections";
import { Worn } from "@/components/sections/Worn";
import { Maker } from "@/components/sections/Maker";
import { Bridal } from "@/components/sections/Bridal";
import { Ambient } from "@/components/sections/Ambient";
import { Featured } from "@/components/sections/Featured";

/**
 * Seven chapters, and the shop either side of them.
 *
 * The order is the life of a piece, not a list of modules:
 *
 *   ০১ মাটি    the soil      courtyard      where the form comes from
 *   ০২ নাম     the names     —              what it is called, in Bangla
 *   ০৩ রেখা    the line      sketch         the drawing that starts it
 *   ০৪ সোনা    the gold      atelier case   the metal, and the box it lives in
 *   ০৫ পরা     the wearing   jasmine·nupur  where on the body it belongs
 *   ০৬ দিন     the day       bridal         the occasion it is bought for
 *   ০৭ স্মৃতি   what remains  diya           what happens to it afterwards
 *
 * All eight clips are spoken for — the hero holds the eighth, before the
 * count begins. Every one of them is a different mechanic: masked reveal,
 * scrub, scrub, parallax pair, drifting loop, held loop. Giving them all the
 * same treatment is what turns a technique into a template.
 *
 * The light/dark rhythm still runs underneath: ink → bone → ink. Chapter ০৪
 * is written on bone and falls into the dark mid-section, which is the one
 * place the inversion happens inside a chapter rather than between two.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Courtyard />
      <Vocabulary />
      <Craft />
      <Atelier />
      <Collections />
      <Worn />
      <Maker />
      <Bridal />
      <Ambient />
      <Featured />
    </>
  );
}
