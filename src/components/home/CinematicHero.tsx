"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr } from "@/lib/format";

export const HERO_SPOTLIGHTS = [
  {
    id: "p-dotkey-vitc-moisturizer",
    name: "Dot & Key Vitamin C + E Super Bright Moisturizer",
    category: "RADIANT VITAMIN C GLOW",
    headline: "Unleash instant luminous glass-skin glow.",
    description: "Kakadu Plum Vitamin C & Vitamin E sorbet cream that fades hyperpigmentation and energizes dull skin.",
    price: 445,
    mrp: 495,
    size: "60 ml",
    image: "/products/dotkey-vitc-moisturizer.jpg",
    link: "/product/dot-and-key-vitamin-c-plus-e-super-bright-moisturizer",
    accent: "#dfb56c",
    tag: "BESTSELLER",
    pills: ["✦ Kakadu Plum Vitamin C", "✦ Ethyl Ascorbic Acid", "✦ Fades Dark Spots"],
  },
  {
    id: "p-mamaearth-rosemary-oil",
    name: "Mamaearth Rosemary Hair Growth Oil",
    category: "CLINICAL BOTANICAL HAIR SCIENCE",
    headline: "Revitalize hair follicles and accelerate growth.",
    description: "Formulated with pure Rosemary & Methi Dana to stimulate scalp circulation and promote stronger hair.",
    price: 449,
    mrp: 499,
    size: "150 ml",
    image: "/products/mamaearth-rosemary-oil.png",
    link: "/product/mamaearth-rosemary-hair-growth-oil",
    accent: "#48bb78",
    tag: "HAIR FALL CONTROL",
    pills: ["✦ Pure Rosemary Extract", "✦ Methi Dana Seeds", "✦ Scalp Root Stimulation"],
  },
  {
    id: "p-bellavita-white-oud",
    name: "Bella Vita White Oud Perfume 100ml",
    category: "LUXURY FRENCH PERFUMERY",
    headline: "Ethereal agarwood & regal amber notes.",
    description: "An ethereal and pristine blend of subtle sweet agarwood, fresh aquatic notes, musk, and soft amber.",
    price: 549,
    mrp: 599,
    size: "100 ml",
    image: "/products/bellavita-white-oud.jpg",
    link: "/product/bellavita-white-oud-perfume",
    accent: "#c5a880",
    tag: "PARFUM EDITION",
    pills: ["✦ French Perfume Oils", "✦ 10+ Hours Long Lasting", "✦ Regal Agarwood"],
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
