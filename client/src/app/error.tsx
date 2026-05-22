"use client";

import { AppErrorContent } from "@/components/errors/AppErrorContent";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg-base">
      <AppErrorContent
        error={error}
        reset={reset}
        showHome
      />
    </div>
  );
}
