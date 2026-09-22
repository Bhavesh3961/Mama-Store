import { offers } from "@/data/offers";
import { products } from "@/data/products";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/shop", "/search", "/categories", "/brands", "/offers", "/contact", "/store", "/cart", "/checkout", "/account"];
  const extra = [...products.map((p) => `/product/${p.slug}`), ...offers.map((o) => `/offers/${o.slug}`)];
  return [...staticPaths, ...extra].map((path) => ({
    url: `https://mama-store.local${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
