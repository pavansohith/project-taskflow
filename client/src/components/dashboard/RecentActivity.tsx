"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { NoActivityIllustration } from "@/components/ui/illustrations/NoActivityIllustration";
import { RecentActivitySkeleton } from "@/components/ui/Skeleton";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { getActivityMessage, getActivityStatusColor } from "@/lib/activity";
import { formatRelativeDate } from "@/lib/utils";
import type { TaskActivityItem } from "@/types";

interface RecentActivityProps {
  activity: TaskActivityItem[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const RecentActivity = memo(function RecentActivity({
  activity,
  isLoading,
  error,
  onRetry,
}: RecentActivityProps) {
  if (isLoading) {
    return <RecentActivitySkeleton />;
  }

  return (
    <section className="rounded-xl border border-border bg-bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-heading-3">Recent Activity</h2>
        <button
          type="button"
          className="min-h-11 text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400"
          title="Coming soon"
        >
          View all
        </button>
      </div>

      {error && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-lg bg-danger-50 p-4 dark:bg-danger-500/10">
          <p className="text-sm text-danger-600 dark:text-danger-500">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-danger-600 hover:bg-danger-50 hover:underline dark:hover:bg-danger-500/10"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!error && activity.length === 0 && (
        <div className="mt-8 text-center">
          <NoActivityIllustration />
          <p className="mt-4 text-sm text-text-secondary">
            No recent activity yet. Create your first task!
          </p>
        </div>
      )}

      {!error && activity.length > 0 && (
        <motion.ol
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative mt-6 space-y-0"
        >
          <div
            className="absolute bottom-2 left-[5px] top-2 w-px bg-border"
            aria-hidden
          />
          {activity.map((item, index) => (
            <motion.li
              key={`${item.updatedAt}-${index}`}
              variants={staggerItem}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              <span
                className={`relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-bg-surface ${getActivityStatusColor(item.status)}`}
                aria-hidden
              />
              <div className="min-w-0 flex-1 pt-0.5">
                <motion.p
                  variants={fadeInUp}
                  className="text-sm text-text-primary"
                >
                  {getActivityMessage(item)}
                </motion.p>
                <p className="text-mono-data mt-1 text-text-muted">
                  {formatRelativeDate(item.updatedAt)}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      )}
    </section>
  );
});
