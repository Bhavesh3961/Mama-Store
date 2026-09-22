"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { Product, products } from "@/data/products";
import { whatsappHref } from "@/lib/format";

interface HeroSlide {
  id: string;
  badge: string;
  tagline: string;
  titlePrimary: string;
  titleSecondary: string;
  accentWord: string;
  description: string;
  price: number;
  originalPrice: number;
  product: Product;
  palette: {
    accentColor: string; // Vibrant brand accent matching product (forest green, berry, amber)
    accentLight: string;
    pillBg: string;
    pillHover: string;
    haloBg: string;
  };
  details: { label: string; value: string }[];
}

// Find the 3 featured products
const drRashelSerum = products.find((p) => p.id === "p-drrashel-vitc-serum") ?? products[0];
const mamaRiceFacewash = products.find((p) => p.id === "p-mamaearth-rice-facewash") ?? products[1];
const dermacoSalicylic = products.find((p) => p.id === "p-dermaco-salicylic-facewash") ?? products[2];

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "dr-rashel-vitc-serum",
    badge: "BESTSELLER · GLOW PICK 01",
    tagline: "Vitamin C + Hyaluronic Acid · 50ml",
    titlePrimary: "DR. RASHEL",
    titleSecondary: "VITAMIN C",
    accentWord: "VITAMIN C",
    description:
      "Brightens dark spots, fades uneven tone, and gives your skin a natural healthy glow. Packed with Vitamin C and Hyaluronic Acid for deep hydration and a glass-skin finish.",
    price: 299,
    originalPrice: 399,
    product: drRashelSerum,
    palette: {
      accentColor: "#C98E2A",       // Warm golden amber — Dr. Rashel signature yellow
      accentLight: "#FFF8EC",
      pillBg: "#C98E2A",
      pillHover: "#A87220",
      haloBg: "radial-gradient(circle at 65% 50%, rgba(201, 142, 42, 0.15) 0%, rgba(255, 248, 236, 0) 70%)",
    },
    details: [
      { label: "Key Ingredient", value: "Vitamin C" },
      { label: "Benefit", value: "Skin Brightening" },
      { label: "Size", value: "50 ml" },
    ],
  },
  {
    id: "mamaearth-rice-dew",
    badge: "CUSTOMER FAVOURITE · PICK 02",
    tagline: "Korean Rice Water + Niacinamide · 100ml",
    titlePrimary: "MAMAEARTH",
    titleSecondary: "RICE DEW",
    accentWord: "DEW",
    description:
      "Gentle daily face wash with Korean Rice Water and Niacinamide. Cleanses your skin deeply while keeping it soft, bright, and naturally dewy without over-drying.",
    price: 219,
    originalPrice: 269,
    product: mamaRiceFacewash,
    palette: {
      accentColor: "#7B5A9E",       // Soft violet-purple — Mamaearth Rice Dew packaging
      accentLight: "#F4F0FA",
      pillBg: "#7B5A9E",
      pillHover: "#5E4180",
      haloBg: "radial-gradient(circle at 65% 50%, rgba(123, 90, 158, 0.12) 0%, rgba(244, 240, 250, 0) 70%)",
    },
    details: [
      { label: "Key Ingredient", value: "Rice Water" },
      { label: "Benefit", value: "Glass Skin Glow" },
      { label: "Size", value: "100 ml" },
    ],
  },
  {
    id: "dermaco-salicylic",
    badge: "DERMA-RECOMMENDED · PICK 03",
    tagline: "2% Salicylic Acid + Witch Hazel · 100ml",
    titlePrimary: "THE DERMA CO",
    titleSecondary: "CLEAR SKIN",
    accentWord: "CLEAR",
    description:
      "Deep pore cleanser that fights active acne, removes blackheads, and controls oil. Formulated by dermatologists with 2% Salicylic Acid for visibly clear skin.",
    price: 249,
    originalPrice: 299,
    product: dermacoSalicylic,
    palette: {
      accentColor: "#1B7A4A",       // Deep clinical green — The Derma Co brand color
      accentLight: "#EDFAF3",
      pillBg: "#1B7A4A",
      pillHover: "#155E39",
      haloBg: "radial-gradient(circle at 65% 50%, rgba(27, 122, 74, 0.12) 0%, rgba(237, 250, 243, 0) 70%)",
    },
    details: [
      { label: "Key Ingredient", value: "Salicylic Acid 2%" },
      { label: "Benefit", value: "Acne Control" },
      { label: "Size", value: "100 ml" },
    ],
  },
];

