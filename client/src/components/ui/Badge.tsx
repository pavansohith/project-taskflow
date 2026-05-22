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

const statusStyles: Record<TaskStatus, { wrap: string; dot: string }> = {
  Todo: {
    wrap: "border-slate-600/60 text-slate-400 bg-transparent dark:border-slate-600",
    dot: "bg-slate-400",
  },
  "In Progress": {
    wrap: "border-indigo-500/50 text-indigo-400 bg-indigo-500/5",
    dot: "bg-indigo-400",
  },
  Completed: {
    wrap: "border-emerald-500/50 text-emerald-400 bg-emerald-500/5",
    dot: "bg-emerald-400",
  },
};

const priorityStyles: Record<TaskPriority, { wrap: string; dot: string }> = {
  Low: {
    wrap: "border-slate-600/60 text-slate-400 bg-transparent",
    dot: "bg-slate-400",
  },
  Medium: {
    wrap: "border-amber-500/50 text-amber-400 bg-amber-500/5",
    dot: "bg-amber-400",
  },
  High: {
    wrap: "border-rose-500/50 text-rose-400 bg-rose-500/5",
    dot: "bg-rose-400",
  },
};

function isPriority(value: TaskPriority | TaskStatus): value is TaskPriority {
  return value === "Low" || value === "Medium" || value === "High";
}

export function Badge({
  label,
  kind,
  value,
  className,
  showDot = true,
  icon,
}: BadgeProps) {
  const styles =
    kind === "priority" && isPriority(value)
      ? priorityStyles[value]
      : statusStyles[value as TaskStatus];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium",
        styles.wrap,
        className
      )}
    >
      {showDot && !icon && (
        <span
          className={cn("h-1 w-1 shrink-0 rounded-full", styles.dot)}
          aria-hidden
        />
      )}
      {icon}
      {label}
    </span>
  );
}
