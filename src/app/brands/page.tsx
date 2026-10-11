import Link from "next/link";
import type { Metadata } from "next";
import { topBrands } from "@/data/brands";
import { whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Top Brands · 100% Authentic Cosmetics · Mama Store Pali",
  description: "Explore world-renowned cosmetic brands: Plix, Dot & Key, Nykaa, Chemist at Play, Mamaearth, Bella Vita, Plum, Nivea, Lakmé and more at Mama Store Pali.",
};

export default function BrandsPage() {
  return (
    <div className="page page-theme-brands">
      <div className="shell">
        {/* Editorial Header */}
        <div className="brands-editorial-header" style={{ marginBottom: 32 }}>
          <span className="badge-luxury" style={{ color: "#9c783e", borderColor: "rgba(156, 120, 62, 0.3)" }}>
            ✦ 100% DIRECT ATELIER STOCK
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginTop: 10, letterSpacing: "-0.03em" }}>
            Top Beauty Brands
          </h1>
          <p className="muted" style={{ maxWidth: 600, marginTop: 8, fontSize: "1.05rem", lineHeight: 1.6 }}>
            Tap any brand to explore its complete collection with authentic salon and clinical skincare stock.
          </p>
        </div>

        {/* Clean Luxury Brand Grid: Logo & Brand Name Only */}
        <div className="luxury-brands-grid">
          {topBrands.map((b) => (
            <Link
              key={b.id}
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
                style={{
                  background: b.logoBg || "rgba(255, 255, 255, 0.95)",
                }}
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
                <h2 className="brand-card-name">
                  {b.name}
                </h2>
                <span className="brand-card-explore-hint">
                  <span>View Products</span>
                  <span className="brand-arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Salon & Professional Concierge Banner */}
        <div className="luxury-concierge-strip" style={{ marginTop: 44 }}>
          <div className="concierge-content">
            <span className="badge-luxury" style={{ color: "#2c5a42", borderColor: "rgba(44, 90, 66, 0.3)" }}>
              ✦ SALON & ARTIST CONCIERGE
            </span>
            <h3 style={{ fontSize: "1.4rem", marginTop: 8, letterSpacing: "-0.02em" }}>
              Looking for a specific cosmetic brand or salon kit?
            </h3>
            <p className="small muted" style={{ marginTop: 6, maxWidth: 580, lineHeight: 1.6 }}>
              Mama Store Pali supplies salon professionals and clients with 100% authentic cosmetic brands and bulk assortments.
            </p>
          </div>
          <a
            className="btn btn-luxury-primary"
            href={whatsappHref("Hello Mama Store, I would like to inquire about purchasing cosmetic products.")}
            target="_blank"
            rel="noreferrer"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