export function SplitHeroExperience() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);
  const [slides, setSlides] = useState(HERO_SLIDES);
  const { add } = useCart();

  React.useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length) {
          setSlides((prev) =>
            prev.map((s) => {
              const match = data.products.find((p: Product) => p.id === s.product.id);
              if (match) {
                return {
                  ...s,
                  product: match,
                  price: match.price ?? s.price,
                  originalPrice: match.mrp ?? s.originalPrice,
                };
              }
              return s;
            })
          );
        }
      })
      .catch(() => {});
  }, []);

  const current = slides[slideIndex] || HERO_SLIDES[slideIndex];

  const handlePrev = () => {
    setSlideIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSlideIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    if (current.product) {
      add(current.product, 1);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2200);
    }
  };

  return (
    <section className="starbucks-split-hero-viewport" aria-label="Hero Spotlight Experience">
      {/* Background Split: Pure Clean Off-White Left + Brand Rich Color Right */}
      <div className="hero-split-canvas">
        <div className="hero-canvas-left" />
        <div
          className="hero-canvas-right"
          style={{
            backgroundColor: current.palette.accentColor,
            transition: "background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Subtle architectural vertical typography watermark */}
          <div className="hero-vertical-watermark">
            <span>MAMA STORE ATELIER</span>
          </div>
        </div>
      </div>

      {/* Hidden preloads for next/prev slides so transitions are instantaneous */}
      <div style={{ display: "none" }} aria-hidden="true">
        {slides.map((s) => (
          <img key={s.id} src={s.product.image} alt="" />
        ))}
      </div>

      {/* Main Foreground Container */}
      <div className="shell hero-split-shell">
        <div className="hero-split-grid">
          {/* ================= LEFT CONTENT AREA ================= */}
          <div className="hero-left-column">
            {/* Top Carousel Micro-Nav / Category Badge */}
            <div className="hero-badge-row">
              <span
                className="hero-experience-pill"
                style={{
                  color: current.palette.accentColor,
                  backgroundColor: current.palette.accentLight,
                  borderColor: `${current.palette.accentColor}33`,
                }}
              >
                <span>✦</span> {current.badge}
              </span>

              <div className="hero-mini-dots">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSlideIndex(idx)}
                    className={`hero-dot-btn ${idx === slideIndex ? "active" : ""}`}
                    style={{
                      backgroundColor: idx === slideIndex ? current.palette.accentColor : "#D1C7BD",
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Bold Hero Typography - Fast, snappy, GPU composited */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
                style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                className="hero-heading-group"
              >
                <span className="hero-tagline-kicker">{current.tagline}</span>
                <h1 className="hero-big-title">
                  <span className="title-row-primary">{current.titlePrimary}</span>
                  <span className="title-row-secondary">
                    {current.titleSecondary.replace(current.accentWord, "")}
                    <em style={{ color: current.palette.accentColor, fontStyle: "italic" }}>
                      {current.accentWord}
                    </em>
                  </span>
                </h1>

                {/* Pricing Display */}
                <div className="hero-price-line">
                  <span className="hero-price-current">₹{current.price}</span>
                  <span className="hero-price-original">₹{current.originalPrice}</span>
                  <span
                    className="hero-discount-chip"
                    style={{
                      color: current.palette.accentColor,
                      backgroundColor: current.palette.accentLight,
                    }}
                  >
                    SAVE {Math.round(((current.originalPrice - current.price) / current.originalPrice) * 100)}%
                  </span>
                </div>

                {/* Editorial Description */}
                <p className="hero-editorial-desc">{current.description}</p>
              </motion.div>
            </AnimatePresence>

            {/* CTA Buttons: Primary Explore Collection + Add to Cart + WhatsApp Direct */}
            <div className="hero-cta-actions">
              <Link href="/shop" className="btn-hero-explore-collection">
                <span>Explore Collection</span>
                <span className="btn-arrow-icon">&rarr;</span>
              </Link>

              <div className="hero-sub-actions-row">
                <button
                  onClick={handleAddToCart}
                  className="btn-starbucks-add-cart"
                  type="button"
                >
                  <span>ADD TO CART</span>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </button>

                <a
                  href={whatsappHref(`Hello MAMA STORE, I'd like to order the ${current.titlePrimary} ${current.titleSecondary} (₹${current.price}).`)}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-whatsapp-pill-btn"
                  title="Order via WhatsApp"
                >
                  <span>WhatsApp</span>
                </a>

                <Link href="/cart" className="hero-view-cart-link">
                  Bag &rarr;
                </Link>
              </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
              {addedToast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="hero-added-toast"
                  style={{ borderColor: current.palette.accentColor }}
                >
                  ✓ Added {current.titlePrimary} {current.titleSecondary} to your bag!
                </motion.div>
              )}
            </AnimatePresence>

            {/* Micro specs / provenance */}
            <div className="hero-specs-strip">
              {current.details.map((d, i) => (
                <div key={i} className="spec-item">
                  <span className="spec-label">{d.label}</span>
                  <span className="spec-val">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT STRADDLING PRODUCT HERO ================= */}
          <div className="hero-right-column">
            {/* Left Carousel Arrow - Floating between panels */}
            <button
              onClick={handlePrev}
              className="hero-slider-arrow arrow-left"
              aria-label="Previous Product"
              title="Previous"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Centered Big Product Visual Straddling the Split Seam */}
            <div className="hero-product-straddle-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.94, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
                  className="hero-straddle-visual-wrap"
                >
                  {/* Subtle radial glow under product */}
                  <div
                    className="hero-straddle-glow"
                    style={{
                      background: `radial-gradient(circle, ${current.palette.accentColor}33 0%, rgba(255,255,255,0) 70%)`,
                    }}
                  />

                  {/* Cutout / High Quality Cosmetic Image */}
                  <div className="hero-image-frame-cutout">
                    <Image
                      src={current.product.image}
                      alt={current.product.name}
                      width={440}
                      height={540}
                      priority
                      className="hero-cutout-img"
                    />
                  </div>

                  {/* Floating Glassmorphic Provenance Badge */}
                  <div className="hero-floating-glass-card">
                    <span className="glass-card-tag" style={{ color: current.palette.accentColor }}>
                      MAMA STORE EXCLUSIVE
                    </span>
                    <strong className="glass-card-title">{current.product.name}</strong>
                    <span className="glass-card-meta">100% Authentic Sealed Stock</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Carousel Arrow - On the green panel */}
            <button
              onClick={handleNext}
              className="hero-slider-arrow arrow-right"
              aria-label="Next Product"
              title="Next"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
