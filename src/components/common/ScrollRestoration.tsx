"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * High-performance Scroll Restoration Manager for Mama Store
 * Solves the Next.js App Router bug where navigating back from a brand/product page
 * resets scroll position to the top (0,0), forcing users to scroll repeatedly.
 */
export function ScrollRestoration() {
  const pathname = usePathname();
  const isPopStateRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set browser scroll restoration to manual so our custom manager has full control
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Record when the user navigates using back/forward
    const handlePopState = () => {
      isPopStateRef.current = true;
    };

    // Throttled scroll listener to continuously save current scroll position
    const handleScroll = () => {
      if (scrollTimeoutRef.current) return;
      scrollTimeoutRef.current = setTimeout(() => {
        scrollTimeoutRef.current = null;
        const currentPath = window.location.pathname;
        const y = window.scrollY || document.documentElement.scrollTop;
        if (y > 0) {
          try {
            sessionStorage.setItem(`mama_scroll_${currentPath}`, String(Math.round(y)));
          } catch {
            // Ignore quota errors
          }
        }
      }, 80);
    };

    // Save scroll on click on any brand or product link
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && target.href.startsWith(window.location.origin)) {
        const currentPath = window.location.pathname;
        const y = window.scrollY || document.documentElement.scrollTop;
        try {
          sessionStorage.setItem(`mama_scroll_${currentPath}`, String(Math.round(y)));
        } catch {}
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleLinkClick, { capture: true });

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleLinkClick, { capture: true });
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // When pathname changes (either forward or back navigation):
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedPos = sessionStorage.getItem(`mama_scroll_${pathname}`);
    const shouldRestore = isPopStateRef.current || (savedPos && Number(savedPos) > 0);

    if (shouldRestore && savedPos) {
      const targetY = Number(savedPos);
      if (targetY > 0) {
        // Attempt immediate restoration and staggered checks as content hydrates
        const restore = () => {
          window.scrollTo({ top: targetY, behavior: "instant" });
        };

        restore();
        const t1 = setTimeout(restore, 40);
        const t2 = setTimeout(restore, 120);
        const t3 = setTimeout(restore, 280);

        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    }

    // Reset popstate flag for next navigation
    isPopStateRef.current = false;
  }, [pathname]);

  return null;
}
