import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { filterProducts, type ProductFilters, type SortKey } from "@/data/catalog";
import { getAllProductsForCatalog } from "@/lib/db/queries";
import { ShopToolbar, ShopCategoryStrip } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/product/ProductCard";
import { SearchForm } from "@/components/search/SearchForm";
import { getBrand } from "@/data/brands";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "All Products · 100% Authentic Cosmetics · Mama Store",
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
    availability: "all",
    sort: (first(sp.sort) as SortKey) || "featured",
  };

  // If visiting directly for a brand, route to dedicated branded boutique
  if (filters.brand) {
    const matchedBrand = getBrand(filters.brand);
    if (matchedBrand) {
      redirect(`/brands/${matchedBrand.slug}`);
    }
  }

  const dbProducts = getAllProductsForCatalog();
  const list = filterProducts(filters, dbProducts);

  return (
    <div className="page page-theme-shop">
      <div className="shell">
        {/* Compact Collection Header */}
        <div className="shop-editorial-header">
          <h1 className="shop-title">All Products</h1>
          <span className="eyebrow-accent">
            <span className="accent-sparkle">✦</span> Pali Boutique · 100% Authentic
          </span>
        </div>

        {/* Search Bar */}
        <div className="shop-search-wrap">
          <SearchForm initial={filters.query ?? ""} />
        </div>

        {/* 1. Category Navigation Strip */}
        <Suspense fallback={null}>
          <ShopCategoryStrip />
        </Suspense>

        {/* 2. Clean Count & Sort Bar */}
        <Suspense fallback={null}>
          <ShopToolbar count={list.length} />
        </Suspense>

        {/* 3. Direct Full-Width Product Grid */}
        <div className="shop-full-grid-wrap" style={{ marginTop: 12 }}>
          <ProductGrid products={list} />
        </div>
      </div>
    </div>
  );
}
