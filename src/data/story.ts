/**
 * The spine of the homepage.
 *
 * The page is seven chapters, and each one owns one of the eight Veo clips
 * (the hero holds the eighth, before the count starts). The order is the life
 * of a piece: soil → name → line → metal → wearing → the day → what remains.
 * Read straight through, the scroll is a story rather than a list of modules.
 *
 * On the quotations — this matters, so it is written down:
 *
 * Only lines that can be attributed exactly are set as verse. Where the right
 * idea belongs to a poem but not to a line that can be quoted faithfully, it
 * is set as a `figure` instead: a named reference to the work plus our own
 * sentence. Inventing a couplet and hanging a poet's name on it would be the
 * one unforgivable thing on a page about authorship.
 */

export type Chapter = {
  /** Anchor id — also what the chapter rail observes. */
  id: string;
  /** Bangla numeral. The count is part of the typography, not decoration. */
  num: string;
  bn: string;
  rom: string;
  en: string;
};

export const chapters: readonly Chapter[] = [
  { id: "mati", num: "০১", bn: "মাটি", rom: "Mati", en: "The soil" },
  { id: "naam", num: "০২", bn: "নাম", rom: "Naam", en: "The names" },
  { id: "rekha", num: "০৩", bn: "রেখা", rom: "Rekha", en: "The line" },
  { id: "shona", num: "০৪", bn: "সোনা", rom: "Shona", en: "The gold" },
  { id: "pora", num: "০৫", bn: "পরা", rom: "Pora", en: "The wearing" },
  { id: "din", num: "০৬", bn: "দিন", rom: "Din", en: "The day" },
  { id: "smriti", num: "০৭", bn: "স্মৃতি", rom: "Smriti", en: "What remains" },
] as const;

export const chapter = Object.fromEntries(
  chapters.map((c) => [c.id, c]),
) as Record<string, Chapter>;

/** An attributed quotation. Set as verse, Bangla first. */
export type Verse = {
  /** Authored line breaks — never measured. See SplitLines. */
  bn: string[];
  /** Our translation, not a canonical one. Labelled as such in the credit. */
  en: string;
  poet: string;
  poetBn: string;
  /** Work, and the poet's tie to this country, in one line. */
  source: string;
};

/**
 * A named reference to a poem, with our own sentence beside it. Used where the
 * analogy is the poet's but the wording is ours.
 */
export type Figure = {
  bn: string;
  rom: string;
  gloss: string;
  line: string;
  note: string;
};

export const verses: Record<string, Verse> = {
  mati: {
    bn: ["বাংলার মুখ আমি দেখিয়াছি, তাই আমি", "পৃথিবীর রূপ খুঁজিতে যাই না আর"],
    en: "I have seen the face of Bengal — so I go looking for the beauty of the world no longer.",
    poet: "Jibanananda Das",
    poetBn: "জীবনানন্দ দাশ",
    source: "রূপসী বাংলা · born in Barisal, 1899",
  },
  shona: {
    // Not the national anthem, which is the other obvious সোনা line and by
    // some distance the most quoted sentence in the language — on a page it
    // reads as flag, not as poetry. This is the closing couplet of the 1894
    // poem: the boat takes the harvest and leaves the man who grew it, which
    // is the truest thing anyone has written about making something by hand.
    bn: ["শূন্য নদীর তীরে রহিনু পড়ি —", "যাহা ছিল নিয়ে গেল সোনার তরী"],
    en: "I am left on the empty riverbank — the golden boat has taken all I had.",
    poet: "Rabindranath Tagore",
    poetBn: "রবীন্দ্রনাথ ঠাকুর",
    source: "সোনার তরী, 1894 — the closing couplet",
  },
  pora: {
    bn: ["মোর প্রিয়া হবে এসো রানী,", "দেব খোঁপায় তারার ফুল"],
    en: "Come, be my beloved, my queen — I will set star-flowers in your hair.",
    poet: "Kazi Nazrul Islam",
    poetBn: "কাজী নজরুল ইসলাম",
    source: "the national poet of Bangladesh",
  },
};

export const figures: Record<string, Figure> = {
  rekha: {
    bn: "আলপনা",
    rom: "Alpona",
    gloss: "the rice-paste line drawn on a floor before a celebration",
    line: "Nothing begins in Bengal without a line drawn first. The festival comes after.",
    note: "Alpona is drawn to be walked over and washed away. A drawing that survives into metal is the rarer thing.",
  },
  din: {
    bn: "গায়ে হলুদ",
    rom: "Gaye Holud",
    gloss: "the turmeric day — gold goes on before the goodbye",
    line: "Two houses, one afternoon, and every ornament she will be photographed in for the rest of her life.",
    note: "Jasimuddin gave a whole marriage to a quilt in নকশী কাঁথার মাঠ, 1929. We give ours to metal.",
  },
  smriti: {
    bn: "নকশী কাঁথা",
    rom: "Nakshi Kantha",
    gloss: "worn saris stitched into a quilt, one stitch at a time",
    line: "Nothing is thrown away. It is layered, stitched through, and handed down warmer than it came.",
    note: "Jasimuddin, পল্লীকবি — the rural poet — made it the frame for his best-known poem.",
  },
};
