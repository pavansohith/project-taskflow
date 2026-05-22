"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  PanelLeft,
  Sun,
  User,
} from "lucide-react";
import { TaskFlowLogo } from "@/components/layout/TaskFlowLogo";
import { appToast } from "@/lib/toast";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const iconBtnClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-elevated hover:text-text-primary";

interface NavbarProps {
  onToggleSidebar?: () => void;
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

export function Navbar({
  onToggleSidebar,
  onMenuClick,
  onToggleCollapse,
}: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const handleSidebarToggle = () => {
    if (onToggleSidebar) {
      onToggleSidebar();
      return;
    }
    if (onMenuClick) {
      onMenuClick();
      return;
    }
    onToggleCollapse?.();
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    appToast.success("Logged out");
  };

  return (
    <nav
      className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center gap-4 border-b border-border bg-bg-surface px-5 lg:px-6"
      aria-label="Main navigation"
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={handleSidebarToggle}
          className={iconBtnClass}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>

        <TaskFlowLogo size="lg" />
      </div>

      <div className="min-w-0 flex-1" aria-hidden />

      <div className="relative flex shrink-0 items-center gap-1" ref={menuRef}>
        <button
          type="button"
          onClick={toggleTheme}
          className={iconBtnClass}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
          ) : (
            <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
          )}
        </button>

        <button
          type="button"
          className={iconBtnClass}
          aria-label="Notifications"
          title="Notifications (coming soon)"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
        </button>

        <span className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden />

        {user ? (
          <>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-md py-1.5 pl-1 pr-2 transition-colors hover:bg-bg-elevated"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {getInitials(user.name)}
              </div>
              <span className="hidden max-w-[160px] truncate text-base font-medium text-text-secondary sm:block">
                {user.name}
              </span>
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 shrink-0 text-text-muted transition-transform",
                  menuOpen && "rotate-180"
                )}
                strokeWidth={1.5}
                aria-hidden
              />
            </button>

            {menuOpen && (
              <div
                className="absolute top-16 right-0 z-50 min-w-[180px] rounded-lg border border-border bg-bg-elevated py-1 shadow-[var(--shadow-modal)]"
                role="menu"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {user.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/profile");
                  }}
                >
                  <User className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  View Profile
                </button>

                <div className="my-1 border-t border-border" />

                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-rose-500/80 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                  onClick={() => void handleLogout()}
                >
                  <LogOut className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            className="h-9 w-9 shrink-0 rounded-full bg-bg-elevated"
            aria-hidden
          />
        )}
      </div>
    </nav>
  );
}
