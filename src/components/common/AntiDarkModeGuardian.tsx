"use client";

import { useEffect } from "react";

export function AntiDarkModeGuardian() {
  useEffect(() => {
    function enforceLightMode() {
      const root = document.documentElement;
      const body = document.body;

      // Enforce color scheme property directly
      if (root.style.colorScheme !== "light") {
        root.style.setProperty("color-scheme", "light", "important");
      }
      if (root.style.forcedColorAdjust !== "none") {
        root.style.setProperty("forced-color-adjust", "none", "important");
      }

      // Remove rogue dark classes
      const darkClasses = [
        "dark",
        "dark-mode",
        "dark-theme",
        "theme-dark",
        "darkreader",
        "night",
      ];
      darkClasses.forEach((cls) => {
        if (root.classList.contains(cls)) root.classList.remove(cls);
        if (body && body.classList.contains(cls)) body.classList.remove(cls);
      });

      // Reset data attributes
      if (root.getAttribute("data-theme") && root.getAttribute("data-theme") !== "light") {
        root.setAttribute("data-theme", "light");
      }
      if (root.getAttribute("data-mode") && root.getAttribute("data-mode") !== "light") {
        root.setAttribute("data-mode", "light");
      }
      if (root.getAttribute("data-color-mode") && root.getAttribute("data-color-mode") !== "light") {
        root.setAttribute("data-color-mode", "light");
      }

      // Neutralize any inversion filter applied by rogue extensions or scripts
      if (root.style.filter && root.style.filter.includes("invert")) {
        root.style.setProperty("filter", "none", "important");
      }
      if (body && body.style.filter && body.style.filter.includes("invert")) {
        body.style.setProperty("filter", "none", "important");
      }

      // Remove Dark Reader or force-dark injected style tags if present
      document.querySelectorAll('style.darkreader, style[class*="darkreader"], meta[name="darkreader"]').forEach((el) => {
        if (el.tagName.toLowerCase() === "style") {
          el.remove();
        }
      });

      // Clear dark mode storage keys
      try {
        const themeKeys = ["theme", "color-theme", "darkMode", "dark-mode", "color-mode", "mode", "prefers-dark"];
        themeKeys.forEach((key) => {
          if (localStorage.getItem(key)?.toLowerCase().includes("dark")) {
            localStorage.setItem(key, "light");
          }
          if (sessionStorage.getItem(key)?.toLowerCase().includes("dark")) {
            sessionStorage.setItem(key, "light");
          }
        });
      } catch {
        // Ignore storage access errors in restricted contexts
      }
    }

    // Run immediately
    enforceLightMode();

    // Set up MutationObserver to block any attempts to introduce dark mode
    let isHandling = false;
    const observer = new MutationObserver(() => {
      if (isHandling) return;
      isHandling = true;
      try {
        enforceLightMode();
      } finally {
        isHandling = false;
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "data-mode", "data-color-mode", "style"],
    });

    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "data-theme", "data-mode", "style"],
      });
    }

    // Listen to storage events from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key && ["theme", "darkMode", "color-mode", "mode"].includes(e.key)) {
        if (e.newValue?.toLowerCase().includes("dark")) {
          try {
            localStorage.setItem(e.key, "light");
          } catch {}
          enforceLightMode();
        }
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return null;
}
