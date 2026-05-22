"use client";

import { AppErrorContent } from "@/components/errors/AppErrorContent";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppErrorContent
      reset={reset}
      showHome
    />
  );
}
