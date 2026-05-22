import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-danger-500/30 bg-danger-50/50 px-4 py-12 text-center sm:px-6",
        "dark:bg-danger-500/10",
        className
      )}
      role="alert"
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-50 dark:bg-danger-500/20"
        aria-hidden="true"
      >
        <AlertCircle className="h-6 w-6 text-danger-600 dark:text-danger-500" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-text-secondary">{message}</p>
      <Button className="mt-6 min-h-11 w-full max-w-xs" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Retry
      </Button>
    </div>
  );
}
