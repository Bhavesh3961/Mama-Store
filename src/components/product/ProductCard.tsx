"use client";

import Link from "next/link";
import type { Product, ProductVariant } from "@/data/products";
import { brandOf, categoryOf, offersOf } from "@/data/catalog";
import { discountPercent, isEnquiryPrice } from "@/data/products";
import { formatInr } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";

export function CosmeticIconArt({ categoryId, tone }: { categoryId?: string; tone?: string }) {
  // Generates luxury minimalist cosmetic vector art according to category
  const isFragrance = categoryId === "cat-fragrance";
  const isMakeup = categoryId === "cat-makeup";
  const isHair = categoryId === "cat-hair";

  return (
    <div
      style={{
        width: 110,
        height: 140,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      {/* Soft radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 10,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(217,119,87,0.12) 60%, transparent 80%)",
          filter: "blur(10px)",
        }}
      />

      {isFragrance ? (
        // Luxury perfume bottle vector
        <svg width="76" height="110" viewBox="0 0 80 120" fill="none">
          <rect x="30" y="8" width="20" height="14" rx="4" fill="#c89f5f" stroke="#8f734c" strokeWidth="1.5" />
          <rect x="34" y="2" width="12" height="7" rx="2" fill="#1c1614" />
          <rect x="12" y="24" width="56" height="84" rx="14" fill="rgba(255,255,255,0.85)" stroke="#c89f5f" strokeWidth="1.5" />
          <rect x="18" y="44" width="44" height="42" rx="4" fill="rgba(217,119,87,0.15)" stroke="rgba(200,159,95,0.6)" strokeWidth="1" />
          <line x1="24" y1="58" x2="56" y2="58" stroke="#8f734c" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="28" y1="66" x2="52" y2="66" stroke="#8f734c" strokeWidth="1" />
        </svg>
      ) : isMakeup ? (
        // Luxury lipstick / compact
        <svg width="70" height="110" viewBox="0 0 80 120" fill="none">
          <rect x="25" y="50" width="30" height="60" rx="4" fill="#1c1614" stroke="#c89f5f" strokeWidth="1.5" />
          <rect x="27" y="32" width="26" height="18" fill="#c89f5f" />
          <path d="M28 32 L36 12 Q40 8 44 12 L52 32 Z" fill="#b8384b" />
          <line x1="25" y1="80" x2="55" y2="80" stroke="#c89f5f" strokeWidth="1" />
        </svg>
      ) : isHair ? (
        // Botanical pump bottle
        <svg width="72" height="110" viewBox="0 0 80 120" fill="none">
          <rect x="18" y="36" width="44" height="74" rx="10" fill="rgba(255,255,255,0.85)" stroke="#8f734c" strokeWidth="1.5" />
          <rect x="34" y="24" width="12" height="12" fill="#c89f5f" />
          <path d="M40 24 V10 H58 V16 H44" stroke="#1c1614" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="40" cy="72" r="14" fill="rgba(143,115,76,0.12)" stroke="#c89f5f" strokeWidth="1" />
        </svg>
      ) : (
        // Dropper serum elixir bottle
        <svg width="70" height="110" viewBox="0 0 80 120" fill="none">
          <rect x="18" y="38" width="44" height="70" rx="12" fill="rgba(255,255,255,0.9)" stroke="#c89f5f" strokeWidth="1.5" />
          <rect x="28" y="26" width="24" height="12" rx="2" fill="#c89f5f" />
          <path d="M34 26 C34 16 46 16 46 26" fill="#1c1614" />
          <line x1="40" y1="38" x2="40" y2="92" stroke="#d97757" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="40" cy="94" r="3.5" fill="#d97757" />
          <rect x="24" y="52" width="32" height="38" rx="2" fill="rgba(247,236,228,0.7)" stroke="#e3d8ce" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
}

export function ProductMedia({
  product,
  label,
  tone: toneOverride,
  customImageUrl,
}: {
  product: Product;
  label?: string;
  tone?: string;
  customImageUrl?: string;
}) {
  const imageUrl = customImageUrl || product.image || product.gallery[0]?.url;
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="product-media-lux product-media-studio"
      style={{
        background: "radial-gradient(circle at 50% 38%, #FFFFFF 0%, #FAF8F5 65%, #F3EFEA 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      aria-hidden
    >
      {/* Ambient Pedestal Lighting */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 50% 35%, rgba(255,255,255,1) 0%, rgba(250,248,245,0.4) 60%, transparent 80%)",
          pointerEvents: "none",
        }}
      />

      {/* 3D Contact Shadow Pedestal */}
      <div
        style={{
          position: "absolute",
          bottom: "7%",
          left: "15%",
          right: "15%",
          height: "14px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(20, 25, 22, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(3px)",
        }}
      />

      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={product.name}
          className="product-card-real-img"
          onError={() => setImgError(true)}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "16px",
            position: "absolute",
            inset: 0,
            mixBlendMode: "normal",
            transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ) : (
        <CosmeticIconArt categoryId={product.categoryId} />
      )}

      {label ? (
        <span className="badge-luxury" style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          {label}
        </span>
      ) : null}
      <span className="volume-tag" style={{ zIndex: 2 }}>{product.size}</span>
    </div>
  );
}

