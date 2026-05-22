"use client";

import { memo, useEffect, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TaskFilterPriority,
  TaskFilterStatus,
  TaskPriority,
  TaskStatus,
} from "@/types";

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
  embedded?: boolean;
}

const statusOptions: { value: TaskFilterStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Todo", label: "Todo" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const priorityOptions: { value: TaskFilterPriority; label: string }[] = [
  { value: "all", label: "All priorities" },
  { value: "Low", label: "Low" },
  { value: "Medium", label: "Medium" },
  { value: "High", label: "High" },
];

const statusDot: Record<TaskStatus, string> = {
  Todo: "bg-slate-400",
  "In Progress": "bg-indigo-400",
  Completed: "bg-emerald-400",
};

const priorityDot: Record<TaskPriority, string> = {
  Low: "bg-slate-400",
  Medium: "bg-amber-400",
  High: "bg-rose-400",
};

const filterBtnClass =
  "inline-flex h-[34px] min-w-[100px] items-center justify-between gap-2 rounded-md border border-border bg-bg-base px-3 text-sm text-text-secondary transition-colors hover:border-indigo-500/50";

const filterInputClass =
  "h-[34px] w-[240px] max-w-full rounded-md border border-border bg-bg-base py-0 pr-8 pl-9 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/30";

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onChange,
  activeDotClass,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  activeDotClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const isActive = value !== options[0]?.value;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          filterBtnClass,
          isActive && "border-indigo-500/50 text-text-primary"
        )}
      >
        <span className="flex items-center gap-1.5 truncate">
          {isActive && activeDotClass && (
            <span
              className={cn("h-1.5 w-1.5 shrink-0 rounded-full", activeDotClass)}
            />
          )}
          <span className="truncate">
            {isActive ? selected.label : label}
          </span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-text-muted" strokeWidth={1.5} />
      </button>
      {open && (
        <div className="absolute top-full left-0 z-30 mt-1 min-w-full overflow-hidden rounded-md border border-border bg-bg-surface py-1 shadow-[var(--shadow-modal)]">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full px-3 py-2 text-left text-sm transition-colors hover:bg-bg-elevated",
                value === opt.value
                  ? "font-medium text-indigo-600 dark:text-indigo-400"
                  : "text-text-secondary"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
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
  embedded = false,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center",
        embedded
          ? "border-b border-border px-5 py-4"
          : "mb-4 sm:justify-between"
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-auto">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted"
            strokeWidth={1.5}
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className={filterInputClass}
            aria-label="Search tasks"
          />
          {search.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-text-muted hover:bg-bg-elevated"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <FilterDropdown
          label="Status"
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          activeDotClass={
            status !== "all" ? statusDot[status as TaskStatus] : undefined
          }
        />
        <FilterDropdown
          label="Priority"
          value={priority}
          options={priorityOptions}
          onChange={onPriorityChange}
          activeDotClass={
            priority !== "all"
              ? priorityDot[priority as TaskPriority]
              : undefined
          }
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-text-muted hover:text-text-primary"
          >
            Clear
          </button>
        )}
      </div>

      <p className="shrink-0 text-xs text-text-muted sm:ml-auto">
        {isLoading ? "Loading…" : `${total} task${total === 1 ? "" : "s"}`}
      </p>
    </div>
  );
});
