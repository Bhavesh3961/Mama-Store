"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MamaLogo } from "@/components/brand/MamaLogo";
import { store } from "@/data/store";
import { categories } from "@/data/categories";
import { whatsappHref } from "@/lib/format";

// Streamlined, Fast Luxury Homepage Components
import { CinematicHero } from "@/components/home/CinematicHero";
import { BoutiqueTrustBar } from "@/components/home/BoutiqueTrustBar";
import { LuxuryBrandShowcase } from "@/components/home/LuxuryBrandShowcase";

export default function HomePage() {
  return (
    <div className="editorial-home-page">
      {/* 1. CINEMATIC SHOWSTOPPING HERO EXPERIENCE */}
      <CinematicHero />

      {/* 2. BOUTIQUE TRUST PILLARS (PALI SAME-DAY DELIVERY, 100% AUTHENTIC) */}
      <BoutiqueTrustBar />

      {/* 8. HIGH-FASHION DEPARTMENT EDITORIAL GRID */}
      <section className="editorial-departments-section shell" aria-label="Curated Beauty Rituals">
        <div className="section-head-center">
          <span className="editorial-kicker">✦ ATELIER DEPARTMENTS</span>
          <h2 className="editorial-showcase-title">Select your daily beauty ritual.</h2>
          <p className="editorial-showcase-desc">
            Explore world-renowned formulations categorized by hair, skin, body, fragrance, and couture color.
          </p>
        </div>

        <div className="editorial-cat-mini-grid">
          {categories.slice(0, 6).map((c, idx) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              prefetch={true}
              className="editorial-cat-mini-card"
            >
              <div
                className="mini-card-photo"
                style={{ backgroundImage: `url(${c.image})` }}
              >
                <div className="mini-card-overlay" />
              </div>
              <div className="mini-card-info">
                <span className="mini-card-tag">{c.tagline}</span>
                <h3 className="mini-card-title">{c.name}</h3>
                <span className="mini-card-explore">Explore Collection →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. OFFICIAL PARTNER ATELIERS & BRAND MAISONS (WATERMARK LOGOS) */}
      <LuxuryBrandShowcase />

      {/* 10. MAMA STORE PHILOSOPHY & MANIFESTO */}
      <section className="editorial-philosophy-section shell" style={{ padding: "80px 0 60px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <MamaLogo fullBadge size={200} />
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Playfair Display', Georgia, serif)",
              fontSize: "clamp(1.8rem, 3.5vw, 2.9rem)",
              color: "var(--ink)",
              maxWidth: 740,
              margin: "32px auto 16px",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
            }}
          >
            “True radiance is not an illusion applied onto skin, but a quiet ritual awakened from within.”
          </h2>
          <p
            style={{
              color: "#c5a880",
              fontSize: "0.82rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            THE MAMA STORE MANIFESTO · PALI ATELIER
          </p>
        </motion.div>
      </section>

      {/* 11. BOUTIQUE FINALE & VIP WHATSAPP ACTION */}
      <section className="editorial-finale-section" aria-label="Boutique Call to Action">
        <div className="shell editorial-finale-container">
          <span className="finale-tag">✦ PALI COSMETIC BOUTIQUE</span>
          <h2 className="finale-title">Elevate your daily ritual today.</h2>
          <p className="finale-desc">
            Experience our complete curated collection online or visit our boutique at {store.address}. Direct WhatsApp orders include complimentary formulation samples and priority same-day delivery in Pali.
          </p>

          <div className="finale-actions">
            <Link href="/shop" prefetch={true} className="btn-finale-primary">
              Shop The Collection
            </Link>
            <a
              href={whatsappHref("Hello Mama Store, I would like to place an order.")}
              target="_blank"
              rel="noreferrer"
              className="btn-finale-wa"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
