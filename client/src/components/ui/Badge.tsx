import { cn } from "@/lib/utils";
import type { TaskPriority, TaskStatus } from "@/types";

export type BadgeKind = "priority" | "status";

export interface BadgeProps {
  label: string;
  kind: BadgeKind;
  value: TaskPriority | TaskStatus;
  className?: string;
  showDot?: boolean;
  icon?: React.ReactNode;
}

const priorityStyles: Record<TaskPriority, string> = {
  Low: "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
  Medium:
    "bg-warning-50 text-warning-700 ring-warning-500/20 dark:bg-warning-700/20 dark:text-warning-500",
  High: "bg-danger-50 text-danger-700 ring-danger-500/20 dark:bg-danger-500/15 dark:text-danger-500",
};

const priorityDot: Record<TaskPriority, string> = {
  Low: "bg-slate-500",
  Medium: "bg-warning-500",
  High: "bg-danger-500",
};

const statusStyles: Record<TaskStatus, string> = {
  Todo: "bg-slate-100 text-slate-700 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
  "In Progress":
    "bg-primary-100 text-primary-700 ring-primary-500/20 dark:bg-primary-900/40 dark:text-primary-300",
  Completed:
    "bg-success-50 text-success-700 ring-success-500/20 dark:bg-success-700/20 dark:text-success-500",
};

function isPriority(value: TaskPriority | TaskStatus): value is TaskPriority {
  return value === "Low" || value === "Medium" || value === "High";
}

export function Badge({
  label,
  kind,
  value,
  className,
  showDot = false,
  icon,
}: BadgeProps) {
  const colorClass =
    kind === "priority" && isPriority(value)
      ? priorityStyles[value]
      : statusStyles[value as TaskStatus];

  const dotClass =
    kind === "priority" && isPriority(value) ? priorityDot[value] : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        colorClass,
        className
      )}
    >
      {showDot && dotClass && (
        <span
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass)}
          aria-hidden
        />
      )}
      {icon}
      {label}
    </span>
  );
}
