"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { store } from "@/data/store";
import { formatInr, whatsappHref } from "@/lib/format";
import { useCart, type PlacedOrder } from "@/components/cart/CartProvider";
import type { OrderWithItems } from "@/lib/db/types";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { lastOrder } = useCart();
  const [dbOrder, setDbOrder] = useState<OrderWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    fetch(`/api/orders/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Order not found or authorization required.");
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.order) {
          setDbOrder(data.order);
        }
      })
      .catch((err) => {
        if (isMounted && (!lastOrder || lastOrder.id !== id)) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, lastOrder]);

  const orderId = dbOrder?.id || lastOrder?.id;
  const isMatch = (lastOrder && lastOrder.id === id) || Boolean(dbOrder);

  if (loading && !lastOrder) {
    return (
      <div className="page">
        <div className="shell empty">
          <h1>Finding your order…</h1>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Retrieving verified order details from store database.
          </p>
        </div>
      </div>
    );
  }

  if (!isMatch || error) {
    return (
      <div className="page">
        <div className="shell empty">
          <h1>Order not accessible</h1>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            This order confirmation is protected or does not exist.
          </p>
          <Link className="btn" href="/shop">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  const customerName = dbOrder ? dbOrder.customer_name : lastOrder?.payload.name;
  const customerPhone = dbOrder ? dbOrder.customer_phone : lastOrder?.payload.mobile;
  const customerAddress = dbOrder
    ? `${dbOrder.address}, ${dbOrder.city} ${dbOrder.pincode}`
    : `${lastOrder?.payload.address}, ${lastOrder?.payload.city} ${lastOrder?.payload.pincode}`;
  const paymentMethod = dbOrder ? dbOrder.payment_method : lastOrder?.payload.payment;
  const payLabel = paymentMethod === "cod" ? "Pay on delivery" : "UPI after confirmation";
  const status = dbOrder?.status || "Pending";
  const subtotal = dbOrder ? dbOrder.subtotal : lastOrder?.subtotal ?? 0;
  const deliveryFee = dbOrder ? dbOrder.delivery_fee : lastOrder?.deliveryFee ?? 0;
  const total = dbOrder ? dbOrder.total : (lastOrder?.subtotal ?? 0) + (lastOrder?.deliveryFee ?? 0);

  const wa = `Hello ${store.name}, I placed website order ${orderId}.\n${customerName}, ${customerPhone}`;

  return (
    <div className="page">
      <div className="shell">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.25rem, 5vw, 1.85rem)", wordBreak: "break-all" }}>
              Order #{typeof orderId === "string" ? orderId.slice(0, 10).toUpperCase() : orderId}
            </h1>
          </div>
          <span
            className="badge-luxury"
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "0.85rem",
              fontWeight: 600,
              background:
                status === "Delivered"
                  ? "#dcfce7"
                  : status === "Cancelled"
                  ? "#fee2e2"
                  : status === "Shipped"
                  ? "#e0e7ff"
                  : "#fef3c7",
              color:
                status === "Delivered"
                  ? "#166534"
                  : status === "Cancelled"
                  ? "#991b1b"
                  : status === "Shipped"
                  ? "#3730a3"
                  : "#92400e",
            }}
          >
            ● {status}
          </span>
        </div>

        <p className="notice" style={{ marginTop: 12, background: "rgba(34, 197, 94, 0.08)", borderColor: "rgba(34, 197, 94, 0.3)", color: "#166534" }}>
          ✓ Your order has been placed and forwarded to store owner on WhatsApp (+91 76899 56116). We will confirm your delivery slot shortly.
        </p>

        <div className="summary" style={{ marginTop: 16 }}>
          {dbOrder ? (
            dbOrder.items.map((it) => (
              <div className="row" key={it.id}>
                <span>
                  {it.product_name} × {it.quantity}
                </span>
                <span>{formatInr(it.total_price)}</span>
              </div>
            ))
          ) : lastOrder ? (
            lastOrder.lines.map((l) => (
              <div className="row" key={l.key}>
                <span>
                  {l.name} × {l.quantity}
                </span>
                <span>{l.unitPrice == null ? "Quoted" : formatInr(l.unitPrice * l.quantity)}</span>
              </div>
            ))
          ) : null}

          <div className="row">
            <span>Delivery</span>
            <span>{deliveryFee === 0 ? "Free" : formatInr(deliveryFee)}</span>
          </div>
          <div className="row">
            <strong>Total</strong>
            <strong>{formatInr(total)}</strong>
          </div>
          <p className="small muted" style={{ marginTop: 12 }}>
            {customerName} · {customerPhone}
            <br />
            {customerAddress}
            <br />
            Payment: {payLabel}
          </p>
        </div>
        <div className="actions-stack" style={{ marginTop: 16, maxWidth: 360 }}>
          <a className="btn" href={whatsappHref(wa)} target="_blank" rel="noreferrer" style={{ background: "#25D366", borderColor: "#25D366", color: "#FFFFFF" }}>
            💬 Message Store on WhatsApp (+91 76899 56116)
          </a>
          <Link className="btn secondary" href="/shop">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
