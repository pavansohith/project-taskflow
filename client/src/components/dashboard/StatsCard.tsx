import { memo } from "react";
import { RefreshCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatsCardSkeleton } from "@/components/ui/Skeleton";

type StatsVariant = "indigo" | "emerald" | "amber" | "violet";

const variantStyles: Record<
  StatsVariant,
  { iconBg: string; iconText: string }
> = {
  indigo: {
    iconBg: "bg-primary-100 dark:bg-primary-900/40",
    iconText: "text-primary-600 dark:text-primary-400",
  },
  emerald: {
    iconBg: "bg-success-50 dark:bg-success-700/20",
    iconText: "text-success-600 dark:text-success-500",
  },
  amber: {
    iconBg: "bg-warning-50 dark:bg-warning-700/20",
    iconText: "text-warning-600 dark:text-warning-500",
  },
  violet: {
    iconBg: "bg-accent-500/10 dark:bg-accent-600/20",
    iconText: "text-accent-600 dark:text-accent-400",
  },
};

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: StatsVariant;
  trend?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  celebrate?: boolean;
  className?: string;
}

export const StatsCard = memo(function StatsCard({
  title,
  value,
  icon: Icon,
  variant = "indigo",
  trend,
  isLoading = false,
  error = null,
  onRetry,
  celebrate = false,
  className,
}: StatsCardProps) {
  const styles = variantStyles[variant];
  const showError = !isLoading && error;
  const showTrend = !showError && trend && trend.length > 0;

  if (isLoading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <div
      className={cn(
        "relative overflow-visible rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 dark:border-border dark:bg-bg-surface",
        "hover:-translate-y-0.5 hover:shadow-md",
        celebrate && "animate-stat-celebrate",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-text-muted">
            {title}
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-text-primary">
            {showError ? "—" : value}
          </p>
          {showTrend && (
            <p className="mt-1 text-xs text-slate-500 dark:text-text-muted">
              {trend}
            </p>
          )}
          {showError && (
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-xs text-danger-500">Failed to load</span>
              {onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-danger-600 transition-colors hover:bg-danger-50 dark:hover:bg-danger-500/10"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </button>
              )}
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-5 w-5", styles.iconText)} />
        </div>
      </div>
    </div>
  );
});
