"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  PanelLeftClose,
  Settings,
  User,
} from "lucide-react";
import { TaskFlowLogo } from "@/components/layout/TaskFlowLogo";
import { fadeOverlay, slideInRight } from "@/lib/motion";
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
        "flex h-full flex-col border-r border-[#1f2d45] bg-[#111827] transition-[width] duration-200",
        collapsed ? "w-[56px]" : "w-[220px]"
      )}
    >
      <div className="flex h-14 shrink-0 items-center px-4">
        {showClose ? (
          <div className="flex w-full items-center justify-between">
            <TaskFlowLogo iconOnly={collapsed} />
            <button
              type="button"
              onClick={onMobileClose}
              className="flex h-8 w-8 items-center justify-center rounded-md text-white/50 hover:bg-white/5"
              aria-label="Close menu"
            >
              <PanelLeftClose className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <TaskFlowLogo iconOnly={collapsed} />
        )}
      </div>

      <nav className="mt-6 flex-1 px-2">
        {!collapsed && (
          <p className="mb-1 mt-6 px-5 text-[10px] font-semibold tracking-[0.15em] text-white/20 uppercase">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5">
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
                    "mx-2 flex h-9 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors",
                    collapsed && "mx-0 justify-center px-0",
                    isActive
                      ? "border-l-2 border-indigo-500 bg-indigo-500/10 pl-[10px] font-semibold text-indigo-400"
                      : "border-l-2 border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {user && !collapsed && (
        <div className="border-t border-[#1f2d45] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white/80">
                {user.name}
              </p>
              <p className="truncate text-xs text-white/30">{user.email}</p>
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

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              variants={fadeOverlay}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-0 z-40 bg-[var(--overlay)] lg:hidden"
              aria-label="Close menu overlay"
              onClick={onMobileClose}
            />
            <motion.div
              variants={slideInRight}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
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
