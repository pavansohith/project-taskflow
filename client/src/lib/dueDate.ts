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
  none: "text-sm text-text-muted",
  normal: "text-sm text-text-muted",
  today: "text-sm font-medium text-amber-400",
  overdue: "text-sm font-medium text-rose-400",
};
