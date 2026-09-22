import { SearchForm } from "@/components/search/SearchForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="page">
      <div className="shell">
        <p className="eyebrow">Find a product</p>
        <h1 style={{ fontSize: "2rem", margin: "6px 0 16px" }}>Search</h1>
        <SearchForm autofocus />
        <p className="muted small" style={{ marginTop: 16 }}>
          Search genuine cosmetics, skincare, fragrances, and haircare in Pali.
        </p>
      </div>
    </div>
  );
}
