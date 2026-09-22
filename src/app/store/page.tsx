import type { Metadata } from "next";
import { store } from "@/data/store";

export const metadata: Metadata = { title: "Store location" };

export default function StorePage() {
  return (
    <div className="page">
      <div className="shell store-panel">
        <div>
          <p className="eyebrow">Physical store</p>
          <h1 style={{ fontSize: "2rem" }}>{store.name}</h1>
          {store.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
          <p className="muted" style={{ marginTop: 10 }}>
            {store.hours}
          </p>
          <p className="muted small">{store.delivery}</p>
          <a className="btn" style={{ marginTop: 16 }} href={store.mapsUrl} target="_blank" rel="noreferrer">
            Get directions
          </a>
        </div>
        <iframe
          className="map-embed"
          title="Mama Store on Google Maps"
          src="https://maps.google.com/maps?q=Khanchachiyo%20Ka%20Bas%20Pani%20Darwaja%20Nadi%20Mohalla%20Pali%20Rajasthan%20306401&z=16&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
