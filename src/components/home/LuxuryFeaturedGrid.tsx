"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

type TabId = "hair" | "skincare" | "scrub" | "glass-skin";

interface TabConfig {
  id: TabId;
  label: string;
  badge: string;
  tagline: string;
  productIds: string[];
}

const TABS: TabConfig[] = [
  {
    id: "hair",
    label: "Salon Hair Care",
    badge: "L'ORÉAL SERIE EXPERT",
    tagline: "Professional salon formulations for resurfacing, anti-frizz discipline & color radiance.",
    productIds: [
      "p-loreal-absolut-repair",
      "p-loreal-vitamino-color",
      "p-loreal-liss-unlimited",
      "p-loreal-scalp-advanced",
    ],
  },
  {
    id: "skincare",
    label: "Active Science",
    badge: "MINIMALIST CLINICAL",
    tagline: "Transparent high-purity actives: pure Vitamin C, barrier Niacinamide & BHA pore exfoliants.",
    productIds: [
      "p-minimalist-vitc",
      "p-minimalist-niacinamide-serum",
      "p-minimalist-salicylic-cleanser",
      "p-minimalist-salicylic-serum",
      "p-minimalist-vitamin-b5",
    ],
  },
  {
    id: "scrub",
    label: "Body & Facial Washes",
    badge: "MILAU PROFESSIONAL",
    tagline: "Salon-grade dual face & body scrub washes with 24K Gold, Rice Water, Arabica Coffee & Blueberry.",
    productIds: [
      "p-milau-24k-gold-wash",
      "p-milau-korean-rice-wash",
      "p-milau-niacinamide-cleanser",
      "p-milau-salicylic-wash",
      "p-milau-coffee-wash",
      "p-milau-blueberry-wash",
    ],
  },
  {
    id: "glass-skin",
    label: "Glass Skin Glow",
    badge: "KOREAN RICE & VIT C",
    tagline: "Gentle toxin-free brightening formulas for natural dewy glass-like reflection.",
    productIds: [
      "p-mamaearth-rice-facewash",
      "p-mamaearth-vitc-facewash",
      "p-drrashel-vitc-serum",
      "p-dermaco-salicylic-facewash",
    ],
  },
];

export function LuxuryFeaturedGrid() {
  const [activeTab, setActiveTab] = useState<TabId>("hair");
  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  // Retrieve products in exact priority order
  const activeProducts = currentTab.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  return (
    <section className="luxury-featured-section shell" aria-label="Curated Boutique Collections">
      {/* Editorial Header with Glass Accents */}
      <div className="luxury-featured-header">
        <div className="header-meta-pill">
          <span className="sparkle-gold">✦</span>
          <span>CURATED BOUTIQUE ARRIVALS</span>
        </div>
        <h2 className="luxury-section-title">Formulations for elevated rituals.</h2>
        <p className="luxury-section-desc">
          Explore our newest authentic salon-exclusive drops, clinically verified actives, and artisanal ritual washes.
        </p>

        {/* Glassmorphic Tabs Bar */}
        <div className="luxury-glass-tabs-bar" role="tablist">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`luxury-tab-pill ${isActive ? "active" : ""}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="tab-active-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="tab-pill-text">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Tagline & Subtitle */}
        <div className="tab-context-strip">
          <span className="tab-context-badge">{currentTab.badge}</span>
          <p className="tab-context-desc">{currentTab.tagline}</p>
        </div>
      </div>

      {/* Animated Product Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="product-grid-lux"
        >
          {activeProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA to View All */}
      <div className="luxury-view-all-wrap">
        <Link href="/shop" className="btn-luxury-glass-cta">
          <span>Explore Entire Catalog ({products.length} Items)</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
