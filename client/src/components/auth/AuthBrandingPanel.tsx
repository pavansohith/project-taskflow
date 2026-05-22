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

      <div className="relative z-[1] flex h-full min-h-screen flex-col p-8 sm:p-10 lg:p-12">
        {/* TOP — Hero */}
        <header className="shrink-0">
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

        {/* CENTER — Feature list */}
        <div className="flex flex-1 items-center justify-center py-8">
          <ul className="mx-auto flex w-max max-w-full flex-col gap-5 sm:gap-6 lg:gap-7">
            {features.map((text) => (
              <li
                key={text}
                className="flex items-center gap-3 whitespace-nowrap sm:gap-4"
              >
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-indigo-400 sm:h-6 sm:w-6 lg:h-7 lg:w-7"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[clamp(0.875rem,1.6vw,1.25rem)] font-medium leading-none text-white/90">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
