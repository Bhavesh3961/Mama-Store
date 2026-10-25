"use client";

import Link from "next/link";
import { getProductById, isEnquiryPrice } from "@/data/products";
import { store } from "@/data/store";
import { cartWhatsappMessage, formatInr, whatsappHref } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

export function CartView() {
  const { lines, setQty, remove, subtotal, deliveryFee, total, hasEnquiry, count } = useCart();

  if (!lines.length) {
    return (
      <div className="page">
        <div className="shell empty glass-card" style={{ padding: "60px 24px" }}>
          <h1>Your bag is empty</h1>
          <p className="muted" style={{ margin: "12px 0 20px", maxWidth: 440, marginInline: "auto" }}>
            Explore our curated skincare, luxury fragrances, and makeup collections.
          </p>
          <Link className="btn" href="/shop">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  const waLines = lines
    .map((l) => {
      const p = getProductById(l.productId);
      return `• ${p?.name ?? l.productId}${l.variantName ? ` (${l.variantName})` : ""} × ${l.quantity}`;
    })
    .join("\n");

  return (
    <div className="page">
      <div className="shell">
        <p className="eyebrow">Shopping Bag</p>
        <h1 style={{ fontSize: "2.2rem", marginBottom: 16 }}>
          {count} {count === 1 ? "Product" : "Products"} Selected
        </h1>
        <div className="cart-layout">
          <div>
            {lines.map((line) => {
              const product = getProductById(line.productId);
              if (!product) return null;
              return (
                <article key={line.key} className="cart-line glass-panel" style={{ padding: 16, marginBottom: 12, borderRadius: 16 }}>
                  <div
                    className="product-media"
                    style={{
                      background: product.gallery[0]?.tone ?? "#f5ece6",
                      height: 80,
                      width: 80,
                      aspectRatio: "1",
                      borderRadius: 12,
                      overflow: "hidden",
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      color: "#6b2d38"
                    }}
                  >
                    {product.image ? (
                      <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      product.name.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div style={{ flex: 1, paddingLeft: 12 }}>
                    <Link href={`/product/${product.slug}`} style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                      {product.name}
                    </Link>
                    {line.variantName ? <p className="small muted">{line.variantName}</p> : null}
                    <p className="small" style={{ fontWeight: 600, marginTop: 4 }}>
                      {isEnquiryPrice(product)
                        ? "Contact for price"
                        : formatInr(
                            (product.variants?.find((vx) => vx.id === line.variantId)?.price ?? product.price) as number
                          )}
                    </p>
                    <div className="qty" style={{ marginTop: 10 }}>
                      <button type="button" aria-label="Decrease" onClick={() => setQty(line.key, line.quantity - 1)}>
                        −
                      </button>
                      <span>{line.quantity}</span>
                      <button type="button" aria-label="Increase" onClick={() => setQty(line.key, line.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button className="btn ghost" type="button" onClick={() => remove(line.key)}>
                    Remove
                  </button>
                </article>
              );
            })}
          </div>

          <div className="summary glass-card" style={{ padding: 24, borderRadius: 20 }}>
            <h3 style={{ marginBottom: 16 }}>Order Summary</h3>
            <div className="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="muted">Subtotal</span>
              <span style={{ fontWeight: 600 }}>{hasEnquiry || subtotal == null ? "Quoted on WhatsApp" : formatInr(subtotal)}</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="muted">Delivery in {store.city}</span>
              <span style={{ fontWeight: 600, color: "#166534" }}>Free</span>
            </div>
            <div className="row" style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 12, marginTop: 8 }}>
              <strong style={{ fontSize: "1.2rem" }}>Estimated Total</strong>
              <strong style={{ fontSize: "1.2rem", color: "var(--rose)" }}>{total == null ? "To be confirmed" : formatInr(total)}</strong>
            </div>
            <p className="small muted" style={{ marginTop: 12 }}>{store.delivery}</p>
            {hasEnquiry ? (
              <p className="notice" style={{ marginTop: 12 }}>
                Your bag includes Contact for Price items. Checkout is available after the store quotes, or continue directly on WhatsApp.
              </p>
            ) : null}
            <div className="actions-stack" style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
              <Link
                className="btn"
                href="/checkout"
                aria-disabled={hasEnquiry}
                style={hasEnquiry ? { pointerEvents: "none", opacity: 0.45, flex: 1 } : { flex: 1 }}
              >
                Proceed to Checkout
              </Link>
              <a
                className="btn secondary"
                style={{ flex: 1 }}
                href={whatsappHref(cartWhatsappMessage(waLines, total == null ? "Total: please quote" : `Total listed: ${formatInr(total)}`))}
                target="_blank"
                rel="noreferrer"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
