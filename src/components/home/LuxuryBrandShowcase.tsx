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
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <Link href={`/shop?brand=${b.slug}`} className="luxury-brand-card">
              {/* Brand Logo Watermark Background */}
              <div
                className="brand-watermark-bg"
                style={{ backgroundImage: `url(${b.logoUrl})` }}
                aria-hidden="true"
              />

              <div className="brand-card-top">
                <span className="brand-badge-pill">{b.badge || "Verified Maison"}</span>
                <span className="brand-origin">{b.origin}</span>
              </div>

              <div className="brand-logo-stage" style={{ background: b.logoBg || "rgba(255, 255, 255, 0.85)" }}>
                <img
                  src={b.logoUrl}
                  alt={`${b.name} logo`}
                  className="brand-logo-vector"
                  loading="lazy"
                />
              </div>

              <div className="brand-card-center">
                <h3 className="brand-name-title">{b.name}</h3>
                <p className="brand-blurb-text">{b.blurb}</p>
              </div>

              <div className="brand-card-bottom">
                <span className="brand-explore-link">
                  <span>Explore Atelier</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
