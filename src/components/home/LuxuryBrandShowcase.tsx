"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { topBrands } from "@/data/brands";

export function LuxuryBrandShowcase() {
  return (
    <section className="luxury-brand-showcase-section shell" aria-label="Official Partner Brands">
      <div className="brand-section-header">
        <span className="editorial-kicker">✦ OFFICIAL PARTNER MAISONS</span>
        <h2 className="editorial-showcase-title">World-renowned beauty ateliers.</h2>
        <p className="editorial-showcase-desc">
          We carry direct verified salon-stock collections from iconic French beauty houses to clinical dermatological science.
        </p>
      </div>

      <div className="luxury-brand-grid">
        {topBrands.map((b, idx) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.04 }}
          >
            <Link
              href={`/brands/${b.slug}`}
              className="luxury-brand-card luxury-brand-card-clean"
              aria-label={`Explore ${b.name} products`}
              style={
                {
                  "--brand-hover-color": b.primaryColor || "#141916",
                  "--brand-card-bg": b.themeBg || "#faf7f2",
                } as React.CSSProperties
              }
            >
              {/* Brand Logo Stage */}
              <div
                className="brand-logo-stage"
                style={{ background: b.logoBg || "rgba(255, 255, 255, 0.95)" }}
              >
                <img
                  src={b.logoUrl}
                  alt={`${b.name} logo`}
                  className="brand-logo-vector"
                  loading="lazy"
                />
              </div>

              {/* Brand Name Only (Extra Text Removed) */}
              <div className="brand-card-footer">
                <h3 className="brand-name-title">{b.name}</h3>
                <span className="brand-card-explore-hint">
                  <span>View Products</span>
                  <span className="brand-arrow">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
