"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1 && total === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 sm:flex-row",
        className
      )}
    >
      <p className="text-sm text-text-muted">
        Page {page} of {Math.max(totalPages, 1)} · {total} task
        {total !== 1 ? "s" : ""} total
      </p>
      <div className="flex w-full items-stretch gap-2 sm:w-auto">
        <Button
          variant="secondary"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          className="min-h-11 min-w-[44px] flex-1 sm:flex-none"
        >
          <ChevronLeft className="h-4 w-4 shrink-0" />
          Previous
        </Button>
        <Button
          variant="secondary"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="min-h-11 min-w-[44px] flex-1 sm:flex-none"
        >
          Next
          <ChevronRight className="h-4 w-4 shrink-0" />
        </Button>
      </div>
    </div>
  );
}
