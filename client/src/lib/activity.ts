import type { TaskActivityItem, TaskStatus } from "@/types";

const STATUS_COLORS: Record<TaskStatus, string> = {
  Todo: "bg-slate-400",
  "In Progress": "bg-primary-500",
  Completed: "bg-success-500",
};

export function getActivityStatusColor(status: TaskStatus): string {
  return STATUS_COLORS[status] ?? "bg-slate-400";
}

export function getActivityMessage(item: TaskActivityItem): string {
  const created = new Date(item.createdAt).getTime();
  const updated = new Date(item.updatedAt).getTime();
  const isNew = Math.abs(updated - created) < 5000;

  if (isNew) {
    return `New task '${item.taskTitle}' created`;
  }

  if (item.status === "Completed") {
    return `Task '${item.taskTitle}' marked as Completed`;
  }

  if (item.status === "In Progress") {
    return `Task '${item.taskTitle}' moved to In Progress`;
  }

  return `Task '${item.taskTitle}' updated`;
}
