"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {}
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/products", label: "Products", icon: "💄" },
    { href: "/admin/orders", label: "Orders", icon: "📦" },
    { href: "/admin/categories", label: "Categories", icon: "🏷️" },
  ];

  return (
    <aside className="adm-sidebar">
      <Link href="/admin" className="adm-brand">
        <span style={{ fontSize: "1.5rem" }}>✨</span>
        <div className="adm-brand-text">
          <div style={{ fontWeight: 700, letterSpacing: "0.05em", fontSize: "1rem" }}>
            MAMA STORE
          </div>
          <span className="adm-brand-badge">Control Panel</span>
        </div>
      </Link>

      <nav className="adm-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`adm-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="adm-nav-icon">{item.icon}</span>
              <span className="adm-nav-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="adm-footer-action">
        <div
          className="adm-nav-text"
          style={{
            fontSize: "0.8rem",
            color: "var(--adm-muted)",
            padding: "0 8px 6px",
          }}
        >
          Logged in as <strong style={{ color: "var(--adm-text)" }}>{username}</strong>
        </div>

        <Link
          href="/shop"
          target="_blank"
          rel="noreferrer"
          className="adm-btn-secondary"
          title="Open Customer Store"
        >
          <span>🛍️</span>
          <span className="adm-nav-text">View Storefront ↗</span>
        </Link>

        <button
          onClick={handleLogout}
          type="button"
          className="adm-btn-secondary"
          title="Sign out of Admin Panel"
        >
          <span>🚪</span>
          <span className="adm-nav-text">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
