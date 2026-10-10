import Link from "next/link";
import type { Metadata } from "next";
import { topBrands } from "@/data/brands";
import { whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Top Brands · 100% Authentic Cosmetics · Mama Store Pali",
  description: "Explore world-renowned cosmetic brands: Plix, Dot & Key, Nykaa, Chemist at Play, Mamaearth, Bella Vita, Plum, Nivea, and Lakmé at Mama Store Pali.",
};

export default function BrandsPage() {
  return (
    <div className="page page-theme-brands">
      <div className="shell">
        {/* Editorial Header */}
        <div className="brands-editorial-header" style={{ marginBottom: 36 }}>
          <span className="badge-luxury" style={{ color: "#9c783e", borderColor: "rgba(156, 120, 62, 0.3)" }}>
            ✦ 100% DIRECT ATELIER STOCK
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", marginTop: 10, letterSpacing: "-0.03em" }}>
            Top Beauty Brands
          </h1>
          <p className="muted" style={{ maxWidth: 640, marginTop: 8, fontSize: "1.08rem", lineHeight: 1.6 }}>
            Curated world-class beauty houses, professional salon formulas, and active clinical skincare sourced directly from authorized brand distributors.
          </p>
        </div>

        {/* Curated Luxury Brand Grid with Brand Logos as Background */}
        <div className="luxury-brands-grid">
          {topBrands.map((b) => (
            <article key={b.id} className="luxury-brand-card liquid-glass-panel-card">
              {/* Brand Logo Used as Watermark Background */}
              <div
                className="brand-watermark-bg"
                style={{
                  backgroundImage: `url(${b.logoUrl})`,
                }}
                aria-hidden="true"
              />

              {/* Top Accent & Origin Pill */}
              <div className="brand-card-top-bar">
                <span className="brand-origin-pill">{b.origin}</span>
                {b.badge ? <span className="brand-curation-pill">{b.badge}</span> : null}
              </div>

              {/* Clickable Brand Logo Stage */}
              <Link
                href={`/shop?brand=${b.slug}`}
                className="brand-logo-stage"
                style={{ background: b.logoBg || "rgba(255, 255, 255, 0.85)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}
                aria-label={`Explore ${b.name} collection`}
              >
                <img
                  src={b.logoUrl}
                  alt={`${b.name} logo`}
                  className="brand-logo-vector"
                  loading="lazy"
                />
              </Link>

              {/* Brand Details */}
              <div className="brand-card-content">
                <h2 className="brand-card-name">
                  <Link href={`/shop?brand=${b.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {b.name}
                  </Link>
                </h2>
                <p className="brand-card-blurb">{b.blurb}</p>
                <div className="brand-card-action-row">
                  <Link
                    href={`/shop?brand=${b.slug}`}
                    className="btn-explore-brand"
                    aria-label={`Explore ${b.name} collection`}
                  >
                    <span>Explore Collection</span>
                    <span className="brand-arrow">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Salon & Professional Concierge Banner */}
        <div className="luxury-concierge-strip" style={{ marginTop: 48 }}>
          <div className="concierge-content">
            <span className="badge-luxury" style={{ color: "#2c5a42", borderColor: "rgba(44, 90, 66, 0.3)" }}>
              ✦ SALON & ARTIST CONCIERGE
            </span>
            <h3 style={{ fontSize: "1.45rem", marginTop: 8, letterSpacing: "-0.02em" }}>
              Are you looking for complete salon ranges or cosmetic kits?
            </h3>
            <p className="small muted" style={{ marginTop: 6, maxWidth: 580, lineHeight: 1.6 }}>
              Mama Store Pali supplies salon professionals, makeup artists, and clients with 100% authentic cosmetic brands and bulk assortments.
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
