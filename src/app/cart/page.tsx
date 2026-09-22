import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review items in your shopping bag and complete your order.",
};

export default function CartPage() {
  return <CartView />;
}
