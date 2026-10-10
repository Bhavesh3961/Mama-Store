import { Suspense } from "react";
import type { Metadata } from "next";
import { filterProducts, type ProductFilters, type SortKey } from "@/data/catalog";
import { getAllProductsForCatalog } from "@/lib/db/queries";
import { DesktopFilters, ShopToolbar, ShopCategoryStrip } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/product/ProductCard";
import { SearchForm } from "@/components/search/SearchForm";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Explore Collection · 100% Authentic Cosmetics · Mama Store",
  description: "Explore authentic skincare, makeup, luxury fragrances, haircare, and daily beauty essentials at Mama Store Pali.",
};

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filters: ProductFilters = {
    query: first(sp.q),
    category: first(sp.category),
    brand: first(sp.brand),
    offer: first(sp.offer),
    availability: (first(sp.availability) as ProductFilters["availability"]) || "all",
    priceMin: first(sp.min) ? Number(first(sp.min)) : undefined,
    priceMax: first(sp.max) ? Number(first(sp.max)) : undefined,
    sort: (first(sp.sort) as SortKey) || "featured",
  };
  const dbProducts = getAllProductsForCatalog();
  const list = filterProducts(filters, dbProducts);

  return (
    <div className="page page-theme-shop">
      <div className="shell">
        {/* Compact Collection Header — just a wayfinder, not a hero */}
        <div className="shop-editorial-header">
          <h1 className="shop-title">Collection</h1>
          <span className="eyebrow-accent">
            <span className="accent-sparkle">✦</span> Pali Boutique · 100% Authentic
          </span>
        </div>

        {/* Search Bar */}
        <div className="shop-search-wrap">
          <SearchForm initial={filters.query ?? ""} />
        </div>

        {/* 1. ALL DIFFERENT CATEGORIES COME FIRST */}
        <Suspense fallback={null}>
          <ShopCategoryStrip />
        </Suspense>

        {/* 2. FILTERS, BRANDS & SORT TOOLBAR COME SECOND */}
        <Suspense fallback={null}>
          <ShopToolbar count={list.length} />
        </Suspense>

        {/* 3. PRODUCTS GRID COMES THIRD */}
        <div className="shop-layout">
          <Suspense fallback={null}>
            <DesktopFilters />
          </Suspense>
          <div className="shop-results-column">
            <ProductGrid products={list} />
          </div>
        </div>
      </div>
    </div>
  );
}
