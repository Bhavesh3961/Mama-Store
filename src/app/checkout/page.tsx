"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById, isEnquiryPrice } from "@/data/products";
import { brands } from "@/data/brands";
import { store } from "@/data/store";
import { formatInr, whatsappHref } from "@/lib/format";
import { useCart, type CheckoutPayload } from "@/components/cart/CartProvider";

export default function CheckoutPage() {
  const { lines, subtotal, deliveryFee, total, hasEnquiry, count, placeOrder } = useCart();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payment, setPayment] = useState<CheckoutPayload["payment"]>("cod");
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  if (!lines.length) {
    return (
      <div className="page checkout-page-wrap">
        <div className="shell empty-checkout-card">
          <div className="empty-checkout-icon">🛍️</div>
          <h1 className="empty-checkout-title">Your shopping bag is empty</h1>
          <p className="empty-checkout-desc">
            Explore our curated catalog of authentic salon cosmetics, premium fragrances, and skincare.
          </p>
          <Link className="btn checkout-btn-accent" href="/shop">
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  if (hasEnquiry) {
    return (
      <div className="page checkout-page-wrap">
        <div className="shell empty-checkout-card">
          <div className="empty-checkout-icon">💬</div>
          <h1 className="empty-checkout-title">Price Quote Confirmation Needed</h1>
          <p className="empty-checkout-desc">
            One or more items in your bag are marked as &ldquo;Contact for Price&rdquo;. Please confirm the quote with our store concierge on WhatsApp before placing a direct checkout.
          </p>
          <Link className="btn checkout-btn-accent" href="/cart">
            Return to Shopping Bag
          </Link>
        </div>
      </div>
    );
  }

  const freeDeliveryThreshold = store.freeDeliveryOver ?? 799;
  const currentSubtotal = subtotal ?? 0;
  const qualifiesForFreeDelivery = currentSubtotal >= freeDeliveryThreshold;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - currentSubtotal);
  const deliveryProgressPercent = Math.min(100, Math.round((currentSubtotal / freeDeliveryThreshold) * 100));

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
        city: String(data.get("city") ?? store.city ?? "Pali").trim(),
        state: String(data.get("state") ?? store.state ?? "Rajasthan").trim(),
        pincode: String(data.get("pincode") ?? store.pincode ?? "306401").trim(),
        payment,
        notes: String(data.get("notes") ?? "").trim() || undefined,
      };

      if (!payload.name) {
        setError("Please enter your full name.");
        setIsSubmitting(false);
        return;
      }

      const cleanMobile = payload.mobile.replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
        setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
        setIsSubmitting(false);
        return;
      }
      payload.mobile = cleanMobile;

      if (!payload.address || payload.address.length < 5) {
        setError("Please provide a complete street or house delivery address in Pali.");
        setIsSubmitting(false);
        return;
      }

      if (!payload.city) {
        setError("Please enter delivery city (e.g. Pali).");
        setIsSubmitting(false);
        return;
      }

      if (!/^\d{6}$/.test(payload.pincode)) {
        setError("Please enter a valid 6-digit postal pincode (e.g. 306401).");
        setIsSubmitting(false);
        return;
      }

      const result = await placeOrder(payload);
      if ("error" in result) {
        setError(result.error);
        setIsSubmitting(false);
        return;
      }

      // Build automatic order summary message for Store Owner (+91 76899 56116)
      const orderLines = lines
        .map((line) => {
          const p = getProductById(line.productId);
          const name = p ? p.name : line.productId;
          const v = p?.variants?.find((vx) => vx.id === line.variantId);
          const variant = line.variantName ? ` (${line.variantName})` : "";
          const unitPrice = v?.price ?? p?.price;
          const priceStr = unitPrice != null ? formatInr(unitPrice * line.quantity) : "Contact for price";
          return `• ${name}${variant} × ${line.quantity} = ${priceStr}`;
        })
        .join("\n");

      const waOrderMsg = [
        `🛍️ *NEW ORDER — MAMA STORE PALI*`,
        `━━━━━━━━━━━━━━━━━━`,
        `*Order ID:* #${result.id.slice(0, 8).toUpperCase()}`,
        ``,
        `👤 *CUSTOMER DETAILS:*`,
        `• Name: ${payload.name}`,
        `• Phone: +91 ${payload.mobile}`,
        `• Address: ${payload.address}, ${payload.city} - ${payload.pincode}`,
        payload.email ? `• Email: ${payload.email}` : null,
        ``,
        `📦 *ORDERED PRODUCTS:*`,
        orderLines,
        ``,
        `💳 *PAYMENT:* ${payload.payment === "cod" ? "Pay on Delivery (Cash / UPI)" : "UPI Transfer"}`,
        `🚚 *DELIVERY:* ${qualifiesForFreeDelivery ? "FREE (Orders above ₹" + freeDeliveryThreshold + ")" : formatInr(deliveryFee)}`,
        `💰 *TOTAL AMOUNT:* ${total != null ? formatInr(total) : "To be confirmed"}`,
        payload.notes ? `\n📝 *CUSTOMER NOTE:* ${payload.notes}` : null,
        `━━━━━━━━━━━━━━━━━━`,
        `Please confirm stock and dispatch schedule in Pali!`,
      ]
        .filter(Boolean)
        .join("\n");

      const waUrl = whatsappHref(waOrderMsg);

      // Automatically dispatch to Owner WhatsApp (+91 76899 56116)
      if (typeof window !== "undefined") {
        try {
          window.open(waUrl, "_blank");
        } catch {
          // If popup is blocked by browser, order confirmation page provides immediate button
        }
      }

      router.push(`/order/${result.id}?dispatched=1`);
    } catch {
      setError("An unexpected error occurred while placing your order. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="page checkout-page-root">
      <div className="shell checkout-shell-max">
        {/* Luxury Stepper Breadcrumbs */}
        <nav className="checkout-stepper" aria-label="Checkout Progress">
          <Link href="/cart" className="checkout-step-link">
            <span className="step-circle step-done">✓</span>
            <span className="step-label">Bag</span>
          </Link>
          <span className="step-separator">›</span>
          <div className="checkout-step-item active">
            <span className="step-circle step-active">2</span>
            <span className="step-label">Delivery &amp; Payment</span>
          </div>
          <span className="step-separator">›</span>
          <div className="checkout-step-item">
            <span className="step-circle">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </nav>

        {/* Mobile Accordion Order Summary Header */}
        <div className="mobile-order-summary-bar">
          <button
            type="button"
            className="mobile-summary-toggle-btn"
            onClick={() => setShowMobileSummary((prev) => !prev)}
            aria-expanded={showMobileSummary}
          >
            <span className="mobile-summary-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>{showMobileSummary ? "Hide order summary" : `Show order summary (${count} items)`}</span>
              <span className={`mobile-toggle-chevron ${showMobileSummary ? "rotate" : ""}`}>▾</span>
            </span>
            <span className="mobile-summary-total">
              {total != null ? formatInr(total) : "—"}
            </span>
          </button>

          {showMobileSummary && (
            <div className="mobile-summary-expanded-drawer">
              <div className="mobile-summary-items">
                {lines.map((line) => {
                  const p = getProductById(line.productId);
                  if (!p) return null;
                  const brand = brands.find((b) => b.id === p.brandId);
                  return (
                    <div className="checkout-item-row" key={line.key}>
                      <div className="checkout-item-thumb-wrapper">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="checkout-item-thumb"
                          loading="lazy"
                        />
                        <span className="checkout-item-qty-tag">{line.quantity}</span>
                      </div>
                      <div className="checkout-item-details">
                        <span className="checkout-item-brand">{brand?.name ?? "Mama Store"}</span>
                        <h4 className="checkout-item-name">{p.name}</h4>
                        {line.variantName ? (
                          <span className="checkout-item-variant">{line.variantName}</span>
                        ) : null}
                      </div>
                      <div className="checkout-item-price">
                        {isEnquiryPrice(p) ? "—" : formatInr((p.price as number) * line.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-bill-breakdown">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span>{subtotal != null ? formatInr(subtotal) : "—"}</span>
                </div>
                <div className="bill-row">
                  <span>Pali Express Delivery</span>
                  <span>
                    {qualifiesForFreeDelivery ? (
                      <span className="free-badge">FREE</span>
                    ) : (
                      formatInr(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="bill-row total-highlight">
                  <span>Grand Total</span>
                  <span className="total-amount">{total != null ? formatInr(total) : "—"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main 2-Column Responsive Checkout Grid */}
        <div className="checkout-main-grid">
          {/* Left Column: Checkout Form */}
          <div className="checkout-form-column">
            <div className="checkout-header-intro">
              <div className="checkout-eyebrow-tag">EXPRESS CHECKOUT · PALI ATELIER</div>
              <h1 className="checkout-main-title">Delivery &amp; Payment</h1>
              <p className="checkout-main-subtitle">
                Same-day doorstep delivery across Pali city with real-time stock reservation.
              </p>
            </div>

            <form className="checkout-form" onSubmit={onSubmit} noValidate>
              {/* Section 1: Customer Contact */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="card-step-badge">1</div>
                  <div>
                    <h2 className="card-section-title">Contact Information</h2>
                    <p className="card-section-desc">
                      We will send your order dispatch and WhatsApp tracking receipt here.
                    </p>
                  </div>
                </div>

                <div className="checkout-fields-stack">
                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="checkout-name">
                      Full Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="checkout-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Priya Sharma"
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="checkout-mobile">
                      Mobile Number <span className="req-star">*</span>
                      <span className="field-note-hint">WhatsApp enabled</span>
                    </label>
                    <div className="phone-prefix-wrapper">
                      <span className="phone-prefix-badge">
                        <span className="flag-icon">🇮🇳</span> +91
                      </span>
                      <input
                        id="checkout-mobile"
                        name="mobile"
                        type="tel"
                        required
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel"
                        placeholder="10-digit mobile (e.g. 98765 43210)"
                        className="checkout-phone-input"
                      />
                    </div>
                  </div>

                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="checkout-email">
                      Email Address <span className="optional-tag">Optional</span>
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="For digital invoice &amp; order updates"
                      className="checkout-text-input"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address in Pali */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="card-step-badge">2</div>
                  <div>
                    <h2 className="card-section-title">Delivery Address in Pali</h2>
                    <p className="card-section-desc">
                      Dispatched from Khanchachiyo Ka Bas, Pani Darwaja atelier within 2–4 hours.
                    </p>
                  </div>
                </div>

                <div className="pali-dispatch-banner">
                  <div className="dispatch-badge-icon">⚡</div>
                  <div className="dispatch-badge-text">
                    <strong>Pali Local Express:</strong> Orders placed before 7:00 PM are delivered the same evening with sealed authentic salon packaging.
                  </div>
                </div>

                <div className="checkout-fields-stack">
                  <div className="checkout-field-group">
                    <label className="checkout-field-label" htmlFor="checkout-address">
                      Street Address &amp; House / Flat No. <span className="req-star">*</span>
                    </label>
                    <textarea
                      id="checkout-address"
                      name="address"
                      required
                      rows={2}
                      autoComplete="street-address"
                      placeholder="House / Flat / Shop no., Colony / Mohalla, Landmark"
                      className="checkout-textarea-input"
                    />
                  </div>

                  <div className="checkout-row-3col">
                    <div className="checkout-field-group">
                      <label className="checkout-field-label" htmlFor="checkout-city">
                        City <span className="req-star">*</span>
                      </label>
                      <input
                        id="checkout-city"
                        name="city"
                        required
                        defaultValue={store.city ?? "Pali"}
                        autoComplete="address-level2"
                        className="checkout-text-input"
                      />
                    </div>

                    <div className="checkout-field-group">
                      <label className="checkout-field-label" htmlFor="checkout-state">
                        State <span className="req-star">*</span>
                      </label>
                      <input
                        id="checkout-state"
                        name="state"
                        required
                        defaultValue={store.state ?? "Rajasthan"}
                        autoComplete="address-level1"
                        className="checkout-text-input"
                      />
                    </div>

                    <div className="checkout-field-group">
                      <label className="checkout-field-label" htmlFor="checkout-pincode">
                        Pincode <span className="req-star">*</span>
                      </label>
                      <input
                        id="checkout-pincode"
                        name="pincode"
                        required
                        inputMode="numeric"
                        maxLength={6}
                        defaultValue={store.pincode ?? "306401"}
                        autoComplete="postal-code"
                        className="checkout-text-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="card-step-badge">3</div>
                  <div>
                    <h2 className="card-section-title">Payment Method</h2>
                    <p className="card-section-desc">
                      Safe, transparent payment with zero advance risk.
                    </p>
                  </div>
                </div>

                <div className="payment-options-grid">
                  <label
                    className={`payment-option-card ${payment === "cod" ? "selected" : ""}`}
                    onClick={() => setPayment("cod")}
                  >
                    <div className="payment-card-top">
                      <div className="custom-radio-orb">
                        {payment === "cod" && <div className="radio-dot" />}
                      </div>
                      <div className="payment-card-titles">
                        <div className="payment-title-row">
                          <span className="payment-option-name">Pay on Delivery</span>
                          <span className="payment-popular-pill">MOST POPULAR IN PALI</span>
                        </div>
                        <p className="payment-option-explainer">
                          Pay with Cash or scan QR with GPay / PhonePe / Paytm upon doorstep arrival.
                        </p>
                      </div>
                    </div>
                    <div className="payment-methods-strip">
                      <span className="pay-tag-chip">💵 Cash</span>
                      <span className="pay-tag-chip">📱 GPay</span>
                      <span className="pay-tag-chip">⚡ PhonePe</span>
                      <span className="pay-tag-chip">🏦 Paytm</span>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${payment === "upi" ? "selected" : ""}`}
                    onClick={() => setPayment("upi")}
                  >
                    <div className="payment-card-top">
                      <div className="custom-radio-orb">
                        {payment === "upi" && <div className="radio-dot" />}
                      </div>
                      <div className="payment-card-titles">
                        <div className="payment-title-row">
                          <span className="payment-option-name">UPI Pre-payment via WhatsApp</span>
                          <span className="payment-secure-pill">DIRECT ATELIER</span>
                        </div>
                        <p className="payment-option-explainer">
                          The store concierge will send the verified UPI QR code on WhatsApp once stock is boxed.
                        </p>
                      </div>
                    </div>
                    <div className="payment-methods-strip">
                      <span className="pay-tag-chip">💬 WhatsApp Concierge</span>
                      <span className="pay-tag-chip">🔒 100% Verified</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Section 4: Order Note / Instructions */}
              <div className="checkout-card">
                <div className="checkout-card-header">
                  <div className="card-step-badge">4</div>
                  <div>
                    <h2 className="card-section-title">Delivery Instructions (Optional)</h2>
                    <p className="card-section-desc">
                      Add landmark directions, preferred delivery time, or shade notes.
                    </p>
                  </div>
                </div>

                <div className="checkout-fields-stack">
                  <div className="checkout-field-group">
                    <textarea
                      id="checkout-notes"
                      name="notes"
                      rows={2}
                      placeholder="e.g. Near Jain Temple, call before arriving, deliver after 5 PM, shade confirmation…"
                      className="checkout-textarea-input"
                    />
                  </div>
                </div>
              </div>

              {/* Error Notice */}
              {error ? (
                <div className="checkout-alert-box" role="alert">
                  <div className="alert-box-icon">⚠️</div>
                  <div className="alert-box-text">{error}</div>
                </div>
              ) : null}

              {/* Place Order CTA Section */}
              <div className="checkout-action-card">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="checkout-submit-btn"
                >
                  <span className="btn-lock-icon">🔒</span>
                  <span className="btn-main-text">
                    {isSubmitting
                      ? "Reserving Stock & Placing Order…"
                      : `Place Order via WhatsApp Concierge · ${total != null ? formatInr(total) : ""}`}
                  </span>
                  <span className="btn-arrow-icon">→</span>
                </button>

                <p className="checkout-guarantee-note">
                  ✓ Instant order dispatch is automatically transmitted to store owner WhatsApp (<strong>+91 76899 56116</strong>). No credit card required.
                </p>

                <div className="checkout-trust-row">
                  <div className="trust-item">
                    <span className="trust-icon">🛡️</span>
                    <span>100% Genuine Salon Stock</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-icon">🛵</span>
                    <span>Pali Same-Day Dispatch</span>
                  </div>
                  <div className="trust-item">
                    <span className="trust-icon">💬</span>
                    <span>Direct Concierge Support</span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-card">
              <div className="summary-header">
                <div>
                  <h3 className="summary-title">Order Summary</h3>
                  <span className="summary-item-count">{count} {count === 1 ? "item" : "items"}</span>
                </div>
                <Link href="/cart" className="summary-edit-link">
                  Edit Bag
                </Link>
              </div>

              {/* Free Delivery Meter */}
              <div className="free-shipping-card">
                <div className="free-shipping-header">
                  {qualifiesForFreeDelivery ? (
                    <span className="shipping-text unlocked">
                      🎉 <strong>Free Pali Delivery Unlocked!</strong>
                    </span>
                  ) : (
                    <span className="shipping-text">
                      Add <strong>{formatInr(amountToFreeDelivery)}</strong> more for <strong>FREE Delivery</strong>
                    </span>
                  )}
                  <span className="shipping-target">Threshold: ₹{freeDeliveryThreshold}</span>
                </div>
                <div className="shipping-meter-track">
                  <div
                    className={`shipping-meter-fill ${qualifiesForFreeDelivery ? "full" : ""}`}
                    style={{ width: `${deliveryProgressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="summary-items-scroll">
                {lines.map((line) => {
                  const p = getProductById(line.productId);
                  if (!p) return null;
                  const brand = brands.find((b) => b.id === p.brandId);
                  return (
                    <div className="checkout-item-row" key={line.key}>
                      <div className="checkout-item-thumb-wrapper">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="checkout-item-thumb"
                          loading="lazy"
                        />
                        <span className="checkout-item-qty-tag">{line.quantity}</span>
                      </div>
                      <div className="checkout-item-details">
                        <span className="checkout-item-brand">{brand?.name ?? "Mama Store"}</span>
                        <h4 className="checkout-item-name">{p.name}</h4>
                        {line.variantName ? (
                          <span className="checkout-item-variant">{line.variantName}</span>
                        ) : null}
                      </div>
                      <div className="checkout-item-price">
                        {isEnquiryPrice(p) ? "—" : formatInr((p.price as number) * line.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="checkout-bill-breakdown">
                <div className="bill-row">
                  <span>Subtotal</span>
                  <span className="bill-val">{subtotal != null ? formatInr(subtotal) : "—"}</span>
                </div>
                <div className="bill-row">
                  <span>
                    Pali City Delivery
                    <span className="bill-sub-hint"> (Local 2–4 hr express)</span>
                  </span>
                  <span className="bill-val">
                    {qualifiesForFreeDelivery ? (
                      <span className="free-badge">FREE</span>
                    ) : (
                      formatInr(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="bill-divider" />
                <div className="bill-row total-highlight">
                  <div>
                    <span className="total-label">Total Amount</span>
                    <span className="total-taxes-note">Inclusive of all local taxes</span>
                  </div>
                  <div className="total-amount-box">
                    <span className="total-amount">{total != null ? formatInr(total) : "—"}</span>
                  </div>
                </div>
              </div>

              {/* Security & Authenticity Badges */}
              <div className="checkout-perks-box">
                <div className="perk-line">
                  <span className="perk-check">✓</span>
                  <span>100% Authentic products sourced from verified salon distributors.</span>
                </div>
                <div className="perk-line">
                  <span className="perk-check">✓</span>
                  <span>Same-day Pali local courier with inspection upon delivery.</span>
                </div>
                <div className="perk-line">
                  <span className="perk-check">✓</span>
                  <span>Owner assistance: <strong>+91 76899 56116</strong></span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