export function PriceLabel({ product, selectedVariant }: { product: Product; selectedVariant?: ProductVariant }) {
  if (isEnquiryPrice(product)) {
    return <span className="price">Contact for Price</span>;
  }
  const price = selectedVariant?.price ?? product.price;
  const mrp = selectedVariant?.mrp ?? product.mrp;
  const hasDiscount = mrp != null && mrp > (price as number);
  return (
    <span className="price-lux">
      {hasDiscount ? <s className="old-mrp">{formatInr(mrp as number)}</s> : null}
      <span className="current-price">{formatInr(price as number)}</span>
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.find((v) => v.inStock) ?? product.variants?.[0]
  );
  const brand = brandOf(product);
  const label = !product.inStock ? "Sold out" : undefined;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    add(product, 1, selectedVariant ? { id: selectedVariant.id, name: selectedVariant.name } : undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <article className="product-card-lux liquid-glass-panel-card">
      <Link href={`/product/${product.slug}`} className="card-link-wrapper">
        <ProductMedia
          product={product}
          label={label}
          customImageUrl={selectedVariant?.image || product.image}
        />
        <div className="meta-lux">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <p className="brand-eyebrow">{brand?.name || "Atelier Beauty"}</p>
            <span className="stars-mini">★ {product.rating.toFixed(1)}</span>
          </div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-desc-line">{product.description}</p>

          {product.variants && product.variants.length > 1 ? (
            <div
              className="card-variant-chips"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {product.variants.slice(0, 3).map((v) => {
                const isActive = (selectedVariant?.id || product.variants![0]?.id) === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    className={`card-variant-chip ${isActive ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    title={`${v.name} - ${v.price ? formatInr(v.price) : ""}`}
                  >
                    {v.name.replace(/\s*\(.*\)/, "")}
                  </button>
                );
              })}
              {product.variants.length > 3 ? (
                <span className="card-variant-chip more">+{product.variants.length - 3}</span>
              ) : null}
            </div>
          ) : null}

          <div className="card-bottom-row">
            <PriceLabel product={product} selectedVariant={selectedVariant} />
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`quick-add-btn ${added ? "added" : ""}`}
              aria-label={`Add ${product.name} to bag`}
              title="Add to shopping bag"
            >
              {added ? "Added ✓" : "+ Bag"}
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="empty liquid-glass-card" style={{ padding: "60px 20px" }}>
        <h2>No formulation match</h2>
        <p className="muted" style={{ marginTop: 8 }}>
          Try clearing filters or explore our full Pali atelier boutique collection.
        </p>
      </div>
    );
  }
  return (
    <div className="product-grid-lux">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
