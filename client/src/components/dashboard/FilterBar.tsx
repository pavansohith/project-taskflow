"use client";

import { memo, useMemo, useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskFilterPriority, TaskFilterStatus, TaskPriority, TaskStatus } from "@/types";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: TaskFilterStatus;
  onStatusChange: (status: TaskFilterStatus) => void;
  priority: TaskFilterPriority;
  onPriorityChange: (priority: TaskFilterPriority) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  total: number;
  isLoading?: boolean;
}

const statusPills: { value: TaskStatus; label: string }[] = [
  { value: "Todo", label: "Todo" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const priorityPills: { value: TaskPriority; label: string }[] = [
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

function FilterPill({
  label,
  active,
  onClick,
  activeClassName,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
        "border border-border bg-bg-surface text-text-secondary hover:bg-bg-elevated",
        active && "border-transparent shadow-sm",
        active && (activeClassName ?? "bg-primary-600 text-white")
      )}
    >
      {label}
    </button>
  );
}

export const FilterBar = memo(function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  onClear,
  hasActiveFilters,
  total,
  isLoading = false,
}: FilterBarProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search.trim()) count += 1;
    if (status !== "all") count += 1;
    if (priority !== "all") count += 1;
    return count;
  }, [search, status, priority]);

  const toggleStatus = (value: TaskStatus) => {
    onStatusChange(status === value ? "all" : value);
  };

  const togglePriority = (value: TaskPriority) => {
    onPriorityChange(priority === value ? "all" : value);
  };

  const filterPanel = (
    <div className="space-y-4">
      <div>
        <p className="text-label mb-2">Status</p>
        <div className="flex flex-wrap gap-2">
          {statusPills.map((pill) => (
            <FilterPill
              key={pill.value}
              label={pill.label}
              active={status === pill.value}
              onClick={() => toggleStatus(pill.value)}
              activeClassName="bg-primary-600 text-white"
            />
          ))}
        </div>
      </div>
      <div>
        <p className="text-label mb-2">Priority</p>
        <div className="flex flex-wrap gap-2">
          {priorityPills.map((pill) => (
            <FilterPill
              key={pill.value}
              label={pill.label}
              active={priority === pill.value}
              onClick={() => togglePriority(pill.value)}
              activeClassName={
                pill.value === "Low"
                  ? "bg-slate-600 text-white"
                  : pill.value === "Medium"
                    ? "bg-warning-500 text-white"
                    : "bg-danger-500 text-white"
              }
            />
          ))}
        </div>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          Clear all
        </button>
      )}
    </div>
  );

  return (
    <div className="mb-4 space-y-4 rounded-xl border border-border bg-bg-surface p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:gap-4">
        <div className="relative w-full sm:max-w-none lg:w-[280px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className={cn(
              "h-11 w-full rounded-lg border border-border bg-bg-surface py-2 pl-9 pr-10 text-sm text-text-primary placeholder:text-text-muted transition-ring",
              "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            )}
            aria-label="Search tasks"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted hover:bg-bg-elevated hover:text-text-primary"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="shrink-0 text-sm text-text-muted">
          {isLoading ? "Loading tasks…" : `Showing ${total} task${total === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Mobile: collapsible filters */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated px-4 text-sm font-medium text-text-primary"
          aria-expanded={mobileFiltersOpen}
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1.5 text-xs font-semibold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
        {mobileFiltersOpen && (
          <div className="mt-4 border-t border-border pt-4">{filterPanel}</div>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden md:block border-t border-border pt-4">
        {filterPanel}
      </div>
    </div>
  );
});
