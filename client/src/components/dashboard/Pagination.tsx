"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  embedded?: boolean;
}

const pageBtnClass =
  "inline-flex h-[30px] items-center gap-1 rounded-md border border-[#1f2d45] bg-[#0a0f1e] px-3 text-xs font-medium text-white/70 transition-colors hover:border-indigo-500/50 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#1f2d45] disabled:hover:text-white/70";

export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  className,
  embedded = false,
}: PaginationProps) {
  if (totalPages <= 1 && total === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between gap-3 sm:flex-row",
        embedded && "border-t border-[#1f2d45] px-5 py-3",
        className
      )}
    >
      <p className="text-xs text-white/30">
        Page {page} of {Math.max(totalPages, 1)} · {total} task
        {total !== 1 ? "s" : ""} total
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={pageBtnClass}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
          Previous
        </button>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={pageBtnClass}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
