"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { brandOf, categoryOf, offersOf, relatedProducts } from "@/data/catalog";
import { discountPercent, isEnquiryPrice } from "@/data/products";
import { formatInr, productWhatsappMessage, whatsappHref } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";
import { ProductGrid, ProductMedia } from "@/components/product/ProductCard";
import { reviews } from "@/data/reviews";

export function ProductDetails({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [image, setImage] = useState(0);
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState<string | null>(null);

  const brand = brandOf(product);
  const category = categoryOf(product);
  const variant = product.variants?.find((v) => v.id === variantId);
  const needsVariant = Boolean(product.variants?.length);
  const variantReady = !needsVariant || Boolean(variant);
  const variantInStock = !variant || variant.inStock;
  const canBuy = product.inStock && variantReady && variantInStock && !isEnquiryPrice(product);
  const related = relatedProducts(product);
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const currentPrice = variant?.price ?? product.price;
  const currentMrp = variant?.mrp ?? product.mrp;
  const hasDiscount = currentMrp != null && currentPrice != null && currentMrp > currentPrice;
  const currentDiscountPercent = hasDiscount
    ? Math.round(((currentMrp! - currentPrice!) / currentMrp!) * 100)
    : discountPercent(product);

  function addToBag() {
    if (!canBuy) return;
    add(product, qty, variant ? { id: variant.id, name: variant.name } : undefined);
    setNote(`Added ${variant ? variant.name : product.name} to bag`);
  }

  function buyNow() {
    addToBag();
    router.push("/checkout");
  }

  return (
    <div className="page">
      <div className="shell pdp">
        <div>
          <div
            className="gallery-main"
            style={{ background: product.gallery[image]?.tone }}
            aria-label={product.gallery[image]?.label}
          >
            <ProductMedia
              product={product}
              tone={product.gallery[image]?.tone}
              customImageUrl={variant?.image || product.gallery[image]?.url || product.image}
            />
          </div>
          <div className="thumbs" style={{ marginTop: 12, display: "flex", gap: 10 }}>
            {product.gallery.map((g, i) => (
              <button
                key={g.label + i}
                type="button"
                style={{
                  background: g.tone,
                  border: i === image ? "2px solid var(--rose, #be123c)" : "1px solid rgba(0,0,0,0.1)",
                  borderRadius: 10,
                  width: 56,
                  height: 56,
                  overflow: "hidden",
                  padding: 0,
                  cursor: "pointer",
                  position: "relative",
                  transform: i === image ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.2s ease"
                }}
                aria-label={g.label}
                aria-current={i === image}
                onClick={() => setImage(i)}
              >
                {g.url ? (
                  <img src={g.url} alt={g.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{g.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">{brand?.name}</p>
          <h1 style={{ fontSize: "2rem", margin: "8px 0" }}>{product.name}</h1>
          <p className="muted small">
            {category?.name} · {variant?.size || product.size}
          </p>
          <p style={{ marginTop: 12 }}>
            {isEnquiryPrice(product) ? (
              <span className="price">Contact for price</span>
            ) : (
              <>
                {currentDiscountPercent > 0 && currentMrp != null ? (
                  <s className="muted">{formatInr(currentMrp)}</s>
                ) : null}{" "}
                <span className="price">{formatInr(currentPrice as number)}</span>
                {currentDiscountPercent > 0 ? (
                  <span className="badge" style={{ marginLeft: 8 }}>
                    {currentDiscountPercent}% off
                  </span>
                ) : null}
              </>
            )}
          </p>
          <p style={{ marginTop: 10 }}>
            {product.inStock && variantInStock ? (
              <span className="badge ok">In stock</span>
            ) : (
              <span className="badge warn">Out of stock</span>
            )}
            {offersOf(product).map((o) => (
              <Link key={o.id} href={`/offers/${o.slug}`} className="badge gold" style={{ marginLeft: 6 }}>
                {o.badge}
              </Link>
            ))}
          </p>
          <p style={{ marginTop: 16 }}>{product.description}</p>
          {product.details ? (
            <p className="muted" style={{ marginTop: 10 }}>
              {product.details}
            </p>
          ) : null}
          {product.ingredients ? (
            <p className="small muted" style={{ marginTop: 10 }}>
              Ingredients / details: {product.ingredients}
            </p>
          ) : null}

          {product.variants && product.variants.length > 0 ? (
            <div className="blinkit-pack-section" style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                <div>
                  <p className="eyebrow" style={{ color: "#1c1614", fontWeight: 700, margin: 0 }}>
                    Select Unit / Pack
                  </p>
                  <p className="small muted" style={{ margin: "2px 0 0" }}>
                    {variant?.name} {variant && !variant.inStock ? " · currently unavailable" : ""}
                  </p>
                </div>
                <span className="blinkit-badge-subtle">
                  {product.variants.length} Options
                </span>
              </div>
              <div className="blinkit-pack-grid">
                {product.variants.map((v) => {
                  const isSelected = v.id === variantId;
                  const vPrice = v.price ?? product.price;
                  const vMrp = v.mrp ?? product.mrp;
                  const vDiscount = vMrp && vPrice && vMrp > vPrice ? Math.round(((vMrp - vPrice) / vMrp) * 100) : 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      className={`blinkit-pack-card ${isSelected ? "selected" : ""} ${!v.inStock ? "disabled" : ""}`}
                      onClick={() => {
                        setVariantId(v.id);
                        if (v.image) {
                          const idx = product.gallery.findIndex((g) => g.url === v.image);
                          if (idx !== -1) setImage(idx);
                        }
                      }}
                      disabled={!v.inStock}
                      aria-current={isSelected}
                      aria-label={`${v.name} for ${vPrice ? formatInr(vPrice) : "price"}`}
                    >
                      <div className="blinkit-pack-top">
                        {v.swatch ? (
                          <span
                            className="blinkit-pack-swatch"
                            style={{ background: v.swatch }}
                            aria-hidden="true"
                          />
                        ) : null}
                        <span className="blinkit-pack-name">{v.name}</span>
                        {isSelected ? <span className="blinkit-pack-check">✓</span> : null}
                      </div>
                      {vPrice != null ? (
                        <div className="blinkit-pack-price-row">
                          <span className="blinkit-pack-price">{formatInr(vPrice)}</span>
                          {vMrp && vMrp > vPrice ? (
                            <s className="blinkit-pack-mrp">{formatInr(vMrp)}</s>
                          ) : null}
                        </div>
                      ) : null}
                      {vDiscount > 0 ? (
                        <div className="blinkit-pack-discount">{vDiscount}% OFF</div>
                      ) : null}
                      {!v.inStock ? (
                        <span className="blinkit-pack-soldout">Unavailable</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div style={{ marginTop: 18 }}>
            <p className="eyebrow">Quantity</p>
            <div className="qty" style={{ marginTop: 8 }}>
              <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease quantity">
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty((n) => n + 1)} aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>

          {note ? (
            <p className="small" role="status" style={{ marginTop: 10 }}>
              {note}
            </p>
          ) : null}

          <div className="actions-stack" style={{ marginTop: 18 }}>
            <button className="btn" type="button" disabled={!canBuy} onClick={addToBag}>
              Add to cart
            </button>
            <button className="btn secondary" type="button" disabled={!canBuy} onClick={buyNow}>
              Buy now
            </button>
            <a
              className="btn secondary"
              href={whatsappHref(productWhatsappMessage(product, variant?.name))}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp enquiry
            </a>
          </div>
          {isEnquiryPrice(product) ? (
            <p className="notice" style={{ marginTop: 12 }}>
              This listing uses Contact for Price. Message the store on WhatsApp for the current rate, then order.
            </p>
          ) : null}
        </div>
      </div>
      {productReviews.length ? (
        <section className="shell section">
          <div className="section-head">
            <h2>Customer Reviews</h2>
            <p className="muted small">
              ★ {product.rating} · ({product.reviewCount} reviews)
            </p>
          </div>
          <div className="review-grid">
            {productReviews.map((r) => (
              <article key={r.id} className="review-card">
                <p className="stars" aria-label={`${r.rating} out of 5`}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                <h3>{r.title}</h3>
                <p className="small muted">{r.author}</p>
                <p style={{ marginTop: 8 }}>{r.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <section className="shell section">
        <div className="section-head">
          <h2>Related</h2>
        </div>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
