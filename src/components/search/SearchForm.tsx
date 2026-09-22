"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchForm({ initial = "", autofocus = false }: { initial?: string; autofocus?: boolean }) {
  const [q, setQ] = useState(initial);
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <form onSubmit={onSubmit} role="search">
      <label className="search-field">
        <span className="sr-only">Search products</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, categories, brands"
          name="q"
          autoFocus={autofocus}
        />
      </label>
    </form>
  );
}
