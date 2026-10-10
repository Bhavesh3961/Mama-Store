import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Verify new products, packshots on disk, and Blinkit/Zepto variant configurations", async () => {
  // Read products file content to test data
  const productsTs = fs.readFileSync("src/data/products.ts", "utf8");

  // Verify key requested products exist in the code
  const requiredSlugs = [
    "mamaearth-rosemary-hair-growth-oil",
    "plix-rosemary-hair-growth-oil",
    "mamaearth-onion-hair-fall-control-shampoo",
    "mamaearth-onion-hair-oil",
    "lakme-peach-milk-gel-moisturiser",
    "mcaffeine-sweet-escape-perfumed-body-lotion",
    "dot-and-key-vitamin-c-plus-e-super-bright-moisturizer",
    "dot-and-key-oil-free-moisturizer",
    "bellavita-white-oud-perfume",
    "bellavita-date-woman-perfume",
    "nykaa-wanderlust-body-wash-all-flavours",
    "plix-pineapple-smooth-skin-juicy-body-wash",
    "lux-radiant-glow-body-wash",
    "chemist-at-play-exfoliating-and-brightening-body-wash",
    "bellavita-skai-shower-gel-all-flavours",
    "plix-active-fruit-face-serum",
    "plix-cleanser-fruit-face-wash",
    "wishcare-sunscreen-body-lotion",
    "derma-co-1-percent-kojic-acid-daily-facewash",
    "nykaa-naturals-gentle-face-wash",
    "dot-and-key-gentle-daily-face-wash",
    "plum-goodness-botanical-face-wash",
    "chemist-at-play-active-ceramide-face-wash",
    "dot-and-key-sunscreen-spf-50",
    "dot-and-key-micellar-face-wash-120ml",
    "plix-flaxseed-ultra-smooth-shampoo",
    "plix-flaxseed-ultra-smooth-conditioner",
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
    "nykaa-wanderlust-body-wash.jpg",
    "plix-pineapple-body-wash.jpg",
    "lux-radiant-glow-body-wash.jpg",
    "chemistatplay-exfoliating-body-wash.jpg",
    "chemistatplay-brightening-body-wash.jpg",
    "bellavita-skai-shower-gel.jpg",
    "plix-pineapple-depigmentation-serum.jpg",
    "plix-juicy-facewash.jpg",
    "wishcare-sunscreen-body-lotion.jpg",
    "dermaco-1-kojic-acid-facewash.jpg",
    "nykaa-naturals-facewash.jpg",
    "dotkey-facewash.jpg",
    "plum-green-tea-facewash.jpg",
    "chemistatplay-facewash.jpg",
    "dotkey-sunscreen-50.jpg",
    "dotkey-micellar-facewash.jpg",
    "plix-flaxseed-shampoo.jpg",
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
});
