"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

const items = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/search", label: "Search", match: (p: string) => p === "/search" },
  { href: "/categories", label: "Categories", match: (p: string) => p.startsWith("/categories") || p.startsWith("/shop") },
  { href: "/cart", label: "Cart", match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  { href: "/account", label: "Account", match: (p: string) => p.startsWith("/account") },
];

export function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={item.match(pathname) ? "active" : undefined}>
          {item.label}
          {item.href === "/cart" && count > 0 ? ` (${count})` : ""}
        </Link>
      ))}
    </nav>
  );
}
