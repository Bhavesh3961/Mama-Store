import Link from "next/link";
import type { Metadata } from "next";
import { offers } from "@/data/offers";
import { whatsappHref } from "@/lib/format";
import { store } from "@/data/store";

export const metadata: Metadata = {
  title: "Special Offers & Discounts · Mama Store Pali",
  description: "Explore the best deals on famous cosmetic brands in Pali. Up to 50% discount and guaranteed free gifts on higher purchases.",
};

export default function OffersPage() {
  return (
    <div className="page page-theme-offers">
      <div className="shell">
        <div style={{ marginBottom: 28 }}>
          <span className="badge-luxury gold">🔥 SAVE MORE</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", marginTop: 8 }}>
            Special Offers & Festival Deals
          </h1>
          <p className="muted" style={{ maxWidth: 620, marginTop: 6, fontSize: "1.05rem" }}>
            High discounts on top brands + guaranteed free gifts when you buy more. Available in store and for Pali city delivery.
          </p>
        </div>

        {/* Gift Promise Reminder Box */}
        <div className="gift-promise-banner" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: "2.2rem" }}>🎁</span>
            <div>
              <strong style={{ fontSize: "1.1rem" }}>Mama Store Free Gift Promise</strong>
              <p className="small muted" style={{ marginTop: 2 }}>
                Orders over <strong>₹499</strong> get a Free Rose Face Mist | Orders over <strong>₹999</strong> get a Free Gold Lipstick | Orders over <strong>₹1,499</strong> get a Luxury Perfume Hamper!
              </p>
            </div>
          </div>
          <Link href="/shop" className="btn btn-luxury-primary">
            Start Shopping
          </Link>
        </div>

        {/* Offers Grid */}
        <div className="offers-grid-modern">
          {offers.map((o) => (
            <div key={o.id} className="offer-card-modern">
              <div className="offer-card-header">
                <span className={o.kind === "festival" ? "badge-luxury gold" : "badge-luxury"}>
                  {o.badge}
                </span>
                <span className="discount-callout-pill">{o.discount}</span>
              </div>
              <h2 style={{ fontSize: "1.45rem", margin: "14px 0 8px" }}>{o.title}</h2>
              <p className="small muted" style={{ lineHeight: 1.6, flex: 1 }}>{o.summary}</p>

              <div className="offer-action-row" style={{ marginTop: 20 }}>
                <Link href={`/offers/${o.slug}`} className="btn btn-luxury-primary" style={{ flex: 1 }}>
                  View Eligible Products
                </Link>
                <a
                  className="btn btn-luxury-wa"
                  href={whatsappHref(`Hello ${store.name}, I would like to claim the offer: ${o.title}.`)}
                  target="_blank"
                  rel="noreferrer"
                  title="Claim on WhatsApp"
                >
                  Claim on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
