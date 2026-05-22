import { RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorState({
  title = "Unable to load tasks",
  message,
  onRetry,
  className,
  compact = false,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "px-4 py-8" : "rounded-xl px-4 py-12 sm:px-6",
        className
      )}
      role="alert"
    >
      <WifiOff
        className="h-8 w-8 text-rose-400/50"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="mt-3 text-sm font-medium text-white/60">{title}</h3>
      <p className="mt-1 max-w-md text-xs text-white/30">{message}</p>
      <Button
        variant="secondary"
        type="button"
        className="mt-4 h-8 px-3 text-xs"
        onClick={onRetry}
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </Button>
    </div>
  );
}
