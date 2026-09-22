import { store } from "@/data/store";
import type { Product } from "@/data/products";
import { brandOf } from "@/data/catalog";

export function formatInr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappHref(message: string) {
  const text = encodeURIComponent(message);
  if (store.whatsappNumber) {
    return `https://wa.me/${store.whatsappNumber}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
}

export function productWhatsappMessage(product: Product, variantName?: string) {
  const brand = brandOf(product)?.name ?? "";
  const variant = variantName ? `Shade/variant: ${variantName}\n` : "";
  const price =
    product.price == null ? "Price: please quote" : `Listed sample price: ₹${product.price}`;
  return `Hello Mama Store,\nI would like to enquire / order:\n${brand} — ${product.name}\n${variant}${price}\n(Sample catalogue listing)`;
}

export function cartWhatsappMessage(lines: string, totalLabel: string) {
  return `Hello Mama Store,\nI would like to place an order:\n${lines}\n${totalLabel}\nPlease confirm availability and delivery in Pali.`;
}
