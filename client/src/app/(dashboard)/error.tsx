"use client";

import { AppErrorContent } from "@/components/errors/AppErrorContent";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorContent
      title="Something went wrong"
      message="An unexpected error occurred."
      reset={reset}
      showHome
      compact
    />
  );
}
