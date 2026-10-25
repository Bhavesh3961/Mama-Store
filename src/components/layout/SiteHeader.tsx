"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { store } from "@/data/store";
import { useCart } from "@/components/cart/CartProvider";
import { MamaLogo } from "@/components/brand/MamaLogo";
import { TrendingPaliTicker } from "@/components/home/TrendingPaliTicker";
import { whatsappHref } from "@/lib/format";

export function SiteHeader() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  const navLinks = [
    { href: "/shop", label: "All Products" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "All Brands" },
  ];

  return (
    <div className="site-header-container">
      <TrendingPaliTicker />
      <header className={`site-header-wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="shell header-liquid-glass-pill">
          {/* Left: Brand Logo in Glass Pill */}
          <Link href="/" className="glass-logo-pill" aria-label={`${store.name} home`}>
            <MamaLogo />
          </Link>

          {/* Center: Navigation Glass Pills */}
          <nav className="glass-nav-pills" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  className={`glass-nav-item ${isActive ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* WhatsApp Direct Action Pill */}
            <a
              href={whatsappHref("Hello Mama Store, I would like to place an order.")}
              target="_blank"
              rel="noreferrer"
              className="glass-wa-circle-btn"
              title="Order directly on WhatsApp (+91 76899 56116)"
              aria-label="Order on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </nav>

        {/* Right Center: Embedded Pill Search */}
        <form className="glass-search-form" onSubmit={onSearch} role="search">
          <div className="glass-search-pill">
            <SearchIcon />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands..."
              name="q"
              aria-label="Search products"
            />
          </div>
        </form>

        {/* Right: Round Action Glass Buttons */}
        <div className="glass-action-pills">
          <a
            className="glass-icon-btn"
            href="tel:+918949549324"
            aria-label="Call Pali Shop: +91 89495 49324"
            title="Call Shop: +91 89495 49324"
          >
            <PhoneIcon />
          </a>

          <Link
            className="glass-icon-btn mobile-search-btn"
            href="/search"
            aria-label="Search"
            title="Search"
          >
            <SearchIcon />
          </Link>

          <Link
            className="glass-icon-btn desktop-only"
            href="/account"
            aria-label="Account"
            aria-current={pathname === "/account" ? "page" : undefined}
            title="My Account"
          >
            <UserIcon />
          </Link>

          <Link
            className={`glass-icon-btn cart-glass-btn ${count > 0 ? "has-items" : ""}`}
            href="/cart"
            aria-label={`Bag, ${count} items`}
            title="Shopping Bag"
          >
            <BagIcon />
            {count > 0 ? <span className="glass-cart-badge">{count}</span> : null}
          </Link>
        </div>
      </div>
    </header>
  </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"
        fill="#ffffff"
      />
      <path
        d="M12.004 2c-5.514 0-10 4.486-10 10 0 1.76.457 3.473 1.325 4.981L2 22l5.168-1.32C8.611 21.523 10.288 22 12.004 22c5.514 0 10-4.486 10-10s-4.486-10-10-10zm0 18.2c-1.558 0-3.084-.413-4.422-1.196l-.317-.186-3.284.838.852-3.203-.205-.326A8.163 8.163 0 0 1 3.804 12c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.2-8.2 8.2z"
        fill="#ffffff"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16.5 20 20.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 19c1.4-3.2 3.8-4.8 7-4.8s5.6 1.6 7 4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.5 8.5h11l-.8 11H7.3l-.8-11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

