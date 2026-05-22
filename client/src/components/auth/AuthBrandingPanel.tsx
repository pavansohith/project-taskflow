"use client";

import { CheckCircle2 } from "lucide-react";

const features = [
  "Create and assign tasks with priorities and due dates",
  "Track progress with real-time status updates",
  "Stay on top of deadlines with smart filters and search",
] as const;

export function AuthBrandingPanel() {
  return (
    <div className="relative hidden h-screen min-h-screen flex-1 overflow-hidden bg-[#0f172a] lg:flex lg:flex-col">
      {/* Center glow accent */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)]"
        aria-hidden
      />
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]"
        aria-hidden
      />

      <div className="relative z-[1] flex h-full min-h-screen flex-col justify-between p-12">
        {/* TOP — Hero */}
        <header>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <span
              className="h-1 w-1 shrink-0 rounded-full bg-indigo-400"
              aria-hidden
            />
            <span className="text-xs font-medium text-indigo-300">
              Task Management
            </span>
          </span>

          <h1
            className="mt-4 font-extrabold tracking-[-0.04em] text-white"
            style={{
              fontSize: "clamp(4rem, 8vw, 6rem)",
              lineHeight: 1,
            }}
          >
            TaskFlow
          </h1>

          <p className="mt-2 text-2xl font-light text-white/50">
            Manage tasks smarter.
          </p>

          <p className="mt-5 max-w-[320px] text-sm leading-relaxed text-white/40">
            Everything your team needs to stay organized, hit deadlines, and
            ship great work.
          </p>
        </header>

        {/* MIDDLE — Feature list */}
        <ul className="flex flex-col gap-4">
          {features.map((text) => (
            <li key={text} className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400"
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm font-medium text-white/90">{text}</span>
            </li>
          ))}
        </ul>

        {/* BOTTOM — Testimonial */}
        <footer className="border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-xs font-medium text-indigo-300">
              SK
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/50">
                Sarah K., Product Manager
              </p>
              <p className="mt-0.5 text-xs text-white/30 italic">
                TaskFlow cut our planning time in half.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
