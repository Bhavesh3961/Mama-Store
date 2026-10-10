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

export function ProductDetails({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [image, setImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState<string | null>(null);

  const brand = brandOf(product);
  const category = categoryOf(product);
  const canBuy = product.inStock && !isEnquiryPrice(product);
  const related = relatedProducts(product);

  const currentPrice = product.price;
  const currentMrp = product.mrp;
  const hasDiscount = currentMrp != null && currentPrice != null && currentMrp > currentPrice;
  const currentDiscountPercent = hasDiscount
    ? Math.round(((currentMrp! - currentPrice!) / currentMrp!) * 100)
    : discountPercent(product);

  function addToBag() {
    if (!canBuy) return;
    add(product, qty);
    setNote(`Added ${product.name} to bag`);
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
              customImageUrl={product.gallery[image]?.url || product.image}
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
            {category?.name} · {product.size}
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
            {product.inStock ? (
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
              href={whatsappHref(productWhatsappMessage(product))}
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
      <section className="shell section">
        <div className="section-head">
          <h2>Related</h2>
        </div>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
