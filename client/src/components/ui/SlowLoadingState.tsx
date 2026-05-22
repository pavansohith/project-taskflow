"use client";

import { Button } from "@/components/ui/Button";

interface SlowLoadingStateProps {
  onKeepWaiting: () => void;
  onCancel: () => void;
}

export function SlowLoadingState({
  onKeepWaiting,
  onCancel,
}: SlowLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
      <p className="text-xs text-white/30">Taking longer than expected...</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Button variant="secondary" type="button" onClick={onKeepWaiting}>
          Keep waiting
        </Button>
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
