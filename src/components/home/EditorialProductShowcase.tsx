"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { products, Product } from "@/data/products";
import { categoryOf } from "@/data/catalog";

// Find the luxury featured products
const lorealAbsolut = products.find((p) => p.id === "p-loreal-absolut-repair") ?? products[0];
const mamaRiceFacewash = products.find((p) => p.id === "p-mamaearth-rice-facewash") ?? products[1];
const milauGold = products.find((p) => p.id === "p-milau-24k-gold-wash") ?? products[2];
const minimalistVitC = products.find((p) => p.id === "p-minimalist-vitc") ?? products[3];

const EDITORIAL_SELECTIONS: {
  product: Product;
  subtitle: string;
  benefit: string;
  accentBg: string;
  accentColor: string;
  layoutAlignment: "left" | "right";
}[] = [
  {
    product: lorealAbsolut,
    subtitle: "PARIS SALON · ICON 01",
    benefit: "Gold Quinoa & Protein repair technology that instantly resurfaces damaged hair, cutting damage by 77% with salon-grade silkiness.",
    accentBg: "linear-gradient(145deg, #FCF8EE 0%, #F8ECCD 50%, #F2DE9E 100%)",
    accentColor: "#B58428",
    layoutAlignment: "left",
  },
  {
    product: mamaRiceFacewash,
    subtitle: "GLASS SKIN · PICK 02",
    benefit: "Korean Fermented Rice Water & Niacinamide formula cleanses without drying, awakening instant dewy glass skin brilliance.",
    accentBg: "linear-gradient(145deg, #FAF5EE 0%, #F2E8DC 50%, #E8DAC8 100%)",
    accentColor: "#9C6A37",
    layoutAlignment: "right",
  },
  {
    product: milauGold,
    subtitle: "SALON SCRUB · PICK 03",
    benefit: "24K Gold shimmer particles and natural scrub beads buff away sun tan, stimulate collagen, and leave an illuminated full-body glow.",
    accentBg: "linear-gradient(145deg, #FDF9EE 0%, #F8EBCE 50%, #F2DC9E 100%)",
    accentColor: "#C9911C",
    layoutAlignment: "left",
  },
  {
    product: minimalistVitC,
    subtitle: "ACTIVE SCIENCE · PICK 04",
    benefit: "Stable 10% Ethyl Ascorbic Acid with Centella Water & Acetyl Glucosamine fades dark spots and evens skin tone with clinical precision.",
    accentBg: "linear-gradient(145deg, #F8F6F4 0%, #EDE8E3 50%, #DDD5CD 100%)",
    accentColor: "#3B3532",
    layoutAlignment: "right",
  },
];

export function EditorialProductShowcase() {
  const { add } = useCart();
  const [liveProducts, setLiveProducts] = React.useState(products);

  React.useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.products) && data.products.length) {
          setLiveProducts(data.products);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="editorial-showcase-section shell" aria-label="Featured Products">
      <div className="editorial-showcase-header">
        <motion.span
          className="editorial-kicker"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          CURATED ATELIER EDIT
        </motion.span>
        <motion.h2
          className="editorial-showcase-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Signature formulations our clients adore.
        </motion.h2>
      </div>

      <div className="editorial-showcase-list">
        {EDITORIAL_SELECTIONS.map((item, idx) => {
          const p = liveProducts.find((x) => x.id === item.product.id) || item.product;
          const isRight = item.layoutAlignment === "right";

          return (
            <motion.article
              key={p.id}
              className={`editorial-item-row ${isRight ? "row-reverse" : ""}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
            >
              {/* Product Image Frame */}
              <div className="editorial-image-frame" style={{ background: item.accentBg }}>
                <div className="editorial-image-inner">
                  <motion.div
                    className="editorial-showcase-photo-wrap"
                    whileHover={{ scale: 1.05, rotate: isRight ? -1.5 : 1.5 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={300}
                      height={360}
                      className="editorial-showcase-photo"
                      style={{
                        objectFit: "contain",
                        padding: "20px",
                        borderRadius: 24,
                        background: "rgba(255, 255, 255, 0.72)",
                        backdropFilter: "blur(14px)",
                      }}
                    />
                    <div className="editorial-photo-glass-overlay">
                      <span className="photo-brand-tag">MAMA STORE</span>
                    </div>
                  </motion.div>
                </div>
                <span className="editorial-frame-number">0{idx + 1}</span>
              </div>

              {/* Product Info */}
              <div className="editorial-copy-block">
                <span className="editorial-sub-kicker" style={{ color: item.accentColor }}>
                  {item.subtitle}
                </span>
                <h3 className="editorial-product-name">{p.name}</h3>
                <p className="editorial-product-desc">{p.description}</p>

                <div className="editorial-ritual-box" style={{ borderColor: `${item.accentColor}33`, background: `${item.accentBg}` }}>
                  <strong style={{ color: item.accentColor }}>Why you'll love it</strong>
                  <p>{item.benefit}</p>
                </div>

                <div className="editorial-price-action">
                  <div className="editorial-price-tag">
                    <span className="price-label">Price</span>
                    <span className="price-amount">₹{p.price ? p.price.toLocaleString("en-IN") : "Contact Us"}</span>
                    {p.mrp && p.price && p.mrp > p.price && (
                      <span className="price-mrp">MRP ₹{p.mrp}</span>
                    )}
                  </div>

                  <div className="editorial-action-btns">
                    <button
                      onClick={() => add(p)}
                      className="btn-editorial-primary"
                      style={{ backgroundColor: item.accentColor }}
                    >
                      Add to Cart
                    </button>
                    <Link href={`/product/${p.slug}`} className="btn-editorial-secondary">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
