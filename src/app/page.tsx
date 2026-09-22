"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MamaLogo } from "@/components/brand/MamaLogo";
import { store } from "@/data/store";
import { whatsappHref } from "@/lib/format";

import { SplitHeroExperience } from "@/components/home/SplitHeroExperience";


const heroWhatsappMessage = `Hello ${store.name}, I would like a personalized beauty consultation.`;

export default function HomePage() {
  return (
    <div className="editorial-home-page">
      {/* ==========================================================================
         ACT I: THE STARBUCKS-STYLE SPLIT HERO EXPERIENCE
         Clean light background left, rich signature colored block right,
         large editorial typography, and centered straddling hero product cutout!
         ========================================================================== */}
      <SplitHeroExperience />

      {/* ==========================================================================
         ACT II: THE DEPARTMENT MANIFESTO
         ========================================================================== */}
      <section className="editorial-manifesto-section" aria-label="Curated Departments">
        <div className="shell">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 40px" }}>
            <motion.span
              className="editorial-kicker"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              DEPARTMENTS
            </motion.span>
            <motion.h2
              className="editorial-showcase-title"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: 0.05 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              Select your daily beauty ritual.
            </motion.h2>
          </div>

          <div className="editorial-manifesto-grid">
            <motion.div
              className="editorial-dept-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: 0.04 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              <div>
                <span className="dept-num">01</span>
                <h3 className="dept-name">Skincare</h3>
                <p className="dept-desc">Serums, moisturizers, face washes, and more for healthy glowing skin.</p>
              </div>
              <Link href="/shop?category=skincare" className="dept-link">
                Explore Skincare →
              </Link>
            </motion.div>

            <motion.div
              className="editorial-dept-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: 0.08 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              <div>
                <span className="dept-num">02</span>
                <h3 className="dept-name">Makeup</h3>
                <p className="dept-desc">Lipsticks, foundations, kajal, and everything for your daily look.</p>
              </div>
              <Link href="/shop?category=makeup" className="dept-link">
                Explore Makeup →
              </Link>
            </motion.div>

            <motion.div
              className="editorial-dept-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: 0.12 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              <div>
                <span className="dept-num">03</span>
                <h3 className="dept-name">Perfumes</h3>
                <p className="dept-desc">Fresh, floral, and long-lasting fragrances for everyday wear.</p>
              </div>
              <Link href="/shop?category=fragrance" className="dept-link">
                Explore Fragrance →
              </Link>
            </motion.div>

            <motion.div
              className="editorial-dept-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{ duration: 0.3, delay: 0.16 }}
              style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
            >
              <div>
                <span className="dept-num">04</span>
                <h3 className="dept-name">Hair Care</h3>
                <p className="dept-desc">Shampoos, serums, and oils for strong, shiny, and healthy hair.</p>
              </div>
              <Link href="/shop?category=haircare" className="dept-link">
                Explore Haircare →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ==========================================================================
         ACT VI: BRAND EMBLEM & ATELIER PHILOSOPHY
         ========================================================================== */}
      <section className="editorial-philosophy-section shell" style={{ padding: "80px 0", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <MamaLogo fullBadge size={220} />
          <h2
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              color: "var(--ink)",
              maxWidth: 720,
              margin: "32px auto 16px",
              lineHeight: 1.15,
            }}
          >
            “True radiance is not an illusion applied onto skin, but a quiet ritual awakened from within.”
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.95rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            THE MAMA STORE MANIFESTO
          </p>
        </motion.div>
      </section>

      {/* ==========================================================================
         ACT VII: SIGNATURE FINALE
         ========================================================================== */}
      <footer className="editorial-finale-section">
        <div className="shell editorial-finale-container">
          <span className="finale-tag">VISIT OUR BEAUTY ATELIER</span>
          <h2 className="finale-title">Elevate your daily ritual today.</h2>
          <p className="finale-desc">
            Experience our full collection online or visit our boutique store at {store.address}. Direct WhatsApp orders include signature luxury gifts with every parcel.
          </p>

          <div className="finale-actions">
            <Link href="/shop" className="btn-finale-primary">
              Shop The Collection
            </Link>
            <a
              href={whatsappHref("Hello MAMA STORE, I would like to place an order.")}
              target="_blank"
              rel="noreferrer"
              className="btn-finale-wa"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

