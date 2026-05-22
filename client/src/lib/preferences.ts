import type { TaskPriority } from "@/types";

export const STORAGE_KEYS = {
  theme: "taskflow-theme",
  notifications: "taskflow-notifications",
  defaultPriority: "taskflow-default-priority",
  defaultView: "taskflow-default-view",
  tasksPerPage: "taskflow-tasks-per-page",
} as const;

export type ThemePreference = "light" | "dark" | "system";
export type DefaultView = "table" | "cards";

export interface NotificationPrefs {
  taskReminders: boolean;
  taskUpdates: boolean;
  weeklySummary: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationPrefs = {
  taskReminders: true,
  taskUpdates: true,
  weeklySummary: true,
};

export function emitSettingsChange(): void {
  window.dispatchEvent(new Event("taskflow-settings-change"));
}

export function getTasksPerPage(): number {
  const value = localStorage.getItem(STORAGE_KEYS.tasksPerPage);
  if (value === "5" || value === "10" || value === "25") {
    return Number(value);
  }
  return 10;
}

export function setTasksPerPage(limit: number): void {
  localStorage.setItem(STORAGE_KEYS.tasksPerPage, String(limit));
  emitSettingsChange();
}

export function getDefaultPriority(): TaskPriority {
  const value = localStorage.getItem(STORAGE_KEYS.defaultPriority);
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }
  return "Medium";
}

export function setDefaultPriority(priority: TaskPriority): void {
  localStorage.setItem(STORAGE_KEYS.defaultPriority, priority);
  emitSettingsChange();
}

export function getDefaultView(): DefaultView {
  const value = localStorage.getItem(STORAGE_KEYS.defaultView);
  return value === "cards" ? "cards" : "table";
}

export function setDefaultView(view: DefaultView): void {
  localStorage.setItem(STORAGE_KEYS.defaultView, view);
  emitSettingsChange();
}

export function getNotificationPrefs(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.notifications);
    if (!raw) return { ...DEFAULT_NOTIFICATIONS };
    const parsed = JSON.parse(raw) as Partial<NotificationPrefs>;
    return { ...DEFAULT_NOTIFICATIONS, ...parsed };
  } catch {
    return { ...DEFAULT_NOTIFICATIONS };
  }
}

export function setNotificationPrefs(prefs: NotificationPrefs): void {
  localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(prefs));
}

export function clearFilterPreferences(): void {
  emitSettingsChange();
}
