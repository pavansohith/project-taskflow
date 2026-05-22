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

function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative min-h-[130px] overflow-hidden rounded-xl border border-[#1f2d45] bg-[#111827] p-6",
        className
      )}
      aria-busy="true"
      aria-label="Loading stat"
    >
      <div className="flex items-start justify-between">
        <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
        <div className="h-[18px] w-[18px] animate-pulse rounded bg-white/10" />
      </div>
      <div className="mt-4 h-10 w-20 animate-pulse rounded bg-white/10" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-white/10" />
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
        "relative min-h-[130px] cursor-default overflow-hidden rounded-xl border border-[#1f2d45] bg-[#111827] p-6 transition-all duration-200 ease-out dark:shadow-none",
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

      <p className="relative mt-4 text-4xl font-bold text-white tabular-nums">
        {showError ? "—" : value}
      </p>

      {showTrend && (
        <p className="relative mt-2 text-xs text-white/40">{trend}</p>
      )}

      {showError && (
        <div className="relative mt-2 flex items-center gap-2">
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
  );
});
