"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface NavbarProps {
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

export function Navbar({
  onMenuClick,
  onToggleCollapse,
  collapsed = false,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    const main = document.querySelector("[data-dashboard-main]");
    if (!main) return;

    const onScroll = () => setScrolled(main.scrollTop > 4);
    onScroll();
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => main.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    appToast.success("Logged out");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 transition-shadow duration-300 dark:border-border dark:bg-surface-glass lg:px-6",
        scrolled && "shadow-md"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-ring hover:bg-bg-elevated hover:text-text-primary lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-ring hover:bg-bg-elevated hover:text-text-primary lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        )}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-slate-800 dark:text-text-primary"
        >
          <LayoutDashboard className="h-5 w-5 text-indigo-600 dark:text-primary-600" />
          <span>TaskFlow</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-lg text-text-secondary transition-ring hover:bg-bg-elevated hover:text-text-primary"
          aria-label="Notifications"
          title="Notifications (coming soon)"
        >
          <Bell className="h-5 w-5" />
        </button>

        {user && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex min-h-11 items-center gap-2 rounded-lg px-2 transition-ring hover:bg-bg-elevated"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-primary-200">
                {getInitials(user.name)}
              </div>
              <span className="hidden max-w-[120px] truncate text-sm font-medium text-slate-800 dark:text-text-primary sm:inline">
                {user.name}
              </span>
              <ChevronDown
                className={cn(
                  "hidden h-4 w-4 text-text-muted transition-transform sm:block",
                  menuOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-border dark:bg-bg-surface"
                  role="menu"
                >
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-border">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-text-primary">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-text-muted">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-text-secondary dark:hover:bg-bg-elevated"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                  >
                    <User className="h-4 w-4" />
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-text-secondary dark:hover:bg-bg-elevated"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/settings");
                    }}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <hr className="my-1 border-slate-200 dark:border-border" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                    onClick={() => void handleLogout()}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
}
