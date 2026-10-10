export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tone: string;
  image: string;
  popularProducts: string;
  tagline: string;
};

export const categories: Category[] = [
  {
    id: "cat-hair",
    name: "Hair Care & Salon",
    slug: "hair",
    description: "Professional salon shampoos, restorative hair masks, and clinical scalp treatments.",
    tone: "#e8dcce",
    image: "/categories/hair.jpg",
    popularProducts: "L'Oréal Serie Expert · Keratin & Repair Elixirs",
    tagline: "Restorative Salon Care",
  },
  {
    id: "cat-skincare",
    name: "Skincare",
    slug: "skincare",
    description: "Clinical active serums, barrier repair moisturizers, and Korean glass skin cleansers.",
    tone: "#e5ded4",
    image: "/categories/skincare.jpg",
    popularProducts: "Minimalist Active Serums · Mamaearth Glass Skin",
    tagline: "Dewy Radiance & Science",
  },
  {
    id: "cat-bath",
    name: "Bath & Body",
    slug: "bath-body",
    description: "Exfoliating scrub washes, 24K gold polishes, and soothing botanical body elixirs.",
    tone: "#eae2d2",
    image: "/categories/bath-body.jpg",
    popularProducts: "Milau 24K Gold Body Wash · Exfoliating Polishes",
    tagline: "Spa Polishes & 24K Gold",
  },
  {
    id: "cat-fragrance",
    name: "Fragrance & Attars",
    slug: "fragrance",
    description: "Luxury eau de parfums, golden agarwood oud, French mists, and artisanal scents.",
    tone: "#e8dfe0",
    image: "/categories/fragrance.jpg",
    popularProducts: "Bella Vita Honey Oud EDP · French Mists & Pure Attars",
    tagline: "Haute Parfumerie & Oud",
  },
  {
    id: "cat-makeup",
    name: "Makeup & Beauty",
    slug: "makeup",
    description: "High-definition foundations, 16H transfer-proof lip inks, and backstage bridal beauty.",
    tone: "#ebdedc",
    image: "/categories/makeup.jpg",
    popularProducts: "Maybelline SuperStay Ink · M·A·C Studio Fix Fluid",
    tagline: "Couture Color & Complexion",
  },
  {
    id: "cat-mens",
    name: "Men’s Grooming",
    slug: "mens-grooming",
    description: "Re-energizing face washes, beard conditioning, and energizing body care.",
    tone: "#dfdfdb",
    image: "/categories/mens-grooming.jpg",
    popularProducts: "Milau Men's Re-energizing Wash · Facial Cleanse",
    tagline: "Barber Grade & Fresh",
  },
  {
    id: "cat-combos",
    name: "Curated Sets & Gifts",
    slug: "combos",
    description: "Artisanal pampering sets, trousseau kits, and luxury vanity gift boxes.",
    tone: "#efe5d3",
    image: "/categories/combos.jpg",
    popularProducts: "Luxury Skincare Hampers & Salon Gift Sets",
    tagline: "Bridal & Festive Hampers",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

