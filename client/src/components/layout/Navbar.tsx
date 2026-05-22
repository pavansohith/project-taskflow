"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  PanelLeft,
  PanelLeftClose,
  Settings,
  User,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const PAGE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/settings": "Settings",
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getBreadcrumb(pathname: string): string {
  if (PAGE_LABELS[pathname]) return PAGE_LABELS[pathname];
  const match = Object.entries(PAGE_LABELS).find(([path]) =>
    pathname.startsWith(path)
  );
  return match?.[1] ?? "Dashboard";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const breadcrumb = getBreadcrumb(pathname);

  useEffect(() => {
    const timer = window.setTimeout(() => setMenuOpen(false), 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

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

  const iconBtn =
    "flex h-9 w-9 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/5 hover:text-white/80";

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-[#1f2d45] bg-[#111827] px-5 lg:px-6">
      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          onClick={onMenuClick}
          className={cn(iconBtn, "lg:hidden")}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className={cn(iconBtn, "hidden lg:flex")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <PanelLeftClose className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        )}
        <span className="ml-1 text-base font-semibold text-white">TaskFlow</span>
        <span
          className="mx-3 hidden h-5 w-px bg-white/10 sm:block"
          aria-hidden
        />
        <span className="hidden truncate text-base text-white/30 sm:inline">
          {breadcrumb}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <button
          type="button"
          className={iconBtn}
          aria-label="Notifications"
          title="Notifications (coming soon)"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" aria-hidden />
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center rounded-md py-1 pl-1 pr-2 transition-colors hover:bg-white/5"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {getInitials(user.name)}
              </div>
              <span className="ml-2 hidden max-w-[160px] truncate text-base font-medium text-white/80 md:inline">
                {user.name}
              </span>
              <ChevronDown
                className={cn(
                  "ml-1 hidden h-4 w-4 text-white/30 transition-transform md:block",
                  menuOpen && "rotate-180"
                )}
                strokeWidth={1.5}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-lg border border-[#1f2d45] bg-[#111827] py-1 shadow-lg"
                  role="menu"
                >
                  <div className="border-b border-[#1f2d45] px-3 py-2.5">
                    <p className="truncate text-sm font-medium text-white/90">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/30">
                      {user.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/profile");
                    }}
                  >
                    <User className="h-4 w-4" strokeWidth={1.5} />
                    View Profile
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/5"
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/settings");
                    }}
                  >
                    <Settings className="h-4 w-4" strokeWidth={1.5} />
                    Settings
                  </button>
                  <hr className="my-1 border-[#1f2d45]" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10"
                    onClick={() => void handleLogout()}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.5} />
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
