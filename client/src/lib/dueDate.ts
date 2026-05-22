import { isPast, isToday, isValid, parseISO, startOfDay } from "date-fns";

export type DueDateTone = "none" | "normal" | "today" | "overdue";

export function getDueDateTone(dueDate?: string): DueDateTone {
  if (!dueDate?.trim()) return "none";

  const parsed = parseISO(dueDate);
  if (!isValid(parsed)) return "none";

  const due = startOfDay(parsed);
  if (isToday(due)) return "today";
  if (isPast(due)) return "overdue";
  return "normal";
}

export function isTaskOverdue(dueDate?: string, status?: string): boolean {
  if (status === "Completed") return false;
  return getDueDateTone(dueDate) === "overdue";
}

export const dueDateTextClass: Record<DueDateTone, string> = {
  none: "text-text-muted",
  normal: "text-text-secondary",
  today: "text-warning-600 dark:text-warning-500",
  overdue: "text-danger-600 dark:text-danger-500",
};
