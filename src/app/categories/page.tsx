import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategoriesForCatalog } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop by Category · Mama Store Pali",
  description: "Browse skincare, makeup, haircare, fragrances, and festive gifting sets at Mama Store Pali.",
};

export default function CategoriesPage() {
  const categories = getAllCategoriesForCatalog();
  return (
    <div className="page page-theme-categories">
      <div className="shell">
        <div style={{ marginBottom: 28 }}>
          <span className="badge-luxury" style={{ color: "#e11d48", borderColor: "#fecdd3" }}>
            ALL DEPARTMENTS
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: 8 }}>Shop by Category</h1>
          <p className="muted" style={{ maxWidth: 580, marginTop: 6, fontSize: "1.05rem" }}>
            Explore 100% authentic cosmetics, professional salon ranges, and daily beauty essentials in Pali.
          </p>
        </div>

        <div className="cat-grid-modern">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="cat-card-modern"
            >
              <div className="cat-card-top">
                <span className="cat-orb" style={{ background: c.tone }} />
                <span className="cat-arrow-pill">Explore →</span>
              </div>
              <h2 style={{ fontSize: "1.35rem", margin: "14px 0 6px" }}>{c.name}</h2>
              <p className="small muted" style={{ lineHeight: 1.5, flex: 1 }}>{c.description}</p>
              <div className="cat-card-footer">
                <span className="cat-deal-tag">⚡ Deals & Combos Available</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="category-help-banner" style={{ marginTop: 40 }}>
          <div>
            <h3>Need help choosing the right shade or product?</h3>
            <p className="small muted" style={{ marginTop: 4 }}>
              Our Pali beauty advisors are available on WhatsApp to recommend the best products for your skin.
            </p>
          </div>
          <a
            className="btn btn-luxury-wa"
            href="https://wa.me/?text=Hello%20Mama%20Store%2C%20I%20need%20help%20choosing%20cosmetics%20from%20your%20categories."
            target="_blank"
            rel="noreferrer"
          >
            Chat with Beauty Advisor
          </a>
        </div>
      </div>
    </div>
  );
}
