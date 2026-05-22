"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AppErrorContentProps {
  title?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  showHome?: boolean;
  compact?: boolean;
}

export function AppErrorContent({
  title = "Something went wrong",
  message = "An unexpected error occurred.",
  error,
  reset,
  showHome = true,
  compact = false,
}: AppErrorContentProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center px-4 py-12 text-center"
          : "flex min-h-[60vh] flex-col items-center justify-center bg-[#0a0f1e] px-4 py-16 text-center"
      }
    >
      <AlertCircle
        className="h-12 w-12 text-rose-400"
        strokeWidth={1.5}
        aria-hidden
      />
      <h1 className="mt-4 text-xl font-semibold text-white">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-white/40">{message}</p>
      {isDev && error?.message && (
        <pre className="mt-4 max-w-lg overflow-x-auto rounded-lg bg-rose-950/20 p-3 text-left text-xs text-rose-300">
          {error.message}
        </pre>
      )}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button type="button" onClick={() => reset()}>
            Try again
          </Button>
        )}
        {showHome && (
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-medium text-white/70 transition-colors hover:bg-white/5"
          >
            Go home
          </Link>
        )}
      </div>
    </div>
  );
}
