import { store } from "@/data/store";

export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: store.name,
    description: store.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Khanchachiyo Ka Bas, Pani Darwaja, Nadi Mohalla",
      addressLocality: store.city,
      addressRegion: store.state,
      postalCode: store.pincode,
      addressCountry: "IN",
    },
    hasMap: store.mapsUrl,
    areaServed: store.city,
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
