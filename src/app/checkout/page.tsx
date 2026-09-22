"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, isEnquiryPrice } from "@/data/products";
import { store } from "@/data/store";
import { formatInr } from "@/lib/format";
import { useCart, type CheckoutPayload } from "@/components/cart/CartProvider";

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFee, total, hasEnquiry, placeOrder } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payment, setPayment] = useState<CheckoutPayload["payment"]>("cod");

  if (!lines.length) {
    return (
      <div className="page">
        <div className="shell empty">
          <h1>Nothing to check out</h1>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Add products to your bag first.
          </p>
          <Link className="btn" href="/shop">
            Shop
          </Link>
        </div>
      </div>
    );
  }

  if (hasEnquiry) {
    return (
      <div className="page">
        <div className="shell empty">
          <h1>Price confirmation needed</h1>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Contact for Price items cannot be placed as a website order until the store quotes a rate.
          </p>
          <Link className="btn" href="/cart">
            Back to bag
          </Link>
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const data = new FormData(e.currentTarget);
      const payload: CheckoutPayload = {
        name: String(data.get("name") ?? "").trim(),
        mobile: String(data.get("mobile") ?? "").trim(),
        email: String(data.get("email") ?? "").trim() || undefined,
        address: String(data.get("address") ?? "").trim(),
        city: String(data.get("city") ?? "").trim(),
        state: String(data.get("state") ?? "Rajasthan").trim(),
        pincode: String(data.get("pincode") ?? "").trim(),
        payment,
        notes: String(data.get("notes") ?? "").trim() || undefined,
      };

      if (!payload.name || !/^[6-9]\d{9}$/.test(payload.mobile)) {
        setError("Enter your name and a 10-digit Indian mobile number.");
        setIsSubmitting(false);
        return;
      }
      if (!payload.address || !payload.city || !/^\d{6}$/.test(payload.pincode)) {
        setError("Enter delivery address, city and a 6-digit pincode.");
        setIsSubmitting(false);
        return;
      }

      const result = await placeOrder(payload);
      if ("error" in result) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      router.push(`/order/${result.id}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page">
      <div className="shell checkout-layout">
        <div>
          <p className="eyebrow">Checkout</p>
          <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Delivery details</h1>
          <p className="muted small" style={{ marginBottom: 16 }}>
            Fast delivery in Pali with instant stock reservation.
          </p>
          <form className="form" onSubmit={onSubmit}>
            <label className="field">
              Name
              <input name="name" required autoComplete="name" placeholder="Full name" />
            </label>
            <label className="field">
              Mobile number
              <input name="mobile" required inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" />
            </label>
            <label className="field">
              Email (optional)
              <input name="email" type="email" autoComplete="email" placeholder="For order updates" />
            </label>
            <label className="field">
              Delivery address
              <textarea name="address" required autoComplete="street-address" placeholder="Street, house/shop no., area" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <label className="field">
                City
                <input name="city" required defaultValue={store.city} autoComplete="address-level2" />
              </label>
              <label className="field">
                State
                <input name="state" required defaultValue={store.state || "Rajasthan"} autoComplete="address-level1" />
              </label>
            </div>
            <label className="field">
              Pincode
              <input name="pincode" required inputMode="numeric" defaultValue={store.pincode} autoComplete="postal-code" />
            </label>
            <fieldset className="field" style={{ border: 0, padding: 0 }}>
              <legend className="eyebrow">Payment method</legend>
              <label className="pay-option" style={{ marginTop: 10 }}>
                <input type="radio" name="payment" checked={payment === "cod"} onChange={() => setPayment("cod")} />
                <span>
                  <strong>Pay on delivery</strong>
                  <p className="small muted">Pay with Cash or UPI upon delivery.</p>
                </span>
              </label>
              <label className="pay-option" style={{ marginTop: 8 }}>
                <input type="radio" name="payment" checked={payment === "upi"} onChange={() => setPayment("upi")} />
                <span>
                  <strong>UPI after confirmation</strong>
                  <p className="small muted">Pay via UPI once confirmed by the store.</p>
                </span>
              </label>
            </fieldset>
            <label className="field">
              Order note (optional)
              <textarea name="notes" placeholder="Landmark, preferred time, shade confirmation…" />
            </label>
            {error ? (
              <p role="alert" style={{ color: "var(--danger)" }}>
                {error}
              </p>
            ) : null}
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Placing Order…" : "Place order"}
            </button>
          </form>
        </div>
        <aside className="summary">
          <h2>Order summary</h2>
          {lines.map((line) => {
            const p = getProductById(line.productId);
            if (!p) return null;
            return (
              <div className="row" key={line.key}>
                <span>
                  {p.name}
                  {line.variantName ? ` · ${line.variantName}` : ""} × {line.quantity}
                </span>
                <span>{isEnquiryPrice(p) ? "—" : formatInr((p.price as number) * line.quantity)}</span>
              </div>
            );
          })}
          <div className="row">
            <span>Subtotal</span>
            <span>{subtotal == null ? "—" : formatInr(subtotal)}</span>
          </div>
          <div className="row">
            <span>Delivery</span>
            <span>{subtotal != null && subtotal >= store.freeDeliveryOver ? "Free" : formatInr(deliveryFee)}</span>
          </div>
          <div className="row">
            <strong>Total</strong>
            <strong>{total == null ? "—" : formatInr(total)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}
