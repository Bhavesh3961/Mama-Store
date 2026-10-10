"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const BEAUTY_STORIES = [
  {
    id: "story-glass-skin",
    title: "Glass Skin",
    subtitle: "Rice Dew Elixirs",
    badge: "VIRAL",
    image: "/mamaearth-rice-dew-facewash.jpg",
    link: "/shop?q=Rice+Dew",
    glow: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    id: "story-salon-hair",
    title: "Salon Repair",
    subtitle: "Serie Expert",
    badge: "PARIS",
    image: "/products/loreal-absolut-repair.png",
    link: "/shop?brand=loreal-paris",
    glow: "linear-gradient(135deg, #d4af37 0%, #ffd700 100%)",
  },
  {
    id: "story-gold-scrub",
    title: "24K Gold",
    subtitle: "Body Polish",
    badge: "LUXURY",
    image: "/products/milau-24k-gold-wash.webp",
    link: "/shop?brand=milau-professional",
    glow: "linear-gradient(135deg, #f3e8d5 0%, #c5a880 100%)",
  },
  {
    id: "story-actives",
    title: "Active Science",
    subtitle: "Vitamin C & B5",
    badge: "CLINICAL",
    image: "/products/minimalist-vitc-serum.png",
    link: "/shop?brand=minimalist",
    glow: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  },
  {
    id: "story-honey-oud",
    title: "Honey Oud",
    subtitle: "French Parfums",
    badge: "HAUTE",
    image: "/products/bellavita-honey-oud.jpg",
    link: "/shop?category=fragrance",
    glow: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  },
  {
    id: "story-couture-lips",
    title: "Couture Lips",
    subtitle: "16H Ink & MAC",
    badge: "GLAMOUR",
    image: "/products/maybelline-superstay-matte-ink.jpg",
    link: "/shop?category=makeup",
    glow: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  },
  {
    id: "story-mens-energy",
    title: "Men's Wash",
    subtitle: "Face & Body",
    badge: "FRESH",
    image: "/products/milau-mens-face-body-wash.webp",
    link: "/shop?category=mens-grooming",
    glow: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  },
];

export function BeautyStoryReel() {
  return (
    <section className="beauty-stories-section shell" aria-label="Curated Beauty Stories">
      <div className="stories-header-row">
        <span className="stories-eyebrow">
          <span className="stories-pulse-dot" />
          <span>DAILY ATELIER STORIES · TAP TO EXPLORE</span>
        </span>
        <Link href="/shop" className="stories-view-all">
          View All Drops →
        </Link>
      </div>

      <div className="stories-scroll-container">
        {BEAUTY_STORIES.map((story, i) => (
          <Link
            key={story.id}
            href={story.link}
            className="story-circle-item"
          >
            {/* Pulsing Gradient Story Ring */}
            <div className="story-ring-wrap" style={{ background: story.glow }}>
              <div className="story-avatar-stage">
                <img
                  src={story.image}
                  alt={story.title}
                  className="story-avatar-img"
                  loading="lazy"
                />
              </div>
              <span className="story-badge-pill">{story.badge}</span>
            </div>

            <div className="story-text-group">
              <span className="story-title">{story.title}</span>
              <span className="story-subtitle">{story.subtitle}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
