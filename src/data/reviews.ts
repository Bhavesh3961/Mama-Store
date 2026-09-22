export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  productId?: string;
};

/** Sample customer comments for layout only — not verified purchases. */
export const reviews: Review[] = [
  {
    id: "r1",
    author: "Sample customer A",
    rating: 5,
    title: "Easy to browse",
    body: "Placeholder review: found the category list clear and asked for a product on WhatsApp.",
    productId: "p-moisturiser",
  },
  {
    id: "r2",
    author: "Sample customer B",
    rating: 4,
    title: "City delivery note",
    body: "Placeholder review: delivery within Pali was the reason for ordering from the listing.",
    productId: "p-body-lotion",
  },
  {
    id: "r3",
    author: "Sample customer C",
    rating: 5,
    title: "Shade options",
    body: "Placeholder review: lipstick shades on the product page made the choice straightforward.",
    productId: "p-lipstick",
  },
  {
    id: "r4",
    author: "Sample customer D",
    rating: 4,
    title: "Store visit",
    body: "Placeholder review: used Get Directions to reach Pani Darwaja, Nadi Mohalla.",
  },
];
