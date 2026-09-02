/**
 * The Our Story page.
 *
 * **On the copy.** Every fact here comes from the brand's own about page —
 * crawled to `tools/reference/site-mirror/pages/about.html` — and nothing has
 * been added to it. Brass and silver, traditional handcraft against modern
 * form, ethical sourcing, jewellery as personal expression, Tanwy's early
 * exposure to local artisans: all theirs. What has changed is the voice. The
 * Odoo copy is written in the register of a catalogue listing ("exquisitely
 * designed pieces", "wearable art that resonates with your life and style"),
 * and this site does not speak that way anywhere else — the homepage already
 * writes its own sub-heads and its own maker paragraph. Setting the about page
 * in template English while the homepage is spare and concrete would make the
 * story page read as the least considered thing on the site.
 *
 * What is deliberately absent is as important: there is no founding year, no
 * headcount, no artisan count, no award. Those are the numbers an about page
 * wants most and they are not on the record anywhere we crawled. A house that
 * puts authorship at the centre of its story cannot invent its own.
 *
 * The Armani line is quoted because it can be attributed exactly — the same
 * rule `story.ts` applies to the Bangla verse. It is the brand's own chosen
 * epigraph and it sits here where the real page puts it, beside the founder.
 */

import type { Chapter } from "@/data/story";

/**
 * Five marks, reusing the homepage's chapter device.
 *
 * The ids are deliberately not the homepage's seven — `ChapterRail` observes
 * those by id, finds none of them here, and stays folded away. An interior
 * page borrowing the rail would be claiming a spine it does not have.
 *
 * The count restarts at ০১ rather than continuing from ০৭ because this is a
 * different telling, not a continuation. Bangla numerals for the same reason
 * they are used on the homepage: if the taxonomy counts in Bangla, so does
 * everything else, or the Bangla is ornament.
 */
export const aboutSections: readonly Chapter[] = [
  { id: "ghor", num: "০১", bn: "ঘর", rom: "Ghor", en: "The house" },
  { id: "drishti", num: "০২", bn: "দৃষ্টি", rom: "Drishti", en: "The vision" },
  { id: "haat", num: "০৩", bn: "হাত", rom: "Haat", en: "The hand" },
  { id: "nokshakar", num: "০৪", bn: "নকশাকার", rom: "Nokshakar", en: "The designer" },
  { id: "thikana", num: "০৫", bn: "ঠিকানা", rom: "Thikana", en: "The address" },
] as const;

export const aboutSection = Object.fromEntries(
  aboutSections.map((s) => [s.id, s]),
) as Record<string, Chapter>;

/**
 * The page title.
 *
 * The Bangla is not the English in another script. "এক জোড়া হাত, একটি করে
 * গয়না" — one pair of hands, one ornament at a time — is the production fact
 * the headline only implies, and it is the reason the catalogue is as small
 * as it is.
 */
export const hero = {
  eyebrow: "Our Story",
  bn: "এক জোড়া হাত, একটি করে গয়না",
  lines: ["Every piece", "has a maker."],
  sub:
    "A handcrafted jewellery house in Dhaka. Brass and silver, drawn by hand " +
    "and finished by hand.",
} as const;

/** ০১ — who Canvas is. */
export const house = {
  lines: ["The forms are", "already known."],
  lede:
    "The workshop is off a residential road in Niketan, Gulshan-1, and " +
    "everything the house sells is made there.",
  body: [
    "The shapes are the ones this country already has — hasuli, jhumka, nupur, " +
    "bicha, noth. What Canvas changes is the proportion. A collar that sat " +
    "under a wedding sari is redrawn to clear a shirt collar; the weight comes " +
    "down until a piece made for one afternoon can be worn on a Tuesday.",
    "Nothing is cast in a run of five hundred. Each piece is worked by hand, " +
    "which is also why no two are identical and why the catalogue stays small. " +
    "That is the trade the house has chosen.",
  ],
} as const;

/**
 * The three claims the brand makes about itself, reduced to the shortest form
 * that is still true. A row of these is the one place an about page is allowed
 * to be terse.
 */
