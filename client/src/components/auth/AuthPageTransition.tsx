"use client";

import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function AuthPageTransition({ children }: { children: ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 1023px)");

  if (isMobile) {
    return <div className="w-full">{children}</div>;
  }

  return <div className="w-full animate-fade-in">{children}</div>;
}
