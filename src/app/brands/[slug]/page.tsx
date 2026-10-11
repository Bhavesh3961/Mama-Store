import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brands, getBrand } from "@/data/brands";
import { getAllProductsForCatalog } from "@/lib/db/queries";
import { brandOf } from "@/data/catalog";
import { ProductGrid } from "@/components/product/ProductCard";
import { whatsappHref } from "@/lib/format";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Brand Not Found · Mama Store" };

  return {
    title: `${brand.name} Collection · 100% Authentic · Mama Store Pali`,
    description: `Shop genuine, 100% authentic ${brand.name} products directly sourced from authorized brand distributors at Mama Store Pali.`,
  };
}

export default async function BrandBoutiquePage({ params }: Props) {
  const { slug } = await params;
  const brand = getBrand(slug);

  if (!brand) {
    notFound();
  }

  const allProducts = getAllProductsForCatalog();
  const brandProducts = allProducts.filter(
    (p) => p.brandId === brand.id || brandOf(p)?.slug === brand.slug
  );

  const primaryColor = brand.primaryColor || "#1b4d3e";
  const themeBg = brand.themeBg || "#faf7f2";
  const accentColor = brand.accentColor || "#c5a880";

  return (
    <div
      className="page page-brand-boutique"
      style={
        {
          "--brand-primary": primaryColor,
          "--brand-accent": accentColor,
          "--brand-bg": themeBg,
          backgroundColor: themeBg,
          minHeight: "100vh",
          transition: "background-color 0.4s ease",
        } as React.CSSProperties
      }
    >
      {/* Dynamic Top Atmospheric Ambient Glow */}
      <div
        className="brand-ambient-glow"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 380,
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${primaryColor}22 0%, transparent 80%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div className="shell" style={{ position: "relative", zIndex: 1 }}>
        {/* Navigation / Wayfinder Bar */}
        <div className="brand-boutique-nav">
          <Link href="/brands" className="brand-back-pill" aria-label="Back to all brands">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>All Brands</span>
          </Link>

          <span
            className="brand-item-counter-pill"
            style={{
              color: primaryColor,
              borderColor: `${primaryColor}33`,
              background: "rgba(255, 255, 255, 0.85)",
            }}
          >
            ✦ {brandProducts.length} {brandProducts.length === 1 ? "Product" : "Products"} Available
          </span>
        </div>

        {/* Branded Boutique Hero Banner */}
        <header className="brand-boutique-hero">
          {/* Authentic Brand Logo Showcase Card */}
          <div
            className="brand-boutique-logo-card"
            style={{
              background: brand.logoBg || "rgba(255, 255, 255, 0.95)",
              borderColor: `${primaryColor}26`,
              boxShadow: `0 12px 36px -8px ${primaryColor}1a, 0 2px 10px rgba(0, 0, 0, 0.04)`,
            }}
          >
            <img
              src={brand.logoUrl}
              alt={`${brand.name} logo`}
              className="brand-boutique-logo-img"
            />
          </div>

          {/* Brand Identity & Tagline */}
          <div className="brand-boutique-headings">
            <div className="brand-boutique-badge-wrap">
              <span
                className="brand-boutique-badge"
                style={{
                  color: primaryColor,
                  borderColor: `${primaryColor}38`,
                  background: `${primaryColor}0d`,
                }}
              >
                ✦ 100% DIRECT ATELIER STOCK · VERIFIED AUTHENTIC
              </span>
            </div>

            <h1
              className="brand-boutique-title"
              style={{
                color: "#141916",
              }}
            >
              {brand.name}
            </h1>

            {brand.tagline ? (
              <p className="brand-boutique-tagline">
                {brand.tagline}
              </p>
            ) : null}
          </div>
        </header>

        {/* Brand Products Section */}
        <main className="brand-boutique-collection" style={{ marginTop: 28, marginBottom: 56 }}>
          {brandProducts.length > 0 ? (
            <div className="brand-products-grid-wrap">
              <ProductGrid products={brandProducts} />
            </div>
          ) : (
            <div
              className="brand-empty-state-card"
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderColor: `${primaryColor}22`,
                textAlign: "center",
                padding: "48px 24px",
                borderRadius: 24,
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
              }}
            >
              <h3 style={{ fontSize: "1.35rem", marginBottom: 8 }}>
                Curating New {brand.name} Stock
              </h3>
              <p className="muted" style={{ maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.6 }}>
                Our salon atelier receives fresh batches regularly. Contact Mama Store Pali directly to check in-store stock or place a custom order.
              </p>
              <a
                href={whatsappHref(`Hello Mama Store Pali, I would like to inquire about ${brand.name} products.`)}
                className="btn btn-luxury-primary"
                target="_blank"
                rel="noreferrer"
                style={{
                  backgroundColor: primaryColor,
                  color: "#ffffff",
                  borderColor: primaryColor,
                }}
              >
                Inquire on WhatsApp
              </a>
            </div>
          )}
        </main>

        {/* Concierge Assurance Footer */}
        <div
          className="brand-boutique-concierge-strip"
          style={{
            borderColor: `${primaryColor}20`,
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <div className="concierge-text">
            <strong style={{ display: "block", fontSize: "1rem", color: "#141916" }}>
              100% Genuine {brand.name} Guarantee
            </strong>
            <span className="small muted">
              All items in the {brand.name} collection are sourced directly from authorized Indian beauty distributors.
            </span>
          </div>
          <a
            className="btn btn-sm btn-outline-brand"
            style={{
              borderColor: `${primaryColor}55`,
              color: primaryColor,
            }}
            href={whatsappHref(`Hello Mama Store, I need assistance with ${brand.name} collection.`)}
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
