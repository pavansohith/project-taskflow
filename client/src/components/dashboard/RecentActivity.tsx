"use client";

import { memo } from "react";
import { Inbox, RefreshCw } from "lucide-react";
import {
  getActivityStatusColor,
  getActivityStatusLabel,
  getActivityTitle,
} from "@/lib/activity";
import { formatRelativeDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { TaskActivityItem } from "@/types";

interface RecentActivityProps {
  activity: TaskActivityItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

function formatActivityMessage(item: TaskActivityItem) {
  const title = getActivityTitle(item);
  const label = getActivityStatusLabel(item);

  if (label === "Created") {
    return (
      <>
        New task <span className="font-medium text-text-primary">&apos;{title}&apos;</span>{" "}
        created
      </>
    );
  }

  return (
    <>
      <span className="font-medium text-text-primary">&apos;{title}&apos;</span> marked as{" "}
      {label}
    </>
  );
}

function ActivitySkeleton() {
  return (
    <div
      className="rounded-xl border border-border bg-bg-surface p-6 shadow-[var(--shadow-card)] dark:shadow-none"
      aria-busy="true"
      aria-label="Loading recent activity"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="h-4 w-28 animate-pulse rounded bg-border" />
        <div className="h-3 w-12 animate-pulse rounded bg-border" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-3 border-b border-border py-3 last:border-b-0">
          <div className="h-2 w-2 animate-pulse rounded-full bg-border" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-full animate-pulse rounded bg-border" />
            <div className="h-2 w-16 animate-pulse rounded bg-border" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const RecentActivity = memo(function RecentActivity({
  activity,
  isLoading,
  error,
  onRetry,
}: RecentActivityProps) {
  if (isLoading) {
    return (
      <section>
        <ActivitySkeleton />
      </section>
    );
  }

  return (
    <section>
      <div className="rounded-xl border border-border bg-bg-surface p-6 shadow-[var(--shadow-card)] dark:shadow-none">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
          <button
            type="button"
            className="cursor-pointer text-xs text-indigo-600 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            aria-label="View all activity (coming soon)"
          >
            View all
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3">
            <p className="text-sm text-rose-400">{error}</p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 text-sm font-medium text-rose-400 hover:underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        )}

        {!error && activity.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <Inbox className="h-8 w-8 text-text-muted/40" strokeWidth={1.5} aria-hidden />
            <p className="mt-2 text-sm text-text-muted">No activity yet</p>
          </div>
        )}

        {!error && activity.length > 0 && (
          <ul>
            {activity.map((item, index) => {
              const isLast = index === activity.length - 1;
              return (
                <li
                  key={`${item.updatedAt}-${index}`}
                  className={cn(
                    "flex items-start gap-3 py-3",
                    !isLast && "border-b border-border"
                  )}
                >
                  <div className="flex w-2 shrink-0 flex-col items-center self-stretch">
                    <span
                      className={cn(
                        "h-2 w-2 shrink-0 rounded-full",
                        getActivityStatusColor(item.status)
                      )}
                      aria-hidden
                    />
                    {!isLast && (
                      <span
                        className="mt-1 w-px flex-1 border-l border-dashed border-white/10"
                        aria-hidden
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-1">
                    <p className="text-sm text-text-secondary">
                      {formatActivityMessage(item)}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {formatRelativeDate(item.updatedAt)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
});
