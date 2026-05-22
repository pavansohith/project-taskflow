import {
  RecentActivitySkeleton,
  StatsGridSkeleton,
  TaskListSkeleton,
} from "@/components/ui/Skeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 max-w-full" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <section className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <StatsGridSkeleton />
      </section>
      <RecentActivitySkeleton />
      <section className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <TaskListSkeleton rows={5} />
      </section>
    </div>
  );
}
