"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { products, Product } from "@/data/products";
import { categoryOf } from "@/data/catalog";

// Find the 3 specific products requested
const drRashelSerum = products.find((p) => p.id === "p-drrashel-vitc-serum")!;
const mamaRiceFacewash = products.find((p) => p.id === "p-mamaearth-rice-facewash")!;
const dermacoSalicylic = products.find((p) => p.id === "p-dermaco-salicylic-facewash")!;

const EDITORIAL_SELECTIONS: {
  product: Product;
  subtitle: string;
  benefit: string;
  accentBg: string;
  accentColor: string;
  layoutAlignment: "left" | "right";
}[] = [
  {
    product: drRashelSerum,
    subtitle: "GLOW SERUM · PICK 01",
    benefit: "Brightens dark spots and gives your skin a healthy, glowing look. With Vitamin C + Hyaluronic Acid for deep hydration.",
    // Warm golden amber palette — matches Dr. Rashel yellow/orange serum packaging
    accentBg: "linear-gradient(145deg, #FFF8EC 0%, #FDECC8 50%, #FAD98A 100%)",
    accentColor: "#C98E2A",
    layoutAlignment: "left",
  },
  {
    product: mamaRiceFacewash,
    subtitle: "FACE WASH · PICK 02",
    benefit: "Cleanses gently with Korean Rice Water and Niacinamide. Makes skin bright, smooth, and naturally dewy.",
    // Soft pearl-white and pale peach — matches Mamaearth Rice Dew clean minimal aesthetic
    accentBg: "linear-gradient(145deg, #F7F2F9 0%, #EDE4F4 50%, #DDD0ED 100%)",
    accentColor: "#7B5A9E",
    layoutAlignment: "right",
  },
  {
    product: dermacoSalicylic,
    subtitle: "CLEAR WASH · PICK 03",
    benefit: "Unclogs pores and clears acne with 2% Salicylic Acid. Controls oiliness and stops blackheads from forming.",
    // Fresh cool mint-green — matches The Derma Co clinical green bottle
    accentBg: "linear-gradient(145deg, #EDFAF3 0%, #CDEFDF 50%, #A6DFC5 100%)",
    accentColor: "#1B7A4A",
    layoutAlignment: "left",
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
          TOP PICKS FOR YOU
        </motion.span>
        <motion.h2
          className="editorial-showcase-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Best sellers our customers love.
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
                      style={{ objectFit: "cover", borderRadius: 20 }}
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
