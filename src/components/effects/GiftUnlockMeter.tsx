"use client";

import React from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatInr } from "@/lib/format";

const TIERS = [
  { amount: 499, gift: "Rose Dew Face Mist (50ml)", icon: "🌹", tag: "₹499 Milestone" },
  { amount: 999, gift: "24K Gold Glow Lipstick", icon: "💄", tag: "₹999 Milestone" },
  { amount: 1499, gift: "Royal Velvet Perfume & Hamper", icon: "✨", tag: "₹1,499 Mega Gift" },
];

export function GiftUnlockMeter() {
  const { subtotal } = useCart();
  const currentTotal = subtotal || 0;

  // Determine active and next tier
  const highestUnlockedIndex = TIERS.reduce(
    (acc, tier, index) => (currentTotal >= tier.amount ? index : acc),
    -1
  );

  const nextTier = TIERS.find((tier) => currentTotal < tier.amount) || null;
  const neededForNext = nextTier ? nextTier.amount - currentTotal : 0;

  const maxAmount = 1499;
  const progressPercent = Math.min(100, Math.round((currentTotal / maxAmount) * 100));

  return (
    <div className="gift-meter-card">
      <div className="gift-meter-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="gift-meter-badge-pulse">🎁 GIFT PROMISE</span>
          <strong style={{ fontSize: "1.05rem" }}>
            More Purchasing = Guaranteed Free Gifts!
          </strong>
        </div>
        <div className="gift-meter-status">
          {nextTier ? (
            <span>
              Add <strong style={{ color: "var(--rose)" }}>{formatInr(neededForNext)}</strong> more to unlock <strong style={{ color: "#b85160" }}>{nextTier.gift}</strong>!
            </span>
          ) : (
            <span style={{ color: "#2c5a42", fontWeight: 700 }}>
              🎉 VIP STATUS! All 3 Free Gifts Unlocked for your order!
            </span>
          )}
        </div>
      </div>

      {/* Dynamic Liquid Progress Track */}
      <div className="gift-track-wrapper">
        <div
          className="gift-track-fill"
          style={{ width: `${progressPercent}%` }}
        >
          <span className="gift-shimmer-wave" />
        </div>

        {/* Milestone Milestones */}
        <div className="gift-milestones-row">
          {TIERS.map((tier, idx) => {
            const isUnlocked = currentTotal >= tier.amount;
            return (
              <div
                key={tier.amount}
                className={`milestone-node ${isUnlocked ? "unlocked" : ""}`}
                style={{ left: `${(tier.amount / maxAmount) * 100}%` }}
              >
                <div className="milestone-pin">
                  <span className="milestone-icon">{isUnlocked ? "✓" : tier.icon}</span>
                </div>
                <div className="milestone-tooltip">
                  <strong>{formatInr(tier.amount)}</strong>
                  <p className="small">{tier.gift}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="gift-meter-footer">
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
          <span className="gift-tag-pill">🔥 Wholesale & Retail Deals</span>
          <span className="gift-tag-pill">🚚 Free Pali City Delivery over ₹799</span>
          <span className="gift-tag-pill">🏷️ High Discount on Every Item</span>
        </div>
        <span className="cart-current-badge">
          Bag Total: <strong>{formatInr(currentTotal)}</strong>
        </span>
      </div>
    </div>
  );
}
