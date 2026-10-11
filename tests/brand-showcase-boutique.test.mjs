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
