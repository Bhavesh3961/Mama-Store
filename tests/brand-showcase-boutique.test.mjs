import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("Brand showcase: only keep brand logo and name, remove extra text blurb", () => {
  const brandsPage = fs.readFileSync("src/app/brands/page.tsx", "utf8");
  const homeShowcase = fs.readFileSync("src/components/home/LuxuryBrandShowcase.tsx", "utf8");

  // Ensure blurb paragraph is removed from brand cards
  assert.ok(!brandsPage.includes("b.blurb"), "brands page must not render brand blurb");
  assert.ok(!homeShowcase.includes("b.blurb"), "home showcase must not render brand blurb");

  // Ensure origin/badge clutter removed from brand card
  assert.ok(!brandsPage.includes("brand-origin-pill"), "brands page must not render extra origin pills on card");

  // Ensure brand cards link to dedicated /brands/[slug]
  assert.ok(brandsPage.includes("href={`/brands/${b.slug}`}"), "brands page cards must link to /brands/[slug]");
  assert.ok(homeShowcase.includes("href={`/brands/${b.slug}`}"), "home showcase cards must link to /brands/[slug]");

  // Ensure brand logo and name are present
  assert.ok(brandsPage.includes("b.logoUrl"), "brands page must render brand logo");
  assert.ok(brandsPage.includes("b.name"), "brands page must render brand name");
});

test("Brand boutique page: matches brand primary color and aesthetic theme", () => {
  assert.ok(fs.existsSync("src/app/brands/[slug]/page.tsx"), "src/app/brands/[slug]/page.tsx must exist");
  const boutiquePage = fs.readFileSync("src/app/brands/[slug]/page.tsx", "utf8");

  assert.ok(boutiquePage.includes("primaryColor"), "boutique page must use brand primary color");
  assert.ok(boutiquePage.includes("themeBg"), "boutique page must use brand theme background");
  assert.ok(boutiquePage.includes("brand.logoUrl"), "boutique page must display brand logo");
  assert.ok(boutiquePage.includes("ProductGrid"), "boutique page must display brand products in ProductGrid");
});

test("Mobile responsiveness: 2-column mobile grid on small screens", () => {
  const css = fs.readFileSync("src/app/globals.css", "utf8");

  assert.ok(css.includes("luxury-brands-grid"), "globals.css must style luxury-brands-grid");
  assert.ok(css.includes("grid-template-columns: repeat(2, 1fr) !important;"), "globals.css must have 2-column mobile grid");
});

test("All Brands: page displays all brands and is titled All Brands", () => {
  const brandsPage = fs.readFileSync("src/app/brands/page.tsx", "utf8");
  const siteHeader = fs.readFileSync("src/components/layout/SiteHeader.tsx", "utf8");

  assert.ok(brandsPage.includes("brands.map"), "brands page must map over all brands");
  assert.ok(brandsPage.includes("All Brands"), "brands page must be titled All Brands");
  assert.ok(siteHeader.includes('label: "All Brands"'), "header nav must say All Brands");
});

test("Shop page: brand and sidebar filters removed, direct full-width catalog", () => {
  const shopPage = fs.readFileSync("src/app/shop/page.tsx", "utf8");
  const shopFilters = fs.readFileSync("src/components/shop/ShopFilters.tsx", "utf8");

  assert.ok(!shopPage.includes("<DesktopFilters"), "shop page must not render DesktopFilters");
  assert.ok(!shopFilters.includes("quick-brand-pill"), "shop toolbar must not render quick brand filter pills");
  assert.ok(!shopFilters.includes("btn-mobile-filter-trigger"), "shop toolbar must not render filter modal trigger");
  assert.ok(shopPage.includes("ProductGrid"), "shop page must directly render ProductGrid");
});

