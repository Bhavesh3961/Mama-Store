import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products } from "@/data/products";
import { getDbProductBySlug } from "@/lib/db/queries";
import { mapDbProductToCatalog } from "@/lib/db/types";
import { brandOf } from "@/data/catalog";
import { ProductDetails } from "@/components/product/ProductDetails";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function resolveProduct(slug: string) {
  const dbRow = getDbProductBySlug(slug);
  if (dbRow) return mapDbProductToCatalog(dbRow);
  return getProductBySlug(slug);
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = resolveProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: `${brandOf(product)?.name ?? ""} — ${product.description}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = resolveProduct(slug);
  if (!product) notFound();
  return <ProductDetails product={product} />;
}
