"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
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
  message = "An unexpected error occurred. Please try again.",
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
          : "flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center"
      }
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-danger-500 shadow-lg">
        <AlertTriangle className="h-8 w-8 text-white" aria-hidden />
      </div>
      <h1 className="text-heading-2">{title}</h1>
      <p className="mt-2 max-w-md text-body">{message}</p>
      {isDev && error?.message && (
        <pre className="mt-4 max-w-lg overflow-x-auto rounded-lg bg-bg-elevated p-3 text-left text-xs text-danger-600">
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
            className="inline-flex h-10 items-center justify-center rounded-lg bg-bg-surface px-4 text-sm font-medium text-text-primary ring-1 ring-border transition-all hover:bg-bg-elevated"
          >
            Go home
          </Link>
        )}
      </div>
    </div>
  );
}
