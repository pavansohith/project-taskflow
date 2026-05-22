import { NoTasksIllustration } from "@/components/ui/illustrations/NoTasksIllustration";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = "No tasks found",
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-bg-elevated/50 px-4 py-12 text-center sm:px-6 sm:py-16",
        className
      )}
    >
      <NoTasksIllustration className="mb-4 h-24 w-40" />
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {onAction && actionLabel && (
        <Button className="mt-6 min-h-11 w-full max-w-xs" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
