"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { categories } from "@/data/categories";
import type { SortKey } from "@/data/catalog";

const sorts: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New arrivals" },
  { value: "bestselling", label: "Best sellers" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const categoryIcons: Record<string, string> = {
  skincare: "💧",
  makeup: "💄",
  hair: "🌿",
  "bath-body": "🛁",
  fragrance: "🌸",
  "mens-grooming": "🧔",
  combos: "🎁",
};

/**
 * 1. Category Scroll Strip — Displays all categories on mobile & desktop
 */
export function ShopCategoryStrip() {
  const router = useRouter();
  const params = useSearchParams();
  const currentCategory = params.get("category") ?? "";

  const handleSelect = (slug: string) => {
    const next = new URLSearchParams(params.toString());
    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }
    router.push(`/shop?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="shop-category-strip-wrapper" aria-label="Product Categories">
      <div className="shop-category-strip-header">
        <span className="strip-title-eyebrow">
          <span className="strip-dot-pulse" />
          <span>Shop by Category</span>
        </span>
        {currentCategory ? (
          <button
            type="button"
            onClick={() => handleSelect("")}
            className="strip-reset-btn"
          >
            Show All
          </button>
        ) : null}
      </div>

      <div className="shop-category-scroll-row">
        {/* All Products pill */}
        <button
          type="button"
          onClick={() => handleSelect("")}
          className={`shop-category-pill ${!currentCategory ? "active" : ""}`}
          aria-pressed={!currentCategory}
        >
          <span className="cat-pill-icon">✨</span>
          <span className="cat-pill-text">All Collection</span>
        </button>

        {/* Individual category pills */}
        {categories.map((c) => {
          const isActive = currentCategory === c.slug || currentCategory === c.id;
          const icon = categoryIcons[c.slug] || "✦";
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelect(c.slug)}
              className={`shop-category-pill ${isActive ? "active" : ""}`}
              aria-pressed={isActive}
              style={{
                ["--cat-accent" as string]: c.tone || "#18231C",
              }}
            >
              <span className="cat-pill-icon">{icon}</span>
              <span className="cat-pill-text">{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 2. Clean Shop Toolbar — Sort Selector & Item Counter (No cluttery brand/budget/availability filters)
 */
export function ShopToolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();

  const category = params.get("category") ?? "";
  const sort = (params.get("sort") as SortKey) || "featured";
  const query = useMemo(() => new URLSearchParams(params.toString()), [params]);

  function setSort(value: SortKey) {
    const next = new URLSearchParams(query);
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  function removeCategory() {
    const next = new URLSearchParams(query);
    next.delete("category");
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="shop-filter-bar-container" style={{ marginBottom: 16 }}>
      {/* Main Action Row: Count on Left, Sort on Right */}
      <div
        className="shop-toolbar-main-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <p className="shop-item-counter" style={{ margin: 0, fontSize: "0.95rem" }}>
          <strong>{count}</strong> {count === 1 ? "product" : "products"} available
        </p>

        {/* Sort selector */}
        <div className="shop-sort-picker-wrap">
          <label htmlFor="shop-sort-select" className="sr-only">
            Sort by
          </label>
          <select
            id="shop-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="select-neo-sort-compact"
            aria-label="Sort products"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Category Filter Tag Pill */}
      {category ? (
        <div className="active-filters-strip" style={{ marginTop: 12 }}>
          <span className="active-filters-label">Active:</span>
          <button
            type="button"
            className="active-filter-tag"
            onClick={removeCategory}
            title="Remove category filter"
          >
            <span>Category: {categories.find((c) => c.slug === category)?.name || category}</span>
            <span className="tag-remove-x">✕</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Legacy stub: DesktopFilters is removed per user request for a direct full-width catalog
 */
export function DesktopFilters() {
  return null;
}

/**
 * Legacy stub: FilterFields removed per user request
 */
export function FilterFields() {
  return null;
}
