"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { offers } from "@/data/offers";
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
 * 1. Category Scroll Strip — Displays all categories FIRST on mobile & desktop
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
 * Form Fields for Filter options
 */
export function FilterFields({
  idPrefix = "",
  onSelect,
}: {
  idPrefix?: string;
  onSelect?: () => void;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const currentCategory = params.get("category") ?? "";
  const currentBrand = params.get("brand") ?? "";
  const currentOffer = params.get("offer") ?? "";
  const currentAvail = params.get("availability") ?? "all";
  const currentSort = (params.get("sort") as SortKey) || "featured";
  const currentMin = params.get("min") ?? "";
  const currentMax = params.get("max") ?? "";

  const handleInstantSelect = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value && value !== "all" && value !== "featured") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    router.push(`/shop?${next.toString()}`, { scroll: false });
    if (onSelect) onSelect();
  };

  const setPricePreset = (min: string, max: string) => {
    const next = new URLSearchParams(params.toString());
    if (min) next.set("min", min);
    else next.delete("min");
    if (max) next.set("max", max);
    else next.delete("max");
    router.push(`/shop?${next.toString()}`, { scroll: false });
    if (onSelect) onSelect();
  };

  return (
    <div className="filter-fields-wrap">
      {/* Category Pills */}
      <div className="filter-group-lux">
        <h3>
          <span>Category</span>
          {currentCategory ? <span className="cat-deal-tag" style={{ margin: 0 }}>Active</span> : null}
        </h3>
        <div className="filter-options-grid">
          <label className="filter-pill-label">
            <input
              type="radio"
              name={`${idPrefix}category`}
              value=""
              checked={!currentCategory}
              onChange={() => handleInstantSelect("category", "")}
            />
            <span className="filter-pill-span">
              <span className="filter-dot-orb" style={{ background: "#18231C" }} />
              All Categories
            </span>
          </label>
          {categories.map((c) => (
            <label className="filter-pill-label" key={c.id}>
              <input
                type="radio"
                name={`${idPrefix}category`}
                value={c.slug}
                checked={currentCategory === c.slug || currentCategory === c.id}
                onChange={() => handleInstantSelect("category", c.slug)}
              />
              <span className="filter-pill-span">
                <span className="filter-dot-orb" style={{ background: c.tone || "var(--ink)" }} />
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Chips */}
      <div className="filter-group-lux">
        <h3>
          <span>Brand</span>
          {currentBrand ? <span className="cat-deal-tag" style={{ margin: 0 }}>Active</span> : null}
        </h3>
        <div className="filter-options-grid">
          <label className="filter-pill-label">
            <input
              type="radio"
              name={`${idPrefix}brand`}
              value=""
              checked={!currentBrand}
              onChange={() => handleInstantSelect("brand", "")}
            />
            <span className="filter-pill-span">All Brands</span>
          </label>
          {brands.map((b) => (
            <label className="filter-pill-label" key={b.id}>
              <input
                type="radio"
                name={`${idPrefix}brand`}
                value={b.slug}
                checked={currentBrand === b.slug || currentBrand === b.id}
                onChange={() => handleInstantSelect("brand", b.slug)}
              />
              <span className="filter-pill-span">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Price Ranges */}
      <div className="filter-group-lux">
        <h3>
          <span>Budget (₹)</span>
          {currentMin || currentMax ? <span className="cat-deal-tag" style={{ margin: 0 }}>Active</span> : null}
        </h3>
        <div className="filter-options-grid" style={{ marginBottom: 10 }}>
          <button
            type="button"
            className={`filter-pill-span ${!currentMin && currentMax === "299" ? "active-chip" : ""}`}
            onClick={() => setPricePreset("", "299")}
          >
            Under ₹299
          </button>
          <button
            type="button"
            className={`filter-pill-span ${currentMin === "299" && currentMax === "499" ? "active-chip" : ""}`}
            onClick={() => setPricePreset("299", "499")}
          >
            ₹299 – ₹499
          </button>
          <button
            type="button"
            className={`filter-pill-span ${currentMin === "499" && currentMax === "999" ? "active-chip" : ""}`}
            onClick={() => setPricePreset("499", "999")}
          >
            ₹499 – ₹999
          </button>
          <button
            type="button"
            className={`filter-pill-span ${currentMin === "999" && !currentMax ? "active-chip" : ""}`}
            onClick={() => setPricePreset("999", "")}
          >
            Above ₹999
          </button>
        </div>
        <div className="filter-price-inputs">
          <div className="price-input-box">
            <span>₹</span>
            <input
              type="number"
              name={`${idPrefix}min`}
              min={0}
              placeholder="Min"
              defaultValue={currentMin}
            />
          </div>
          <span style={{ color: "var(--muted)", fontWeight: 700 }}>–</span>
          <div className="price-input-box">
            <span>₹</span>
            <input
              type="number"
              name={`${idPrefix}max`}
              min={0}
              placeholder="Max"
              defaultValue={currentMax}
            />
          </div>
        </div>
      </div>

      {/* Sort By Options */}
      <div className="filter-group-lux">
        <h3>
          <span>Sort By</span>
          {currentSort !== "featured" ? <span className="cat-deal-tag" style={{ margin: 0 }}>Active</span> : null}
        </h3>
        <div className="filter-options-grid">
          {sorts.map((s) => (
            <label className="filter-pill-label" key={s.value}>
              <input
                type="radio"
                name={`${idPrefix}sort`}
                value={s.value}
                checked={currentSort === s.value}
                onChange={() => handleInstantSelect("sort", s.value)}
              />
              <span className="filter-pill-span">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Offers */}
      <div className="filter-group-lux">
        <h3>Offers & Deals</h3>
        <div className="filter-options-grid">
          <label className="filter-pill-label">
            <input
              type="radio"
              name={`${idPrefix}offer`}
              value=""
              checked={!currentOffer}
              onChange={() => handleInstantSelect("offer", "")}
            />
            <span className="filter-pill-span">All Products</span>
          </label>
          {offers.map((o) => (
            <label className="filter-pill-label" key={o.id}>
              <input
                type="radio"
                name={`${idPrefix}offer`}
                value={o.slug}
                checked={currentOffer === o.slug}
                onChange={() => handleInstantSelect("offer", o.slug)}
              />
              <span className="filter-pill-span">🔥 {o.title}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-group-lux">
        <h3>Availability</h3>
        <div className="filter-options-grid">
          {[
            ["all", "All Items"],
            ["in-stock", "In Stock Only"],
            ["out-of-stock", "Backorder / Sold Out"],
          ].map(([value, label]) => (
            <label className="filter-pill-label" key={value}>
              <input
                type="radio"
                name={`${idPrefix}availability`}
                value={value}
                checked={currentAvail === value}
                onChange={() => handleInstantSelect("availability", value)}
              />
              <span className="filter-pill-span">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function applyForm(form: HTMLFormElement, search: string, prefix: string) {
  const data = new FormData(form);
  const next = new URLSearchParams(search);
  const pick = (key: string, name: string) => {
    const v = String(data.get(name) ?? "");
    if (v) next.set(key, v);
    else next.delete(key);
  };
  pick("category", `${prefix}category`);
  pick("brand", `${prefix}brand`);
  pick("offer", `${prefix}offer`);
  const avail = String(data.get(`${prefix}availability`) ?? "all");
  if (avail && avail !== "all") next.set("availability", avail);
  else next.delete("availability");
  pick("min", `${prefix}min`);
  pick("max", `${prefix}max`);
  return next;
}

/**
 * Desktop Sidebar Filters — Only displayed on large screens (min-width: 960px)
 */
export function DesktopFilters() {
  const router = useRouter();
  const params = useSearchParams();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = applyForm(e.currentTarget, params.toString(), "d-");
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  function onReset() {
    router.push("/shop", { scroll: false });
  }

  return (
    <aside className="filters desktop-filters-wrapper">
      <form key={params.toString()} onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", margin: 0 }}>
            Filters
          </h2>
          {params.toString() ? (
            <button className="btn-reset-text" type="button" onClick={onReset}>
              Reset
            </button>
          ) : null}
        </div>
        <FilterFields idPrefix="d-" />
        <div className="filter-actions-row" style={{ marginTop: 20 }}>
          <button className="btn-apply-filters" type="submit">
            Apply Price Filter
          </button>
          {params.toString() ? (
            <button className="btn-reset-filters" type="button" onClick={onReset}>
              Reset All
            </button>
          ) : null}
        </div>
      </form>
    </aside>
  );
}

/**
 * 2. Mobile and Responsive Toolbar — Filters, Sort & Quick Brand Chips
 */
export function ShopToolbar({ count }: { count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState<"filter" | "sort" | null>(null);

  const category = params.get("category") ?? "";
  const brand = params.get("brand") ?? "";
  const offer = params.get("offer") ?? "";
  const avail = params.get("availability") ?? "all";
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const sort = (params.get("sort") as SortKey) || "featured";

  const query = useMemo(() => new URLSearchParams(params.toString()), [params]);

  // Count active filters
  const activeCount = useMemo(() => {
    let c = 0;
    if (category) c++;
    if (brand) c++;
    if (offer) c++;
    if (avail && avail !== "all") c++;
    if (min || max) c++;
    if (sort && sort !== "featured") c++;
    return c;
  }, [category, brand, offer, avail, min, max, sort]);

  function setSort(value: SortKey) {
    const next = new URLSearchParams(query);
    if (value === "featured") next.delete("sort");
    else next.set("sort", value);
    router.push(`/shop?${next.toString()}`, { scroll: false });
    setOpen(null);
  }

  function handleQuickBrand(slug: string) {
    const next = new URLSearchParams(query);
    if (slug) {
      next.set("brand", slug);
    } else {
      next.delete("brand");
    }
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  function removeFilter(key: string) {
    const next = new URLSearchParams(query);
    next.delete(key);
    if (key === "price") {
      next.delete("min");
      next.delete("max");
    }
    router.push(`/shop?${next.toString()}`, { scroll: false });
  }

  function clearAll() {
    router.push("/shop", { scroll: false });
    setOpen(null);
  }

  function onFilterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = applyForm(e.currentTarget, params.toString(), "m-");
    router.push(`/shop?${next.toString()}`, { scroll: false });
    setOpen(null);
  }

  return (
    <div className="shop-filter-bar-container">
      {/* Quick Brand Pills Horizontal Scroll */}
      <div className="quick-brand-scroll-wrap" aria-label="Brand shortcuts">
        <span className="quick-brand-label">Brands:</span>
        <button
          type="button"
          onClick={() => handleQuickBrand("")}
          className={`quick-brand-pill ${!brand ? "active" : ""}`}
        >
          All
        </button>
        {brands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => handleQuickBrand(b.slug)}
            className={`quick-brand-pill ${brand === b.slug || brand === b.id ? "active" : ""}`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Main Toolbar Action Row */}
      <div className="shop-toolbar-main-row">
        {/* Mobile Filter Button */}
        <button
          className={`btn-mobile-filter-trigger ${activeCount > 0 ? "has-active" : ""}`}
          type="button"
          onClick={() => setOpen("filter")}
          aria-label="Open filter options"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          <span>Filters</span>
          {activeCount > 0 ? (
            <span className="filter-count-badge">{activeCount}</span>
          ) : null}
        </button>

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

        {/* Item count */}
        <p className="shop-item-counter">
          <strong>{count}</strong> {count === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Active Filters Tag Pills */}
      {activeCount > 0 && (
        <div className="active-filters-strip">
          <span className="active-filters-label">Active:</span>
          {category && (
            <button
              type="button"
              className="active-filter-tag"
              onClick={() => removeFilter("category")}
              title="Remove category filter"
            >
              <span>Category: {categories.find((c) => c.slug === category)?.name || category}</span>
              <span className="tag-remove-x">✕</span>
            </button>
          )}
          {brand && (
            <button
              type="button"
              className="active-filter-tag"
              onClick={() => removeFilter("brand")}
              title="Remove brand filter"
            >
              <span>Brand: {brands.find((b) => b.slug === brand)?.name || brand}</span>
              <span className="tag-remove-x">✕</span>
            </button>
          )}
          {(min || max) && (
            <button
              type="button"
              className="active-filter-tag"
              onClick={() => removeFilter("price")}
              title="Remove price filter"
            >
              <span>Price: ₹{min || 0} – ₹{max || "Any"}</span>
              <span className="tag-remove-x">✕</span>
            </button>
          )}
          {avail && avail !== "all" && (
            <button
              type="button"
              className="active-filter-tag"
              onClick={() => removeFilter("availability")}
              title="Remove availability filter"
            >
              <span>{avail === "in-stock" ? "In Stock" : "Backorder"}</span>
              <span className="tag-remove-x">✕</span>
            </button>
          )}
          {offer && (
            <button
              type="button"
              className="active-filter-tag"
              onClick={() => removeFilter("offer")}
              title="Remove offer filter"
            >
              <span>Offer Active</span>
              <span className="tag-remove-x">✕</span>
            </button>
          )}
          {activeCount > 1 && (
            <button
              type="button"
              onClick={clearAll}
              className="clear-all-filters-btn"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Slide-up Bottom Sheet Drawer for Mobile Filters */}
      {open ? (
        <>
          <button
            className="sheet-backdrop"
            aria-label="Close filters"
            type="button"
            onClick={() => setOpen(null)}
          />
          <div
            className="sheet mobile-filter-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={open === "filter" ? "Filter options" : "Sort options"}
          >
            <div className="sheet-header">
              <div className="sheet-title-group">
                <span className="sheet-drag-handle" />
                <h2 className="sheet-title">
                  {open === "filter" ? "Filters & Refinements" : "Sort Products"}
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {activeCount > 0 ? (
                  <button type="button" onClick={clearAll} className="sheet-reset-btn">
                    Reset
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="sheet-close-btn"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="sheet-body-scroll">
              {open === "sort" ? (
                <div className="actions-stack">
                  {sorts.map((s) => (
                    <button
                      key={s.value}
                      className={`btn secondary ${sort === s.value ? "active" : ""}`}
                      type="button"
                      onClick={() => setSort(s.value)}
                    >
                      {s.label} {sort === s.value ? "✓" : ""}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={onFilterSubmit} className="mobile-filter-form">
                  <FilterFields idPrefix="m-" onSelect={() => setOpen(null)} />
                  <div className="sheet-sticky-footer">
                    <button className="btn btn-show-results" type="submit">
                      Show {count} Products
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
