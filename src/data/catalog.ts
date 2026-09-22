import { brands } from "./brands";
import { categories } from "./categories";
import { offers } from "./offers";
import { products, type Product } from "./products";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "bestselling";

export type ProductFilters = {
  query?: string;
  category?: string;
  brand?: string;
  offer?: string;
  availability?: "all" | "in-stock" | "out-of-stock";
  priceMin?: number;
  priceMax?: number;
  onOffer?: boolean;
  sort?: SortKey;
};

export function brandOf(product: Product) {
  return brands.find((b) => b.id === product.brandId);
}

export function categoryOf(product: Product) {
  return categories.find((c) => c.id === product.categoryId);
}

export function offersOf(product: Product) {
  return offers.filter((o) => product.offerIds.includes(o.id));
}

export function relatedProducts(product: Product) {
  return product.relatedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export function filterProducts(filters: ProductFilters, sourceProducts?: Product[]) {
  const q = filters.query?.trim().toLowerCase();
  const pool = sourceProducts ?? products;
  let list = pool.filter((p) => {
    if (q) {
      const brand = brandOf(p)?.name.toLowerCase() ?? "";
      const cat = categoryOf(p)?.name.toLowerCase() ?? "";
      const hay = `${p.name} ${brand} ${cat} ${p.description}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.category) {
      const cat = categoryOf(p);
      if (cat?.slug !== filters.category && p.categoryId !== filters.category && cat?.id !== filters.category) {
        return false;
      }
    }
    if (filters.brand) {
      const b = brandOf(p);
      if (b?.slug !== filters.brand && p.brandId !== filters.brand && b?.id !== filters.brand) {
        return false;
      }
    }
    if (filters.offer) {
      const match = p.offerIds.some((id) => {
        const o = offers.find((off) => off.id === id);
        return o?.slug === filters.offer || id === filters.offer;
      });
      if (!match) return false;
    }
    if (filters.onOffer && p.offerIds.length === 0) return false;
    if (filters.availability === "in-stock" && !p.inStock) return false;
    if (filters.availability === "out-of-stock" && p.inStock) return false;
    if (filters.priceMin != null && (p.price == null || p.price < filters.priceMin)) return false;
    if (filters.priceMax != null && (p.price == null || p.price > filters.priceMax)) return false;
    return true;
  });

  const sort = filters.sort ?? "featured";
  list = [...list].sort((a, b) => {
    if (sort === "newest") {
      return Number(b.isNew) - Number(a.isNew) || (b.rating ?? 0) - (a.rating ?? 0);
    }
    if (sort === "bestselling") {
      return Number(b.isBestseller) - Number(a.isBestseller) || b.reviewCount - a.reviewCount;
    }
    if (sort === "price-asc") {
      const priceA = a.price ?? 999999;
      const priceB = b.price ?? 999999;
      return priceA - priceB;
    }
    if (sort === "price-desc") {
      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      return priceB - priceA;
    }
    return Number(b.isBestseller) - Number(a.isBestseller) || Number(b.isNew) - Number(a.isNew);
  });

  return list;
}

export function newArrivals() {
  return products.filter((p) => p.isNew);
}

export function bestsellers() {
  return products.filter((p) => p.isBestseller);
}

export function offerProducts(offerId: string) {
  return products.filter((p) => p.offerIds.includes(offerId));
}
