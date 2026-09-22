export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tone: string;
};

export const categories: Category[] = [
  {
    id: "cat-skincare",
    name: "Skincare",
    slug: "skincare",
    description: "Cleansers, moisturisers and everyday face care.",
    tone: "#eadfd4",
  },
  {
    id: "cat-makeup",
    name: "Makeup",
    slug: "makeup",
    description: "Colour, lips, eyes and complexion products.",
    tone: "#e7d3d4",
  },
  {
    id: "cat-hair",
    name: "Hair",
    slug: "hair",
    description: "Shampoo, oil and styling essentials.",
    tone: "#ddd6c8",
  },
  {
    id: "cat-bath",
    name: "Bath & body",
    slug: "bath-body",
    description: "Soaps, lotions and personal care.",
    tone: "#dce4dc",
  },
  {
    id: "cat-fragrance",
    name: "Fragrance",
    slug: "fragrance",
    description: "Attars, mists and everyday scent.",
    tone: "#e4dce8",
  },
  {
    id: "cat-mens",
    name: "Men’s grooming",
    slug: "mens-grooming",
    description: "Shave, wash and grooming basics.",
    tone: "#d7dde4",
  },
  {
    id: "cat-combos",
    name: "Combos & gifts",
    slug: "combos",
    description: "Ready sets for gifting and festivals.",
    tone: "#efe4cc",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