export const pillars = [
  {
    bn: "পিতল ও রুপা",
    rom: "Brass & silver",
    body:
      "Two metals, worked cold and finished by hand. Sourced responsibly — the " +
      "house treats where a material comes from as part of the making, not a " +
      "line in a policy.",
  },
  {
    bn: "হাতের কাজ",
    rom: "Handwork",
    body:
      "Traditional technique held to, rather than reproduced. The tools and the " +
      "sequence are the old ones; what the hand is asked to make is not.",
  },
  {
    bn: "নিজের মতো",
    rom: "Your own",
    body:
      "Ornament is how a person says something without speaking. The house " +
      "designs toward that, which is why so much of the work is commissioned " +
      "one piece at a time.",
  },
] as const;

/** ০২ — the vision, in the brand's own terms. */
export const vision = {
  lines: ["Kept in use,", "not in glass."],
  body: [
    "The intent is not to preserve Bengali ornament under glass. A form that is " +
    "only ever reproduced is already finished — it survives as a museum label " +
    "rather than as something a person owns and wears out.",
    "So the house holds the craft exactly and moves everything else: scale, " +
    "weight, where on the body a piece sits, what it can be worn with. The " +
    "measure of it is whether a piece outlives the occasion it was bought for, " +
    "and then outlives the person who bought it.",
  ],
} as const;

/**
 * ০৩ — the sheet a piece is worked out on.
 *
 * The captions describe what is actually printed on each card, read off the
 * images themselves rather than off `manifest.json`, which calls two of them
 * "spec sheet" and is misleading: these are not elevations and sections. Each
 * one is a motif drawn from life, the belief attached to it written out beside
 * the drawing, and the piece it becomes worked out underneath. Captioning a
 * pair of myna as a technical drawing would be describing an asset nobody had
 * looked at.
 */
export const hand = {
  lines: ["It starts", "on paper."],
  body:
    "Every piece begins as a sheet. The motif is drawn from life, what it means " +
    "is written out beside it, and the ornament it turns into is worked out " +
    "underneath — so what a piece is about is settled long before any metal is " +
    "cut. The motifs are local almost without exception: the birds in the " +
    "courtyard, the fish in the rivers, the flowers in the garden.",
  sheets: [
    {
      img: "sheet-neckpiece-spec",
      caption:
        "Jora Shalik — a pair of myna, which the belief holds bring harmony and " +
        "good fortune, and the neckpiece drawn beneath them.",
    },
    {
      img: "sheet-brass-fish",
      caption:
        "Brass Fish — Koi, Rupchanda and Katla, native to the country's rivers, " +
        "with the border cut as a wave.",
    },
    {
      img: "sheet-moss-rose-spec",
      caption:
        "Moss Rose — the flower resolved into brass, stones and pearl.",
    },
  ],
} as const;

/** ০৪ — the founder. */
export const founder = {
  lines: ["Trained to draw", "buildings."],
  /**
   * Her design credo, and the one line on this page set as a quotation.
   * Attributed exactly — see the note at the top of this file.
   */
  credo: {
    text:
      "To create something exceptional, your mindset must be relentlessly " +
      "focused on the smallest detail.",
    attribution: "Giorgio Armani",
  },
  body: [
    "Tanwy Kabir is an architect by training, and Canvas is what happened when " +
    "that training was pointed at something that fits in a hand. The habits " +
    "carried over intact: draw it first, resolve it at full size, decide the " +
    "proportion before you decide the ornament.",
    "She came to the craft early, through the local artisans whose work she grew " +
    "up around, and founded Canvas to keep that work in circulation rather than " +
    "in memory. She designs toward pieces that mean something to the person " +
    "wearing them, insists on materials the house can account for, and spends " +
    "much of her time arguing the case for the country's craftspeople to anyone " +
    "who will listen.",
  ],
} as const;

/** ০৫ — where the work is. */
export const visit = {
  lines: ["Come and", "hold one."],
  body:
    "The shop is the workshop. Pieces can be seen, tried and commissioned in " +
    "person, and anything in the catalogue can be adjusted to fit before it " +
    "leaves.",
} as const;
