/** Brand facts, sourced from canvas-bd.com and the Odoo storefront. */

export const site = {
  name: "Canvas",
  nameBn: "ক্যানভাস",
  tagline: "Grab Your Unique Piece",
  email: "info@canvas-bd.com",
  phone: "+880 1862-042343",
  phoneHref: "tel:+8801862042343",
  address: {
    line1: "5-A, House 12, Road 7",
    line2: "Niketan Housing Society, Gulshan-1",
    city: "Dhaka, Bangladesh",
  },
  social: {
    facebook: "https://www.facebook.com/CanvasByTanwyKabir",
    instagram: "https://www.instagram.com/canvas.2603",
  },
  founder: { name: "Tanwy Kabir", nameBn: "তন্বী কবির", role: "Architect & Designer" },
} as const;

/** Odoo owns the storefront routes. These must not change — they're indexed. */
export const routes = {
  shop: "/shop",
  cart: "/shop/cart",
  login: "/web/login",
  blog: "/blog",
  about: "/about",
  custom: "/custom-jewelry",
  jobs: "/jobs",
  contact: "/contactus",
  terms: "/tc",
  privacy: "/privacy",
} as const;

export const nav = [
  { label: "Jewellery", href: routes.shop },
  { label: "Bridal", href: "/shop/category/bridal-jewelry-65" },
  { label: "Custom", href: routes.custom },
  { label: "Our Story", href: routes.about },
  { label: "Journal", href: routes.blog },
] as const;

/**
 * The taxonomy, in Bangla first. These are the words the craft actually uses;
 * the romanisation is the secondary label, not the other way round.
 */
export const vocabulary = [
  { bn: "হাসুলি", rom: "Hasuli", en: "Collar necklace", img: "p-moyur-hasuli-silver", href: "/shop/category/neckpiece-hasuli-15" },
  { bn: "ঝুমকা", rom: "Jhumka", en: "Bell earring", img: "p-three-layer-jhumka", href: "/shop/category/earpiece-jhumka-28" },
  { bn: "নূপুর", rom: "Nupur", en: "Anklet", img: "p-heritage-nupur", href: "/shop/category/foot-jewelry-nupur-32" },
  { bn: "বিছা", rom: "Bicha", en: "Waist chain", img: "p-moss-ross-bicha", href: "/shop/category/waist-jewelry-bicha-55" },
  { bn: "চুড়", rom: "Chur", en: "Cuff", img: "p-kurichur-brass", href: "/shop/category/hand-jewelry-chur-14" },
  { bn: "বালা", rom: "Bala", en: "Bangle", img: "p-mota-golap-bala-brass", href: "/shop/category/hand-jewelry-bala-13" },
  { bn: "নথ", rom: "Noth", en: "Nose ring", img: "p-fish-noth", href: "/shop/category/nose-jewelry-noth-64" },
  { bn: "খোঁপার কাঁটা", rom: "Khopar Kata", en: "Hairpin", img: "p-leaf-hair-clip", href: "/shop/category/hairpiece-khopar-kata-22" },
] as const;

export const collections = [
  {
    title: "High Jewelry",
    note: "Statement neckpieces and sets",
    img: "hero-silver-collar-portrait",
    href: "/shop/category/high-jewelry-58",
  },
  {
    title: "Bridal",
    note: "For the day, and the years after",
    img: "bridal-gold-collar",
    href: "/shop/category/bridal-jewelry-65",
  },
  {
    title: "Penciled Precious",
    note: "Drawn once, made once",
    img: "atelier-pencil-sketch-hasuli",
    href: "/shop/category/penciled-precious-63",
  },
] as const;
