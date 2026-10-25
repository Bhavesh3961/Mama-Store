"use client";

import { useEffect } from "react";

type DynamicBrandFaviconProps = {
  logoUrl: string;
  brandName?: string;
};

/**
 * Dynamically switches the browser tab favicon to the active brand's logo
 * Supports both SSR hoisting and client-side SPA navigation.
 */
export function DynamicBrandFavicon({ logoUrl }: DynamicBrandFaviconProps) {
  useEffect(() => {
    if (!logoUrl) return;

    // Find all icon links in document head
    const selector = "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon'], link[rel*='icon']";
    const existingLinks = Array.from(document.querySelectorAll<HTMLLinkElement>(selector));

    const originalStates: { element: HTMLLinkElement; href: string; type: string }[] = [];

    if (existingLinks.length > 0) {
      existingLinks.forEach((link) => {
        originalStates.push({
          element: link,
          href: link.href,
          type: link.type || "",
        });
        link.href = logoUrl;
        link.type = logoUrl.endsWith(".svg") ? "image/svg+xml" : "image/png";
      });
    } else {
      // Create a new icon link if none present
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = logoUrl;
      newLink.type = logoUrl.endsWith(".svg") ? "image/svg+xml" : "image/png";
      document.head.appendChild(newLink);
      originalStates.push({
        element: newLink,
        href: "",
        type: "",
      });
    }

    return () => {
      // Revert back when user navigates away
      originalStates.forEach(({ element, href, type }) => {
        if (href) {
          element.href = href;
          if (type) element.type = type;
        } else {
          element.remove();
        }
      });
    };
  }, [logoUrl]);

  return (
    <>
      <link rel="icon" href={logoUrl} key="brand-icon" />
      <link rel="shortcut icon" href={logoUrl} key="brand-shortcut-icon" />
      <link rel="apple-touch-icon" href={logoUrl} key="brand-apple-icon" />
    </>
  );
}
