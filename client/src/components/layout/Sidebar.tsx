"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckSquare,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  Settings,
  User,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { fadeOverlay, slideInRight } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  collapsed?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onMobileClose?.();
    await logout();
    appToast.success("Logged out");
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ease-out dark:border-border dark:bg-bg-surface",
        collapsed ? "w-[72px]" : "w-60"
      )}
    >
      {showClose && (
        <div className="flex items-center justify-end p-3">
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-text-muted hover:bg-bg-elevated"
            aria-label="Close menu"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
      )}

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={label}
              href={href}
              onClick={() => onMobileClose?.()}
              title={collapsed ? label : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-primary-900/40 dark:text-primary-200"
                  : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-text-secondary dark:hover:bg-bg-elevated dark:hover:text-text-primary"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        {user && !collapsed && (
          <div className="mb-3 rounded-xl bg-bg-elevated p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {user.name}
                </p>
                <p className="truncate text-xs text-text-muted">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-danger-600",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        {!collapsed && (
          <div className="mt-3 flex items-center gap-2 px-1 text-xs text-text-muted">
            <CheckSquare className="h-3.5 w-3.5" />
            Task management
          </div>
        )}
      </div>
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

  const effectiveCollapsed = collapsed && !isLg;

  return (
    <>
      <div className="hidden shrink-0 lg:block">
        <SidebarPanel collapsed={effectiveCollapsed} />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              variants={fadeOverlay}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-40 bg-[var(--overlay)] md:hidden"
              aria-label="Close menu overlay"
              onClick={onMobileClose}
            />
            <motion.div
              variants={slideInRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 right-0 z-50 lg:hidden"
            >
              <SidebarPanel
                collapsed={false}
                onMobileClose={onMobileClose}
                showClose
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
