import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { filterProducts, type ProductFilters, type SortKey } from "@/data/catalog";
import { getAllProductsForCatalog } from "@/lib/db/queries";
import { ShopToolbar, ShopCategoryStrip } from "@/components/shop/ShopFilters";
import { ProductGrid } from "@/components/product/ProductCard";
import { SearchForm } from "@/components/search/SearchForm";
import { getBrand } from "@/data/brands";
import { categories } from "@/data/categories";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "All Products · 100% Authentic Cosmetics · Mama Store",
  description: "Explore authentic skincare, makeup, luxury fragrances, haircare, and daily beauty essentials at Mama Store Pali.",
};

const categoryIcons: Record<string, string> = {
  skincare: "💧",
  makeup: "💄",
  hair: "🌿",
  "bath-body": "🛁",
  fragrance: "🌸",
  "mens-grooming": "🧔",
  combos: "🎁",
};

const departmentOrder = ["cat-skincare", "cat-hair", "cat-makeup", "cat-bath", "cat-fragrance", "cat-mens", "cat-combos"];

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

  const isDefaultBrowse = !filters.category && !filters.query && filters.sort === "featured";

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

        {/* 3. Organized Catalog: Grouped by Department on Default View, or Filtered Grid */}
        {isDefaultBrowse ? (
          <div className="shop-organized-departments" style={{ marginTop: 20 }}>
            {departmentOrder.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              const catProducts = list.filter((p) => p.categoryId === cat.id);
              if (!catProducts.length) return null;

              return (
                <section key={cat.id} className="shop-dept-group" style={{ marginBottom: 36 }}>
                  <div
                    className="shop-dept-header"
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "space-between",
                      marginBottom: 14,
                      paddingBottom: 8,
                      borderBottom: "1.5px solid rgba(27, 21, 18, 0.08)",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: "1.25rem" }}>{categoryIcons[cat.slug] || "✦"}</span>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--ink)" }}>
                          {cat.name}
                        </h2>
                        <span
                          style={{
                            fontSize: "0.76rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            background: "rgba(27, 21, 18, 0.06)",
                            borderRadius: 99,
                            color: "var(--muted)",
                          }}
                        >
                          {catProducts.length} items
                        </span>
                      </div>
                      <p style={{ margin: "4px 0 0", fontSize: "0.84rem", color: "var(--muted)" }}>
                        {cat.description}
                      </p>
                    </div>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--gold)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span>Explore {cat.name}</span>
                      <span>→</span>
                    </Link>
                  </div>

                  <ProductGrid products={catProducts} />
                </section>
              );
            })}
          </div>
        ) : (
          <div className="shop-full-grid-wrap" style={{ marginTop: 12 }}>
            <ProductGrid products={list} />
          </div>
        )}
      </div>
    </div>
  );
}
