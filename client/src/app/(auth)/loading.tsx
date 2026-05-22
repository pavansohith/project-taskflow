import { Skeleton } from "@/components/ui/Skeleton";

export default function AuthLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="flex flex-col items-center gap-4"
        role="status"
        aria-label="Loading"
      >
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  );
}
