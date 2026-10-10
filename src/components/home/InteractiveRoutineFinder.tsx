"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr, whatsappHref } from "@/lib/format";

export const RITUAL_PRESETS = [
  {
    id: "hair-growth",
    title: "Hair Growth & Fall Control",
    focus: "Root Nourishment & Thinning Hairline",
    tagline: "Pure Rosemary Extracts · Redensyl & Plant Keratin",
    products: [
      {
        id: "p-mamaearth-rosemary-oil",
        name: "Mamaearth Rosemary Hair Growth Oil (150ml)",
        step: "Step 1 · Scalp Follicle Stimulation",
        price: 449,
        image: "/products/mamaearth-rosemary-oil.png",
      },
      {
        id: "p-plix-rosemary-oil",
        name: "Plix Rosemary Hair Growth Oil (100ml)",
        step: "Step 2 · Botanical Root Anchor",
        price: 349,
        image: "/products/plix-rosemary-oil.jpg",
      },
      {
        id: "p-mamaearth-onion-shampoo",
        name: "Mamaearth Onion Hair Fall Control Shampoo (250ml)",
        step: "Step 3 · Gentle Sulfate-Free Cleanse",
        price: 299,
        image: "/products/mamaearth-onion-shampoo.png",
      },
    ],
  },
  {
    id: "glow-pigmentation",
    title: "Radiant Glow & De-Pigmentation",
    focus: "Sun Tan / Dark Spots / Hyperpigmentation",
    tagline: "1% Kojic Acid · 2% Alpha Arbutin & Kakadu Plum",
    products: [
      {
        id: "p-dermaco-1-kojic-acid-facewash",
        name: "The Derma Co 1% Kojic Acid Daily Face Wash (100ml)",
        step: "Step 1 · De-Tan Daily Cleansing",
        price: 269,
        image: "/products/dermaco-1-kojic-acid-facewash.jpg",
      },
      {
        id: "p-plix-pineapple-depigmentation-serum-30",
        name: "Plix Pineapple De-Pigmentation Serum 30ml",
        step: "Step 2 · Targeted Pigmentation Correction",
        price: 525,
        image: "/products/plix-pineapple-depigmentation-serum.jpg",
      },
      {
        id: "p-dotkey-vitc-moisturizer",
        name: "Dot & Key Vitamin C + E Super Bright Moisturizer (60ml)",
        step: "Step 3 · Luminous Moisture Seal",
        price: 445,
        image: "/products/dotkey-vitc-moisturizer.jpg",
      },
    ],
  },
  {
    id: "body-refresh",
    title: "Luxury Body & French Perfumery",
    focus: "Smooth Velvet Skin & Seductive Sillage",
    tagline: "Active Lactic Acid · French Vanilla Coffee & Pure White Oud",
    products: [
      {
        id: "p-chemistatplay-exfoliating-body-wash",
        name: "Chemist at Play Daily Exfoliating Body Wash (236ml)",
        step: "Step 1 · Exfoliating Ceramide Cleanse",
        price: 349,
        image: "/products/chemistatplay-exfoliating-body-wash.jpg",
      },
      {
        id: "p-mcaffeine-sweet-escape-lotion",
        name: "mCaffeine Sweet Escape Perfume Body Lotion (200ml)",
        step: "Step 2 · Gourmand Hydration Wrap",
        price: 449,
        image: "/products/mcaffeine-sweet-escape-lotion.jpg",
      },
      {
        id: "p-bellavita-white-oud",
        name: "Bella Vita White Oud Perfume 100ml",
        step: "Step 3 · French White Oud Luxury",
        price: 549,
        image: "/products/bellavita-white-oud.jpg",
      },
    ],
  },
];

export function InteractiveRoutineFinder() {
  const [selectedId, setSelectedId] = useState(RITUAL_PRESETS[0].id);
  const { add } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  const activeRitual = RITUAL_PRESETS.find((r) => r.id === selectedId) || RITUAL_PRESETS[0];
  const totalPrice = activeRitual.products.reduce((sum, p) => sum + p.price, 0);

  const handleAddEntireRitual = () => {
    activeRitual.products.forEach((p) => {
      add(
        {
          id: p.id,
          name: p.name,
          slug: p.id,
          price: p.price,
          brandId: "br-mama",
          categoryId: "cat-skincare",
          description: p.step,
          size: "Regular",
          image: p.image,
          inStock: true,
          isNew: false,
          isBestseller: true,
          mrp: p.price,
          rating: 4.9,
          reviewCount: 120,
          gallery: [],
          offerIds: [],
          relatedIds: [],
        },
        1
      );
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2000);
  };

  return (
    <section className="routine-finder-section shell" aria-label="Interactive Beauty Routine Finder">
      <div className="routine-finder-container liquid-glass-panel-card">
        {/* Editorial Header */}
        <div className="routine-finder-header">
          <span className="badge-luxury" style={{ color: "#9c783e", borderColor: "rgba(156,120,62,0.3)" }}>
            ✦ INTERACTIVE BEAUTY CONCIERGE
          </span>
          <h2 className="routine-main-title">Find your personalized formulation ritual.</h2>
          <p className="routine-main-desc">
            Select your primary skin or hair goal. Our Pali boutique will formulate the exact 3-step synergy proven to deliver transformative salon radiance.
          </p>
        </div>

        {/* Goal Selector Buttons (Horizontal Scrollable on Mobile) */}
        <div className="routine-tabs-row" role="tablist">
          {RITUAL_PRESETS.map((preset) => {
            const isCurrent = preset.id === selectedId;
            return (
              <button
                key={preset.id}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setSelectedId(preset.id)}
                className={`routine-tab-btn ${isCurrent ? "active" : ""}`}
              >
                <span className="tab-focus-text">{preset.focus}</span>
                <span className="tab-title-text">{preset.title}</span>
                {isCurrent && <span className="tab-active-indicator" />}
              </button>
            );
          })}
        </div>

        {/* Active Ritual Showcase */}
        <div className="ritual-showcase-box">
          <div className="ritual-meta-bar">
            <div>
              <span className="ritual-tagline-text">{activeRitual.tagline}</span>
              <h3 className="ritual-box-title">{activeRitual.title}</h3>
            </div>
            <div className="ritual-total-box">
              <span className="total-label">3-Step Ritual Bundle</span>
              <strong className="total-price-text">{formatInr(totalPrice)}</strong>
            </div>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="ritual-steps-grid">
            {activeRitual.products.map((prod, idx) => (
              <div key={prod.id} className="ritual-step-card">
                <div className="step-card-num-pill">0{idx + 1}</div>
                <div className="step-card-image-box">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="step-card-img"
                    loading="lazy"
                  />
                </div>
                <div className="step-card-content">
                  <span className="step-card-phase">{prod.step}</span>
                  <h4 className="step-card-name">{prod.name}</h4>
                  <span className="step-card-price">{formatInr(prod.price)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 1-Click Action Row */}
          <div className="ritual-action-footer">
            <button
              type="button"
              onClick={handleAddEntireRitual}
              className={`btn-add-ritual ${addedAll ? "added" : ""}`}
            >
              {addedAll ? (
                <span>All 3 Formulations Added to Bag ✓</span>
              ) : (
                <span>Add Complete 3-Step Ritual to Bag ({formatInr(totalPrice)})</span>
              )}
            </button>
            <a
              href={whatsappHref(`Hello Mama Store, I would like to order the ${activeRitual.title} products.`)}
              target="_blank"
              rel="noreferrer"
              className="btn-ritual-wa"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
