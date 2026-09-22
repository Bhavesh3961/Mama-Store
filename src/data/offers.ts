export type Offer = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  badge: string;
  kind: "promo" | "festival";
  productIds: string[];
  discount: string;
};

export const offers: Offer[] = [
  {
    id: "off-festive",
    title: "Festival Mega Glam & Bridal Combos",
    slug: "festival-glam-combos",
    summary: "Up to 40% OFF on bridal hampers, festive lipsticks, and complete makeup trousseau boxes with complimentary gift packaging.",
    badge: "Festival Special",
    discount: "UP TO 40% OFF",
    kind: "festival",
    productIds: [
      "p-festive-bridal-combo",
      "p-mac-foundation",
      "p-huda-lipstick",
      "p-lakme-kajal",
      "p-maybelline-lipstick",
    ],
  },
  {
    id: "off-bestseller",
    title: "Bestseller Steal Deals: Maybelline & L'Oréal",
    slug: "bestseller-steals",
    summary: "Top-selling everyday skincare and makeup at exclusive discounted prices. Guaranteed genuine stock direct from authorized Indian distributors.",
    badge: "Steal Deal",
    discount: "UP TO 35% OFF",
    kind: "promo",
    productIds: [
      "p-maybelline-lipstick",
      "p-loreal-hyaluronic-serum",
      "p-maybelline-mascara",
      "p-ordinary-niacinamide",
      "p-minimalist-vitc",
    ],
  },
  {
    id: "off-salon",
    title: "Salon & Parlour Wholesale Privilege",
    slug: "salon-wholesale-privilege",
    summary: "Dedicated wholesale rates for Pali salons and parlours on professional foundations, hair treatment oils, and clinical hydrators.",
    badge: "Salon Wholesale",
    discount: "WHOLESALE RATES",
    kind: "promo",
    productIds: [
      "p-mac-foundation",
      "p-loreal-hair-serum",
      "p-clinique-moisture",
      "p-loreal-hyaluronic-serum",
      "p-forest-soundarya",
    ],
  },
];

export function getOffer(slug: string) {
  return offers.find((o) => o.slug === slug);
}
