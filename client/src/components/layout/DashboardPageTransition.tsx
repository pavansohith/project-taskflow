"use client";

import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

/** Skip enter animation on mobile — reduces jank during navigation */
export function DashboardPageTransition({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile) {
    return <div className="w-full">{children}</div>;
  }

  return <div className="w-full animate-fade-in">{children}</div>;
}
