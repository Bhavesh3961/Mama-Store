"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductById, isEnquiryPrice, type Product } from "@/data/products";
import { store } from "@/data/store";

export type CartLine = {
  key: string;
  productId: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
};

export type CheckoutPayload = {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state?: string;
  pincode: string;
  payment: "cod" | "upi";
  notes?: string;
};

export type PlacedOrder = {
  id: string;
  placedAt: string;
  payload: CheckoutPayload;
  lines: (CartLine & { name: string; unitPrice: number | null })[];
  deliveryFee: number;
  subtotal: number | null;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Product, qty?: number, variant?: { id: string; name: string }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: number;
  subtotal: number | null;
  hasEnquiry: boolean;
  deliveryFee: number;
  total: number | null;
  lastOrder: PlacedOrder | null;
  placeOrder: (payload: CheckoutPayload) => Promise<PlacedOrder | { error: string }>;
};

const CartContext = createContext<CartContextValue | null>(null);

function lineKey(productId: string, variantId?: string) {
  return variantId ? `${productId}:${variantId}` : productId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [lastOrder, setLastOrder] = useState<PlacedOrder | null>(null);

  const add = useCallback((product: Product, qty = 1, variant?: { id: string; name: string }) => {
    if (!product.inStock) return;
    if (product.variants?.length && !variant) return;
    if (variant && product.variants?.some((v) => v.id === variant.id && !v.inStock)) return;
    const key = lineKey(product.id, variant?.id);
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) => (l.key === key ? { ...l, quantity: l.quantity + qty } : l));
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          variantId: variant?.id,
          variantName: variant?.name,
          quantity: qty,
        },
      ];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.key !== key);
      return prev.map((l) => (l.key === key ? { ...l, quantity: qty } : l));
    });
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const resolved = useMemo(() => {
    return lines.map((line) => {
      const product = getProductById(line.productId);
      return { line, product };
    });
  }, [lines]);

  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const hasEnquiry = resolved.some(({ product }) => product && isEnquiryPrice(product));
  const priced = resolved.filter(({ product }) => product && product.price != null);
  const subtotal = hasEnquiry
    ? null
    : priced.reduce((sum, { line, product }) => sum + (product!.price as number) * line.quantity, 0);

  const deliveryFee =
    subtotal == null ? store.deliveryFee : subtotal >= store.freeDeliveryOver ? 0 : store.deliveryFee;
  const total = subtotal == null ? null : subtotal + deliveryFee;

  const placeOrder = useCallback(
    async (payload: CheckoutPayload): Promise<PlacedOrder | { error: string }> => {
      if (!lines.length) return { error: "Your bag is empty." };

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: payload.name,
            phone: payload.mobile,
            email: payload.email,
            address: payload.address,
            city: payload.city,
            state: payload.state || "Rajasthan",
            pincode: payload.pincode,
            payment: payload.payment,
            notes: payload.notes,
            items: lines.map((l) => ({
              productId: l.productId,
              variantId: l.variantId,
              variantName: l.variantName,
              quantity: l.quantity,
            })),
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return { error: data.error || "Failed to place order. Please try again." };
        }

        const built = lines.map((line) => {
          const product = getProductById(line.productId);
          return {
            ...line,
            name: product
              ? `${product.name}${line.variantName ? ` · ${line.variantName}` : ""}`
              : "Product",
            unitPrice: product?.price ?? null,
          };
        });

        const order: PlacedOrder = {
          id: data.order.id,
          placedAt: new Date().toISOString(),
          payload,
          lines: built,
          deliveryFee: data.order.deliveryFee,
          subtotal: data.order.subtotal,
        };

        setLastOrder(order);
        setLines([]);
        return order;
      } catch (err: unknown) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Network error occurred while placing your order.",
        };
      }
    },
    [lines]
  );

  const value = useMemo(
    () => ({
      lines,
      add,
      setQty,
      remove,
      clear,
      count,
      subtotal,
      hasEnquiry,
      deliveryFee,
      total,
      lastOrder,
      placeOrder,
    }),
    [add, clear, count, deliveryFee, hasEnquiry, lastOrder, lines, placeOrder, remove, setQty, subtotal, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
