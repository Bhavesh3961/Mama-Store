import Link from "next/link";
import type { Metadata } from "next";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "Top Cosmetic Brands · Mama Store Pali",
  description: "Shop 100% genuine Maybelline, L'Oréal Paris, MAC, Lakmé, The Ordinary, Huda Beauty, and more at Mama Store Pali.",
};

export default function BrandsPage() {
  return (
    <div className="page page-theme-brands">
      <div className="shell">
        <div style={{ marginBottom: 28 }}>
          <span className="badge-luxury" style={{ color: "#059669", borderColor: "#a7f3d0" }}>
            100% ORIGINAL & AUTHENTIC
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: 8 }}>Top Brands in Store</h1>
          <p className="muted" style={{ maxWidth: 620, marginTop: 6, fontSize: "1.05rem" }}>
            Direct stock from authorized distributors. Enjoy special retail and wholesale salon discounts on famous world-class brands.
          </p>
        </div>

        <div className="brands-grid-modern">
          {brands.map((b) => (
            <article key={b.id} className="brand-card-modern">
              <div className="brand-logo-badge" style={{ background: b.logoBg ?? "linear-gradient(135deg, #f5f3f0, #e7e5e4)" }}>
                {b.logoUrl ? (
                  <img
                    src={b.logoUrl}
                    alt={`${b.name} logo`}
                    className="brand-logo-image"
                  />
                ) : null}
              </div>

              <div className="brand-card-header">
                <span className="brand-origin-tag">{b.origin}</span>
                {b.badge ? <span className="badge-luxury gold">{b.badge}</span> : null}
              </div>

              <div className="brand-card-title-row">
                <h2>{b.name}</h2>
                <Link
                  href={`/shop?brand=${b.slug}`}
                  aria-label={`Shop ${b.name}`}
                  className="brand-shop-cart"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 4h2l2.2 9.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="10" cy="18.5" r="1.4" fill="currentColor"/>
                    <circle cx="17" cy="18.5" r="1.4" fill="currentColor"/>
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Wholesale Brand Inquiry Banner */}
        <div className="wholesale-brand-cta" style={{ marginTop: 40 }}>
          <div>
            <h3>Are you looking for bulk quantity in any brand?</h3>
            <p className="small muted" style={{ marginTop: 4 }}>
              Mama Store provides salon cartons, parlour kits, and festive bulk hampers with special wholesale margins.
            </p>
          </div>
          <a
            className="btn btn-luxury-wa"
            href="https://wa.me/?text=Hello%20Mama%20Store%2C%20I%20am%20looking%20for%20bulk%20brand%20pricing%20for%20my%20salon%2Fshop."
            target="_blank"
            rel="noreferrer"
          >
            Inquire Bulk Brand Pricing
          </a>
        </div>
      </div>
    </div>
  );
}
