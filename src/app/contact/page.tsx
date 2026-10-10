import type { Metadata } from "next";
import { store } from "@/data/store";
import { whatsappHref } from "@/lib/format";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="page">
      <div className="shell" style={{ maxWidth: 640 }}>
        <p className="eyebrow">Talk to the store</p>
        <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Contact</h1>
        <p>{store.address}</p>
        <p className="muted small" style={{ marginTop: 8 }}>
          {store.hours}
        </p>
        <p className="muted" style={{ marginTop: 12 }}>
          For product availability, pricing, or city delivery in Pali, message our store directly on WhatsApp.
        </p>
        <div className="actions-stack" style={{ marginTop: 18 }}>
          <a className="btn" href={whatsappHref(`Hello ${store.name}, I would like to enquire about a product.`)} target="_blank" rel="noreferrer">
            WhatsApp enquiry
          </a>
          <a className="btn secondary" href={store.mapsUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>
      </div>
    </div>
  );
}
