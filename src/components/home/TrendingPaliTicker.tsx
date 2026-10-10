"use client";

import React from "react";
import Link from "next/link";

const LIVE_PULSES = [
  { icon: "✨", text: "Pali Boutique Live: 18 clients ordered L'Oréal Serie Expert today" },
  { icon: "🌟", text: "Viral in Store: Milau 24K Gold Scrub Wash with micro-scrub particles" },
  { icon: "🚚", text: "Same-Day Dispatch: Orders in Pali delivered within 2 hours" },
  { icon: "🌿", text: "100% Verified: Direct salon-grade stock from authorized distributors" },
  { icon: "💬", text: "WhatsApp Ordering: Direct product ordering & same-day city delivery" },
];

export function TrendingPaliTicker() {
  return (
    <div className="trending-ticker-bar" aria-label="Live Store Announcements">
      <div className="shell trending-ticker-shell">
        <div className="ticker-live-badge">
          <span className="ticker-pulse-orb" />
          <span>PALI LIVE ATELIER</span>
        </div>

        <div className="ticker-marquee-track">
          <div className="ticker-content-loop">
            {LIVE_PULSES.concat(LIVE_PULSES).map((pulse, idx) => (
              <span key={idx} className="ticker-item">
                <span className="ticker-icon">{pulse.icon}</span>
                <span className="ticker-text">{pulse.text}</span>
                <span className="ticker-divider">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
