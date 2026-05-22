import type { TaskActivityItem, TaskStatus } from "@/types";

const STATUS_COLORS: Record<TaskStatus, string> = {
  Todo: "bg-slate-400",
  "In Progress": "bg-indigo-400",
  Completed: "bg-emerald-400",
};

export function getActivityStatusColor(status: TaskStatus): string {
  return STATUS_COLORS[status] ?? "bg-slate-400";
}

export function getActivityTitle(item: TaskActivityItem): string {
  return item.taskTitle;
}

export function getActivityStatusLabel(item: TaskActivityItem): string {
  const created = new Date(item.createdAt).getTime();
  const updated = new Date(item.updatedAt).getTime();
  const isNew = Math.abs(updated - created) < 5000;

  if (isNew) return "Created";
  return item.status;
}
