import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

/** Base pulse block — bg-slate-200 dark:bg-slate-700 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-700",
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Matches StatsCard layout (label, stat, trend, icon) */
export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-5 shadow-sm",
        className
      )}
      aria-busy="true"
      aria-label="Loading stat"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="mt-3 h-10 w-24 rounded-lg" />
          <Skeleton className="mt-2 h-3 w-16 rounded" />
        </div>
        <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      </div>
    </div>
  );
}

export function StatsGridSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {Array.from({ length: count }, (_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Matches mobile TaskCard in TaskTable */
export function TaskCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-4 shadow-sm",
        className
      )}
      aria-hidden
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-[75%] max-w-[220px] rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <Skeleton className="h-11 w-11 rounded-lg" />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Skeleton className="h-7 w-[72px] rounded-full" />
        <Skeleton className="h-7 w-[100px] rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-16 rounded" />
      </div>
    </div>
  );
}

/** Desktop table skeleton — column proportions match TaskTable */
export function TaskTableSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "hidden overflow-hidden rounded-xl border border-border bg-bg-surface shadow-sm lg:block",
        className
      )}
      aria-busy="true"
      aria-label="Loading tasks"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-border bg-bg-elevated/80">
            <tr>
              <th className="w-[32%] px-4 py-3">
                <Skeleton className="h-3 w-12" />
              </th>
              <th className="w-[12%] px-4 py-3">
                <Skeleton className="h-3 w-14" />
              </th>
              <th className="w-[14%] px-4 py-3">
                <Skeleton className="h-3 w-12" />
              </th>
              <th className="w-[14%] px-4 py-3">
                <Skeleton className="h-3 w-16" />
              </th>
              <th className="w-[14%] px-4 py-3">
                <Skeleton className="h-3 w-14" />
              </th>
              <th className="w-[14%] px-4 py-3 text-right">
                <Skeleton className="ml-auto h-3 w-14" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }, (_, i) => (
              <tr key={i}>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-[85%] max-w-[240px] rounded" />
                  <Skeleton className="mt-1.5 h-3 w-[60%] max-w-[180px] rounded" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-7 w-[72px] rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-7 w-[100px] rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-20 rounded" />
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-24 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Skeleton className="h-11 w-11 rounded-lg" />
                    <Skeleton className="h-11 w-11 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Mobile cards + desktop table */
export function TaskListSkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true">
      <div className="flex flex-col gap-3 lg:hidden">
        {Array.from({ length: rows }, (_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
      <TaskTableSkeleton rows={rows} />
    </div>
  );
}

/** Matches RecentActivity timeline */
export function RecentActivitySkeleton({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-6 shadow-sm",
        className
      )}
      aria-busy="true"
      aria-label="Loading recent activity"
    >
      <Skeleton className="h-5 w-40 rounded" />
      <div className="relative mt-6">
        <div
          className="absolute bottom-2 left-[5px] top-2 w-px bg-border"
          aria-hidden
        />
        <div className="space-y-0">
          {Array.from({ length: rows }, (_, i) => (
            <div
              key={i}
              className={cn("relative flex gap-4", i < rows - 1 && "pb-6")}
            >
              <Skeleton className="relative z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                <Skeleton className="h-4 w-full max-w-md rounded" />
                <Skeleton className="h-3 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use TaskListSkeleton */
export { TaskListSkeleton as TableSkeleton };
