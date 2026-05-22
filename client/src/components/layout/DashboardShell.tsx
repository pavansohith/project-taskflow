"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { DashboardPageTransition } from "@/components/layout/DashboardPageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [mobileOpen, closeMobile]);

  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        collapsed={collapsed}
      />
      <div className="flex flex-1">
        <Sidebar
          mobileOpen={mobileOpen}
          onMobileClose={closeMobile}
          collapsed={collapsed}
        />
        <main
          data-dashboard-main
          className="flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          <div className="w-full pb-6 sm:pb-8">
            <DashboardPageTransition>{children}</DashboardPageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
