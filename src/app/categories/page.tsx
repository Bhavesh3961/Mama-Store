import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategoriesForCatalog } from "@/lib/db/queries";
import { whatsappHref } from "@/lib/format";

export const metadata: Metadata = {
  title: "Boutique Categories · 100% Authentic Cosmetics · Mama Store Pali",
  description: "Explore luxury hair care, clinical skincare, bath & body, haute fragrances, and professional makeup at Mama Store Pali.",
};

export default function CategoriesPage() {
  const categories = getAllCategoriesForCatalog();
  return (
    <div className="page page-theme-categories">
      <div className="shell">
        {/* Editorial Wayfinder Header */}
        <div className="cat-editorial-header" style={{ marginBottom: 36 }}>
          <span className="badge-luxury" style={{ color: "#9c783e", borderColor: "rgba(156, 120, 62, 0.3)" }}>
            ✦ ATELIER DEPARTMENTS
          </span>
          <h1 style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", marginTop: 10, letterSpacing: "-0.03em" }}>
            Explore Collections
          </h1>
          <p className="muted" style={{ maxWidth: 640, marginTop: 8, fontSize: "1.08rem", lineHeight: 1.6 }}>
            Curated by beauty ritual with authentic salon standards, clinical science, and iconic favorites in Pali.
          </p>
        </div>

        {/* High-Fashion Editorial Category Grid */}
        <div className="editorial-cat-grid">
          {categories.map((c, idx) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="editorial-cat-card"
            >
              {/* Full-bleed High Fashion Photography Background */}
              <div
                className="editorial-cat-photo-wrap"
                style={{
                  backgroundImage: `url(${c.image})`,
                }}
              >
                <div className="editorial-cat-gradient-scrim" />
              </div>

              {/* Card Meta Content */}
              <div className="editorial-cat-content">
                <div className="editorial-cat-top-bar">
                  <span className="editorial-cat-number">0{idx + 1}</span>
                  <span className="editorial-cat-tagline">{c.tagline || "Luxury Collection"}</span>
                </div>

                <div className="editorial-cat-bottom-block">
                  <h2 className="editorial-cat-name">{c.name}</h2>
                  <p className="editorial-cat-summary">{c.description}</p>
                  
                  <div className="editorial-cat-footer-row">
                    <span className="editorial-cat-pill">
                      <span className="editorial-sparkle">✦</span> {c.popularProducts}
                    </span>
                    <span className="editorial-cat-cta">
                      <span>Explore</span>
                      <span className="editorial-cta-arrow">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Direct Pali Store Orders */}
        <div className="luxury-concierge-strip" style={{ marginTop: 48 }}>
          <div className="concierge-content">
            <span className="badge-luxury" style={{ color: "#2c5a42", borderColor: "rgba(44, 90, 66, 0.3)" }}>
              ✦ PALI STORE ORDERS
            </span>
            <h3 style={{ fontSize: "1.45rem", marginTop: 8, letterSpacing: "-0.02em" }}>
              Looking for a specific cosmetic product or instant delivery in Pali?
            </h3>
            <p className="small muted" style={{ marginTop: 6, maxWidth: 580, lineHeight: 1.6 }}>
              Message our store directly on WhatsApp to check stock availability, confirm shades, or place an order for same-day delivery.
            </p>
          </div>
          <a
            className="btn btn-luxury-primary"
            href={whatsappHref("Hello Mama Store, I would like to check product availability and place an order.")}
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
