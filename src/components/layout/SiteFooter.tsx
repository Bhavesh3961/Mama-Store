import Link from "next/link";
import { store } from "@/data/store";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div>
          <p className="logo">
            <strong>{store.name}</strong>
          </p>
          <p className="small" style={{ marginTop: 8 }}>
            Cosmetics and beauty essentials in {store.city}. Browse without an account. City delivery available.
          </p>
          <p className="small" style={{ marginTop: 10 }}>
            {store.address}
          </p>
        </div>
        <nav aria-label="Shop">
          <p className="eyebrow">Shop</p>
          <p>
            <Link href="/shop">All products</Link>
          </p>
          <p>
            <Link href="/categories">Categories</Link>
          </p>
          <p>
            <Link href="/brands">Brands</Link>
          </p>
          <p>
            <Link href="/offers">Offers</Link>
          </p>
        </nav>
        <nav aria-label="Store">
          <p className="eyebrow">Store</p>
          <p>
            <Link href="/store">Location</Link>
          </p>
          <p>
            <Link href="/contact">Contact</Link>
          </p>
          <p>
            <Link href="/account">Account</Link>
          </p>
          <p>
            <a href={store.mapsUrl} target="_blank" rel="noreferrer">
              Get directions
            </a>
          </p>
        </nav>
      </div>
      <div className="shell small" style={{ marginTop: 22, color: "var(--muted)" }}>
        <p>© {new Date().getFullYear()} {store.name} Pali. All rights reserved. 100% Genuine Cosmetics & Fragrances.</p>
      </div>
    </footer>
  );
}
