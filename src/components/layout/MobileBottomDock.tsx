"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";

export function MobileBottomDock() {
  const pathname = usePathname();
  const { count } = useCart();

  const items = [
    {
      href: "/",
      label: "Home",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      active: pathname === "/",
    },
    {
      href: "/shop",
      label: "Shop",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      active: pathname === "/shop" || pathname.startsWith("/product"),
    },
    {
      href: "/categories",
      label: "Rituals",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 4.24 4.24" />
          <path d="m14.83 9.17 4.24-4.24" />
          <path d="m14.83 14.83 4.24 4.24" />
          <path d="m9.17 14.83-4.24 4.24" />
        </svg>
      ),
      active: pathname === "/categories",
    },
    {
      href: "/brands",
      label: "Brands",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
          <line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
      ),
      active: pathname.startsWith("/brands"),
    },
    {
      href: "/cart",
      label: "Bag",
      icon: (
        <div style={{ position: "relative" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {count > 0 && <span className="mobile-dock-badge">{count}</span>}
        </div>
      ),
      active: pathname === "/cart",
    },
  ];

  return (
    <nav className="mobile-bottom-dock" aria-label="Mobile Navigation">
      <div className="mobile-dock-pill">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-dock-btn ${item.active ? "active" : ""}`}
            aria-current={item.active ? "page" : undefined}
          >
            <span className="dock-icon-wrap">{item.icon}</span>
            <span className="dock-label">{item.label}</span>
            {item.active && <span className="dock-active-dot" />}
          </Link>
        ))}
      </div>
    </nav>
  );
}
