"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Settings, User, X } from "lucide-react";
import { fadeOverlay, slideInLeft } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
}

function SidebarPanel({
  collapsed,
  onMobileClose,
  showClose,
}: {
  collapsed: boolean;
  onMobileClose?: () => void;
  showClose?: boolean;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-bg-surface",
        showClose ? "w-[min(280px,85vw)]" : "transition-[width] duration-200",
        !showClose && (collapsed ? "w-[56px]" : "w-[220px]")
      )}
    >
      {showClose && (
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-text-primary">Menu</span>
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text-primary"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      <nav className={cn("flex-1 px-3", showClose ? "pt-4" : "pt-5")}>
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase">
            Navigation
          </p>
        )}
        <ul className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => onMobileClose?.()}
                  title={collapsed ? label : undefined}
                  className={cn(
                    "flex w-full items-center rounded-md border-l-2 transition-colors",
                    collapsed
                      ? "h-10 justify-center gap-0 border-transparent px-0"
                      : "h-10 gap-3 px-3",
                    isActive
                      ? "border-indigo-500 bg-indigo-500/10 font-semibold text-indigo-600 dark:text-indigo-400"
                      : "border-transparent text-text-muted hover:bg-bg-elevated hover:text-text-primary"
                  )}
                >
                  <Icon
                    className="h-[18px] w-[18px] shrink-0"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {!collapsed && (
                    <span className="text-[15px] font-medium leading-none">
                      {label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && !collapsed && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-text-secondary">
                {user.name}
              </p>
              <p className="truncate text-xs text-text-muted">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export function Sidebar({
  mobileOpen = false,
  onMobileClose,
  collapsed = false,
}: SidebarProps) {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLg(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveCollapsed = collapsed && isLg;

  return (
    <>
      <div className="hidden shrink-0 lg:block">
        <SidebarPanel collapsed={effectiveCollapsed} />
      </div>

      <AnimatePresence mode="wait">
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              variants={fadeOverlay}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-40 bg-[var(--overlay)] lg:hidden"
              aria-hidden
              onClick={onMobileClose}
            />
            <motion.aside
              key="drawer"
              variants={slideInLeft}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 will-change-transform lg:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <SidebarPanel
                collapsed={false}
                onMobileClose={onMobileClose}
                showClose
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
