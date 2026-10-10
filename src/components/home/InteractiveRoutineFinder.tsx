"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr, whatsappHref } from "@/lib/format";

export const RITUAL_PRESETS = [
  {
    id: "hair-rescue",
    title: "Salon Hair Silk & Rescue",
    focus: "Damaged / Dry / Frizzy Hair",
    tagline: "Parisian Salon Science · Gold Quinoa & Keratin",
    products: [
      {
        id: "p-loreal-absolut-repair",
        name: "L'Oréal Serie Expert Absolut Repair Shampoo (300ml)",
        step: "Step 1 · Deep Resurfacing Cleanse",
        price: 790,
        image: "/products/loreal-absolut-repair.png",
      },
      {
        id: "p-loreal-liss-unlimited",
        name: "L'Oréal Serie Expert Liss Unlimited Shampoo (300ml)",
        step: "Step 2 · Anti-Frizz Smoothing",
        price: 790,
        image: "/products/loreal-liss-unlimited.jpg",
      },
      {
        id: "p-minimalist-vitamin-b5",
        name: "Minimalist 10% Vitamin B5 Barrier Repair (50g)",
        step: "Step 3 · Scalp & Hair Moisture Seal",
        price: 349,
        image: "/products/minimalist-b5-moisturizer.png",
      },
    ],
  },
  {
    id: "glass-skin",
    title: "Korean Glass Skin & Glow",
    focus: "Dullness / Dark Spots / Uneven Tone",
    tagline: "Fermented Rice Water · 10% Ethyl Ascorbic Acid",
    products: [
      {
        id: "p-mamaearth-rice-facewash",
        name: "Mamaearth Rice Dewy Bright Face Wash (100ml)",
        step: "Step 1 · Dewy Glass Skin Cleanse",
        price: 259,
        image: "/mamaearth-rice-dew-facewash.jpg",
      },
      {
        id: "p-minimalist-vitc",
        name: "Minimalist 10% Vitamin C Radiance Serum (30ml)",
        step: "Step 2 · Antioxidant Brightening Elixir",
        price: 699,
        image: "/products/minimalist-vitc-serum.png",
      },
      {
        id: "p-milau-24k-gold",
        name: "Milau 24K Gold Face & Body Scrub Wash (200ml)",
        step: "Step 3 · Luminous 24K Polish",
        price: 299,
        image: "/products/milau-24k-gold-wash.webp",
      },
    ],
  },
  {
    id: "clear-pores",
    title: "Clinical Clear Skin & Pores",
    focus: "Acne Prone / Oil Control / Open Pores",
    tagline: "2% Salicylic Acid + LHA · Pure Niacinamide 05%",
    products: [
      {
        id: "p-minimalist-salicylic-lha",
        name: "Minimalist Salicylic 2% + LHA Gentle Cleanser (100ml)",
        step: "Step 1 · Pore Unclogging Cleanse",
        price: 299,
        image: "/products/minimalist-salicylic-lha-cleanser.jpg",
      },
      {
        id: "p-minimalist-niacinamide",
        name: "Minimalist 05% Niacinamide Barrier Serum (30ml)",
        step: "Step 2 · Sebum Regulation & Texture Refine",
        price: 569,
        image: "/products/minimalist-niacinamide-serum.png",
      },
      {
        id: "p-milau-salicylic",
        name: "Milau Salicylic Exfoliating Daily Cleanser (250ml)",
        step: "Step 3 · Clarifying Body Exfoliation",
        price: 289,
        image: "/products/milau-salicylic-exfoliating-cleanser.webp",
      },
    ],
  },
  {
    id: "spa-body",
    title: "24K Gold Body Radiance",
    focus: "Sun Tan / Rough Skin / Luxurious Spa Bath",
    tagline: "Fine Scrub Micro-Particles · Saffron & Oud Aromatics",
    products: [
      {
        id: "p-milau-24k-gold",
        name: "Milau 24K Gold Face & Body Scrub Wash (200ml)",
        step: "Step 1 · 24K Gold Exfoliating Polish",
        price: 299,
        image: "/products/milau-24k-gold-wash.webp",
      },
      {
        id: "p-milau-coffee",
        name: "Milau Coffee Tan Removal Scrub Wash (200ml)",
        step: "Step 2 · De-Tan Skin Rejuvenation",
        price: 279,
        image: "/products/milau-coffee-tan-wash.webp",
      },
      {
        id: "p-bellavita-honey-oud",
        name: "Bella Vita Organic Honey Oud Parfum (100ml)",
        step: "Step 3 · All-Day Haute Fragrance Aura",
        price: 599,
        image: "/products/bellavita-honey-oud.jpg",
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
          rating: 4.9,
          reviewCount: 120,
          gallery: [],
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
