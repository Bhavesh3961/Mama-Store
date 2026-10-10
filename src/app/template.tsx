"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // Admin routes should render directly without client motion
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  // Smooth left-to-right gliding transition
  const variants = {
    initial: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -32 },
    animate: shouldReduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      key={pathname}
      variants={variants}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.32,
        ease: [0.16, 1, 0.3, 1], // Smooth Apple-grade deceleration curve
      }}
      className="page-route-transition"
    >
      {children}
    </motion.div>
  );
}
