"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr } from "@/lib/format";

export const HERO_SPOTLIGHTS = [
  {
    id: "spotlight-loreal",
    name: "L'Oréal Serie Expert Absolut Repair",
    category: "PARISIAN SALON SCIENCE",
    headline: "Transform damaged hair into liquid silk.",
    description: "Infused with Gold Quinoa and Wheat Protein to resurface damaged hair fibers by up to 77% with zero weigh-down.",
    price: 790,
    mrp: 850,
    size: "300 ml",
    image: "/products/loreal-absolut-repair.png",
    link: "/shop?brand=loreal-paris",
    accent: "#c5a880",
    tag: "SALON BESTSELLER",
    pills: ["✦ Gold Quinoa Extract", "✦ Up to 77% Less Surface Damage", "✦ 7x Shinier Finish"],
  },
  {
    id: "spotlight-milau-gold",
    name: "Milau 24K Gold Face & Body Wash with Scrub",
    category: "EXFOLIATING SPA RITUAL",
    headline: "Real 24K gold particles for deep body glow.",
    description: "Salon-grade exfoliating scrub wash that sweeps away stubborn tanning, dead cells, and dullness to reveal luminous skin.",
    price: 299,
    mrp: 349,
    size: "200 ml",
    image: "/products/milau-24k-gold-wash.webp",
    link: "/shop?brand=milau-professional",
    accent: "#dfb56c",
    tag: "VIRAL IN PALI",
    pills: ["✦ 24K Gold Micro-Scrub", "✦ Tan & Sun Damage Reversal", "✦ Soft Velvet Skin Texture"],
  },
  {
    id: "spotlight-minimalist-vitc",
    name: "Minimalist 10% Vitamin C Radiance Serum",
    category: "TRANSPARENT CLINICAL SCIENCE",
    headline: "Pure antioxidant brilliance without irritation.",
    description: "Formulated with stable 10% Ethyl Ascorbic Acid, Centella Asiatica, and Polyhydroxy Acid to fade dark spots and boost collagen.",
    price: 699,
    mrp: 699,
    size: "30 ml",
    image: "/products/minimalist-vitc-serum.png",
    link: "/shop?brand=minimalist",
    accent: "#48bb78",
    tag: "ACTIVE SCIENCE",
    pills: ["✦ 10% Ethyl Ascorbic Acid", "✦ Fades Dark Spots & Pigmentation", "✦ Fragrance-Free Formula"],
  },
  {
    id: "spotlight-mamaearth-rice",
    name: "Mamaearth Rice Dewy Bright Face Wash",
    category: "DEWY GLASS SKIN",
    headline: "Korean rice water secret for dewy radiance.",
    description: "Cleanses without stripping moisture. Fermented Rice Water and Niacinamide restore hydration and give that glass-skin glow.",
    price: 259,
    mrp: 269,
    size: "100 ml",
    image: "/mamaearth-rice-dew-facewash.jpg",
    link: "/shop?q=Rice+Dew",
    accent: "#38bdf8",
    tag: "GLASS SKIN FAVORITE",
    pills: ["✦ Fermented Rice Water", "✦ Niacinamide Barrier Protection", "✦ Toxin-Free & Made Safe"],
  },
];

export function CinematicHero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  // Auto cycle every 6 seconds if untouched
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SPOTLIGHTS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_SPOTLIGHTS[activeIdx];

  const handleQuickAdd = () => {
    add(
      {
        id: current.id,
        name: current.name,
        slug: current.id,
        price: current.price,
        mrp: current.mrp,
        brandId: "br-mama",
        categoryId: "cat-hair",
        description: current.description,
        size: current.size,
        image: current.image,
        inStock: true,
        isNew: false,
        isBestseller: true,
        rating: 4.9,
        reviewCount: 380,
        gallery: [],
        offerIds: [],
        relatedIds: [],
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section className="cinematic-hero-section shell" aria-label="Hero Spotlight">
      <div className="cinematic-hero-card liquid-glass-panel-card">
        {/* Ambient Atmospheric Lighting */}
        <div className="hero-atmosphere-glow" />

        <div className="hero-layout-grid">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="hero-content-column">
            <div className="hero-eyebrow-row">
              <span className="hero-atelier-pill">✦ MAMA STORE PALI</span>
              <span className="hero-curation-pill">{current.tag}</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.35 }}
              >
                <span className="hero-category-label">{current.category}</span>
                <h1 className="hero-headline">{current.headline}</h1>
                <p className="hero-description">{current.description}</p>

                {/* Formulation Quality Pills */}
                <div className="hero-pills-row">
                  {current.pills.map((pill, i) => (
                    <span key={i} className="hero-formula-pill">
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Price and Action Bar */}
                <div className="hero-action-bar">
                  <div className="hero-price-group">
                    <span className="hero-price-val">{formatInr(current.price)}</span>
                    <span className="hero-size-val">· {current.size}</span>
                  </div>

                  <div className="hero-buttons-row">
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className={`btn-hero-add ${added ? "added" : ""}`}
                    >
                      {added ? "Added to Bag ✓" : "+ Add to Bag"}
                    </button>
                    <Link href="/shop" prefetch={true} className="btn-hero-explore">
                      Shop Full Atelier →
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Switcher Tabs (Thumb-Friendly on Mobile) */}
            <div className="hero-switcher-row">
              {HERO_SPOTLIGHTS.map((item, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`hero-dot-tab ${isActive ? "active" : ""}`}
                    aria-label={`Show ${item.name}`}
                  >
                    <span className="hero-tab-idx">0{idx + 1}</span>
                    <span className="hero-tab-name">{item.name.split(" ")[0]}</span>
                    {isActive && <span className="hero-tab-active-bar" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: High-Impact Visual Studio Stage */}
          <div className="hero-visual-column">
            <div className="hero-stage-podium">
              {/* Studio Backdrop Spotlight */}
              <div className="hero-spotlight-beam" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="hero-image-wrap"
                  initial={{ opacity: 0, scale: 0.9, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -16 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    src={current.image}
                    alt={current.name}
                    className="hero-product-img"
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>

              {/* 3D Contact Pedestal Base */}
              <div className="hero-podium-pedestal" />

              {/* Verified Badge Pill */}
              <div className="hero-verified-badge">
                <span className="verified-sparkle">✦</span>
                <span>100% Authorized Distributor Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
