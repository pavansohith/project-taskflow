"use client";

import { LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

const features = [
  { icon: "✓", text: "Team collaboration" },
  { icon: "⚡", text: "Real-time updates" },
  { icon: "🎯", text: "Priority tracking" },
];

export function AuthBrandingPanel() {
  return (
    <div className="relative hidden min-h-full flex-1 overflow-hidden bg-gradient-to-br from-primary-600 via-accent-600 to-primary-800 lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
      >
        <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            TaskFlow
          </span>
        </div>
        <p className="mt-6 max-w-sm text-lg text-white/90">
          Manage tasks. Ship faster.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 space-y-4"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.text}
            variants={staggerItem}
            className="auth-float-card rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md"
            style={{ animationDelay: `${index * 0.4}s` }}
          >
            <p className="text-sm font-medium text-white">
              <span className="mr-2">{feature.icon}</span>
              {feature.text}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Decorative task cards */}
      <div
        className="pointer-events-none absolute right-8 top-1/3 w-48 rotate-6 rounded-xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md"
        aria-hidden
      >
        <div className="mb-2 h-2 w-16 rounded-full bg-white/40" />
        <div className="mb-1 h-2 w-full rounded-full bg-white/25" />
        <div className="h-2 w-3/4 rounded-full bg-white/20" />
      </div>
      <div
        className="pointer-events-none absolute bottom-1/4 left-8 w-40 -rotate-3 rounded-xl border border-white/15 bg-white/5 p-3 backdrop-blur-sm"
        aria-hidden
      >
        <div className="mb-2 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-success-500/80" />
          <span className="h-2 w-8 rounded-full bg-white/30" />
        </div>
        <div className="h-2 w-full rounded-full bg-white/20" />
      </div>
    </div>
  );
}
