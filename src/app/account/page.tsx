"use client";

import Link from "next/link";
import { formatInr } from "@/lib/format";
import { useCart } from "@/components/cart/CartProvider";

export default function AccountPage() {
  const { lastOrder } = useCart();

  return (
    <div className="page">
      <div className="shell" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Account</p>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Your orders</h1>
        <p className="notice">
          Track verified order fulfillment and delivery status directly below.
        </p>
        {lastOrder ? (
          <article className="summary" style={{ marginTop: 16 }}>
            <p className="eyebrow">Recent Order</p>
            <h2>
              <Link href={`/order/${lastOrder.id}`}>{lastOrder.id}</Link>
            </h2>
            <p className="small muted">{new Date(lastOrder.placedAt).toLocaleString("en-IN")}</p>
            <p style={{ marginTop: 8 }}>
              {lastOrder.lines.length} items ·{" "}
              {lastOrder.subtotal == null ? "To confirm" : formatInr(lastOrder.subtotal + lastOrder.deliveryFee)}
            </p>
            <div style={{ marginTop: 14 }}>
              <Link className="btn" href={`/order/${lastOrder.id}`}>
                View Verified Order →
              </Link>
            </div>
          </article>
        ) : (
          <div className="empty" style={{ marginTop: 16 }}>
            <p>No active orders placed in this session.</p>
            <Link className="btn" href="/shop" style={{ marginTop: 12 }}>
              Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
