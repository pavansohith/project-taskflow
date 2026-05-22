import { memo } from "react";
import { RefreshCw, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatsVariant = "indigo" | "emerald" | "amber" | "violet";

const variantConfig: Record<
  StatsVariant,
  { label: string; icon: string; accent: string; hoverBorder: string }
> = {
  indigo: {
    label: "text-slate-400",
    icon: "text-slate-400",
    accent: "rgba(99,102,241,0.2)",
    hoverBorder: "hover:border-indigo-500/40",
  },
  emerald: {
    label: "text-emerald-400",
    icon: "text-emerald-400",
    accent: "rgba(16,185,129,0.2)",
    hoverBorder: "hover:border-emerald-500/40",
  },
  amber: {
    label: "text-amber-400",
    icon: "text-amber-400",
    accent: "rgba(245,158,11,0.2)",
    hoverBorder: "hover:border-amber-500/40",
  },
  violet: {
    label: "text-violet-400",
    icon: "text-violet-400",
    accent: "rgba(139,92,246,0.2)",
    hoverBorder: "hover:border-violet-500/40",
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

const CARD_HEIGHT_CLASS = "min-h-[130px]";

function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl border border-border bg-bg-surface p-6",
        CARD_HEIGHT_CLASS,
        className
      )}
      aria-busy="true"
      aria-label="Loading stat"
    >
      <div className="flex items-start justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
        <div className="h-[18px] w-[18px] animate-pulse rounded bg-border" />
      </div>
      <div className="mt-4 h-10 w-20 animate-pulse rounded bg-border" />
      <div className="mt-2 h-4 w-24 shrink-0 animate-pulse rounded bg-border" />
    </div>
  );
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
  const config = variantConfig[variant];
  const showError = !isLoading && error;
  const showTrend = !showError && trend && trend.length > 0;

  if (isLoading) {
    return <StatsCardSkeleton className={className} />;
  }

  return (
    <div
      className={cn(
        "relative flex cursor-default flex-col overflow-hidden rounded-xl border border-border bg-bg-surface p-6 shadow-[var(--shadow-card)] transition-all duration-200 ease-out dark:shadow-none",
        CARD_HEIGHT_CLASS,
        config.hoverBorder,
        "hover:-translate-y-0.5",
        celebrate && "animate-stat-celebrate",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-5 -bottom-5 h-20 w-20"
        style={{
          background: `radial-gradient(circle, ${config.accent} 0%, transparent 70%)`,
        }}
        aria-hidden
      />

      <div className="relative flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-xs font-semibold tracking-widest uppercase",
            config.label
          )}
        >
          {title}
        </span>
        <Icon
          className={cn("h-[18px] w-[18px] shrink-0 opacity-70", config.icon)}
          strokeWidth={1.5}
          aria-hidden
        />
      </div>

      <p className="relative mt-4 text-4xl font-bold text-text-primary tabular-nums">
        {showError ? "—" : value}
      </p>

      {/* Reserved height so cards stay equal when trend text appears/disappears */}
      <div className="relative mt-2 min-h-5 shrink-0">
        {showTrend && (
          <p className="text-xs leading-5 text-text-muted">{trend}</p>
        )}
        {showError && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-400">Failed to load</span>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-400 hover:underline"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
