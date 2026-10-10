"use client";

import Link from "next/link";

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  tone: string;
};

const CATEGORY_GRAPHICS: Record<
  string,
  { icon: React.ReactNode; tag: string; image: string; accentColor: string }
> = {
  skincare: {
    tag: "CLINICAL & DEWY",
    image: "/mamaearth-rice-dew-facewash.jpg",
    accentColor: "#dfb56c",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2.5v19M7 7.5c0 5 10 5 10 0M5 14.5c0 4.5 14 4.5 14 0" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
      </svg>
    ),
  },
  makeup: {
    tag: "COUTURE COLOUR",
    image: "/products/maybelline-superstay-matte-ink.jpg",
    accentColor: "#f472b6",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="7" y="10" width="10" height="11" rx="2" strokeLinecap="round" />
        <path d="M9 10V5.5L15 3.5V10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="15.5" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  hair: {
    tag: "SALON RESTORATIVE",
    image: "/products/loreal-absolut-repair.png",
    accentColor: "#fbbf24",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3c-4 0-7 3-7 7v11h14V10c0-4-3-7-7-7Z" strokeLinecap="round" />
        <path d="M9 14c1.5 2 4.5 2 6 0" strokeLinecap="round" />
      </svg>
    ),
  },
  "bath-body": {
    tag: "SPA SCRUB & 24K GOLD",
    image: "/products/milau-24k-gold-wash.webp",
    accentColor: "#34d399",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="10" r="5" strokeLinecap="round" />
        <path d="M12 15v6M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  fragrance: {
    tag: "HAUTE PARFUM & OUD",
    image: "/products/bellavita-honey-oud.jpg",
    accentColor: "#c084fc",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polygon points="12,3 17,8 17,19 7,19 7,8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="10" y="3" width="4" height="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
  "mens-grooming": {
    tag: "RE-ENERGIZING CARE",
    image: "/products/milau-mens-face-body-wash.webp",
    accentColor: "#38bdf8",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 5h12M8 5v14M16 5v14M8 12h8" strokeLinecap="round" />
      </svg>
    ),
  },
  combos: {
    tag: "CURATED VANITY SETS",
    image: "/mamaearth-rice-dewy-bright.jpg",
    accentColor: "#f43f5e",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="10" width="18" height="11" rx="2" strokeLinecap="round" />
        <path d="M12 10v11M3 14h18" strokeLinecap="round" />
        <path d="M7.5 10C6 8 6 5 8 5c2 0 4 3 4 5M16.5 10C18 8 18 5 16 5c-2 0-4 3-4 5" strokeLinecap="round" />
      </svg>
    ),
  },
};

export function LuxuryCategoryGrid({ categories }: { categories: CategoryItem[] }) {
  return (
    <div className="lux-category-grid">
      {categories.map((c, index) => {
        const meta = CATEGORY_GRAPHICS[c.slug] || CATEGORY_GRAPHICS.skincare;
        return (
          <Link
            key={c.id}
            href={`/shop?category=${c.slug}`}
            className="lux-category-card-editorial"
          >
            {/* Full-bleed photography background */}
            <div
              className="lux-cat-photo"
              style={{ backgroundImage: `url(${meta.image})` }}
            />

            {/* Dark luxury vignette gradient */}
            <div className="lux-cat-vignette" />

            {/* Header: Metallic number & Frosted badge */}
            <div className="lux-cat-header-editorial">
              <span className="lux-cat-num-gold">0{index + 1}</span>
              <span className="lux-cat-glass-badge">{meta.tag}</span>
            </div>

            {/* Content: Icon, Title, Description */}
            <div className="lux-cat-body-editorial">
              <div className="lux-cat-icon-pill" style={{ color: meta.accentColor }}>
                {meta.icon}
              </div>
              <h3 className="lux-cat-title-editorial">{c.name}</h3>
              <p className="lux-cat-desc-editorial">{c.description}</p>
            </div>

            {/* Footer: Metallic Gold Action CTA Button */}
            <div className="lux-cat-footer-editorial">
              <span className="lux-cat-btn-gold">
                <span>Explore Department</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

