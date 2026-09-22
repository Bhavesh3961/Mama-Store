import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOffer } from "@/data/offers";
import { offerProducts } from "@/data/catalog";
import { ProductGrid } from "@/components/product/ProductCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const offer = getOffer(slug);
  return { title: offer?.title ?? "Offer" };
}

export default async function OfferDetailPage({ params }: Props) {
  const { slug } = await params;
  const offer = getOffer(slug);
  if (!offer) notFound();
  const products = offerProducts(offer.id);

  return (
    <div className="page">
      <div className="shell">
        <span className={offer.kind === "festival" ? "badge gold" : "badge"}>{offer.badge}</span>
        <h1 style={{ fontSize: "2rem", margin: "10px 0 8px" }}>{offer.title}</h1>
        <p className="muted" style={{ marginBottom: 20 }}>
          {offer.summary}
        </p>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
