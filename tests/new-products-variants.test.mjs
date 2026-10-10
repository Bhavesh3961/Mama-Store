import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Verify new standalone products and packshot assets on disk", async () => {
  // Read products file content to test data
  const productsTs = fs.readFileSync("src/data/products.ts", "utf8");

  // Verify key requested products exist in the catalog
  const requiredSlugs = [
    "mamaearth-rosemary-hair-growth-oil",
    "plix-rosemary-hair-growth-oil",
    "mamaearth-onion-hair-fall-control-shampoo",
    "mamaearth-onion-hair-oil",
    "lakme-peach-milk-gel-moisturiser",
    "mcaffeine-sweet-escape-perfume-body-lotion",
    "dot-and-key-vitamin-c-plus-e-super-bright-moisturizer",
    "dot-and-key-oil-free-moisturizer",
    "bellavita-white-oud-perfume",
    "bellavita-date-woman-perfume",
    "nykaa-wanderlust-japanese-cherry-blossom-body-wash",
    "plix-pineapple-smooth-skin-juicy-body-wash",
    "lux-radiant-body-wash",
    "chemist-at-play-daily-exfoliating-body-wash",
    "chemist-at-play-brightening-body-wash",
    "bellavita-skai-shower-gel",
    "plix-pineapple-de-pigmentation-serum-30ml",
    "plix-guava-glow-serum-30ml",
    "plix-pomegranate-youth-renewal-serum",
    "plix-jamun-acne-control-serum",
    "plix-pineapple-de-pigmentation-juicy-cleanser-face-wash",
    "plix-pomegranate-youth-renewal-cleanser-face-wash",
    "plix-jamun-active-acne-face-wash",
    "plix-guava-glow-cleanser-face-wash",
    "wishcare-sunscreen-body-lotion",
    "derma-co-1-percent-kojic-acid-daily-facewash",
    "nykaa-naturals-rice-water-and-glycolic-acid-face-wash",
    "dot-and-key-hydrating-gentle-facewash",
    "dot-and-key-niacinamide-gel-facewash",
    "plum-green-tea-pore-cleansing-face-wash",
    "chemist-at-play-vitamin-c-brightening-boost-face-wash",
    "dot-and-key-barrier-repair-sunscreen-spf-50",
    "dot-and-key-super-bright-sunscreen-spf-50",
    "dot-and-key-micellar-face-wash-120ml",
    "plix-flax-seed-ultra-smooth-shampoo",
    "plix-ultra-smooth-flax-seed-conditioner",
    "plix-guava-glow-sunscreen",
    "plix-pineapple-advanced-de-pigmentation-sunscreen",
    "nivea-men-deep-impact-deodorant",
    "nivea-pearl-and-beauty-deodorant",
    "pilgrim-korean-black-rice-and-rosemary-water-spray",
    "wishcare-vitamin-c-sunscreen-spf-50",
  ];

  for (const slug of requiredSlugs) {
    assert.ok(
      productsTs.includes(`slug: "${slug}"`),
      `Expected product with slug "${slug}" to be present in products.ts`
    );
  }

  // Verify packshot files exist on disk in public/products/
  const expectedImages = [
    "mamaearth-rosemary-oil.png",
    "plix-rosemary-oil.jpg",
    "mamaearth-onion-shampoo.png",
    "mamaearth-onion-oil.png",
    "lakme-peach-milk-gel.jpg",
    "mcaffeine-sweet-escape-lotion.jpg",
    "dotkey-vitc-moisturizer.jpg",
    "dotkey-oilfree-moisturizer.jpg",
    "bellavita-white-oud.jpg",
    "bellavita-date-woman.jpg",
    "nykaa-wanderlust-cherry.jpg",
    "nykaa-wanderlust-sea-salt.jpg",
    "nykaa-wanderlust-macadamia.jpg",
    "nykaa-wanderlust-green-apple.jpg",
    "plix-pineapple-body-wash.jpg",
    "lux-radiant-glow-body-wash.jpg",
    "chemistatplay-exfoliating-body-wash.jpg",
    "chemistatplay-brightening-body-wash.jpg",
    "bellavita-skai-shower-gel.jpg",
    "plix-pineapple-depigmentation-serum.jpg",
    "plix-guava-glow-serum.jpg",
    "plix-pomegranate-serum.jpg",
    "plix-jamun-serum.jpg",
    "plix-pineapple-cleanser.jpg",
    "plix-guava-cleanser.jpg",
    "plix-pomegranate-cleanser.jpg",
    "plix-jamun-cleanser.jpg",
    "wishcare-sunscreen-body-lotion.jpg",
    "dermaco-1-kojic-acid-facewash.jpg",
    "nykaa-fw-ricewater.jpg",
    "nykaa-fw-saffron.jpg",
    "nykaa-fw-berries.jpg",
    "dotkey-facewash-barrier.jpg",
    "dotkey-facewash.jpg",
    "dotkey-facewash-watermelon.jpg",
    "dotkey-sunscreen-barrier.jpg",
    "dotkey-sunscreen-vitc.jpg",
    "dotkey-sunscreen-cooling.jpg",
    "dotkey-sunscreen-mattifying.jpg",
    "plum-greentea-facewash.jpg",
    "plum-saffron-facewash.jpg",
    "plum-niacinamide-facewash.jpg",
    "chemistatplay-salicylic-facewash.jpg",
    "chemistatplay-hydrating-facewash.jpg",
    "chemistatplay-aha-facewash.jpg",
    "dotkey-micellar-facewash.jpg",
    "plix-flaxseed-shampoo.jpg",
    "plix-flaxseed-conditioner.jpg",
    "plix-guava-sunscreen.jpg",
    "plix-pineapple-sunscreen.jpg",
    "nivea-men-deep-impact.jpg",
    "nivea-pearl-beauty.jpg",
    "pilgrim-korean-black-rice-mist.jpg",
    "wishcare-vitc-sunscreen.png",
  ];

  for (const img of expectedImages) {
    const fullPath = path.join("public", "products", img);
    assert.ok(
      fs.existsSync(fullPath),
      `Expected image file ${fullPath} to exist on disk`
    );
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 1000, `Image ${fullPath} must be non-empty (was ${stat.size} bytes)`);
  }

  // Ensure shampoo and conditioner have distinct images
  assert.ok(
    productsTs.includes(`id: "p-plix-flaxseed-shampoo"`) &&
    productsTs.includes(`/products/plix-flaxseed-shampoo.jpg`),
    "Shampoo must have its own image"
  );
  assert.ok(
    productsTs.includes(`id: "p-plix-flaxseed-conditioner"`) &&
    productsTs.includes(`/products/plix-flaxseed-conditioner.jpg`),
    "Conditioner must have its own distinct conditioner image"
  );
});

