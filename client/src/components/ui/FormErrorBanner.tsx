"use client";

import { AlertCircle } from "lucide-react";

export function FormErrorBanner({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-400"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden />
      <p>{message}</p>
    </div>
  );
}
