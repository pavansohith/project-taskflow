"use client";

import { AppErrorContent } from "@/components/errors/AppErrorContent";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorContent
      title="Dashboard error"
      message="We couldn't load this page. Your sidebar and session are still active — try again or return home."
      error={error}
      reset={reset}
      showHome
      compact
    />
  );
}