test("Verify Top Brands have genuine logos and active collections", async () => {
  const brandsTs = fs.readFileSync("src/data/brands.ts", "utf8");

  const activeBrands = [
    { name: "Plix", logo: "plix.png" },
    { name: "Dot & Key", logo: "dotkey.svg" },
    { name: "Nykaa", logo: "nykaa.svg" },
    { name: "Chemist at Play", logo: "chemistatplay.png" },
    { name: "Mamaearth", logo: "mamaearth.png" },
    { name: "Bella Vita Luxury", logo: "bellavita.png" },
    { name: "Plum Goodness", logo: "plum.svg" },
    { name: "WishCare", logo: "wishcare.png" },
    { name: "Nivea", logo: "nivea.svg" },
    { name: "Lakmé", logo: "lakme.png" },
    { name: "mCaffeine", logo: "mcaffeine.png" },
    { name: "The Derma Co", logo: "dermaco.png" },
    { name: "Pilgrim", logo: "pilgrim.png" },
    { name: "Lux", logo: "lux.png" }
  ];

  for (const b of activeBrands) {
    const logoPath = path.join("public", "brands", b.logo);
    assert.ok(fs.existsSync(logoPath), `Brand logo ${b.logo} must exist on disk`);
    const stat = fs.statSync(logoPath);
    assert.ok(stat.size > 500, `Brand logo ${b.logo} must be valid asset`);
    assert.ok(brandsTs.includes(b.logo), `brands.ts must reference ${b.logo}`);
  }
});
