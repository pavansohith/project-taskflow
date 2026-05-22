"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Download,
  LayoutGrid,
  List,
  Monitor,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { del, get, getErrorMessage } from "@/lib/axios";
import {
  clearFilterPreferences,
  getDefaultPriority,
  getDefaultView,
  getNotificationPrefs,
  getTasksPerPage,
  setDefaultPriority,
  setDefaultView,
  setNotificationPrefs,
  setTasksPerPage,
  type DefaultView,
  type NotificationPrefs,
  type ThemePreference,
} from "@/lib/preferences";
import type { ApiResponse, PaginatedTasksResponse, TaskPriority } from "@/types";
import { cn } from "@/lib/utils";

function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-border dark:bg-bg-surface">
      <h2 className="mb-5 text-lg font-semibold text-slate-800 dark:text-text-primary">
        {title}
      </h2>
      {children}
    </section>
  );
}

const themeOptions: {
  value: ThemePreference;
  label: string;
  icon: import("react").ComponentType<{ className?: string }>;
  swatch: string;
}[] = [
  { value: "light", label: "Light", icon: Sun, swatch: "bg-white border-slate-300" },
  { value: "dark", label: "Dark", icon: Moon, swatch: "bg-slate-900 border-slate-700" },
  {
    value: "system",
    label: "System",
    icon: Monitor,
    swatch: "bg-gradient-to-br from-white to-slate-900 border-slate-400",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const { clearSession } = useAuth();
  const { preference, setThemePreference } = useTheme();

  const [notifications, setNotifications] =
    useState<NotificationPrefs>(getNotificationPrefs);
  const [defaultPriority, setDefaultPriorityState] = useState<TaskPriority>(
    getDefaultPriority
  );
  const [defaultView, setDefaultViewState] = useState<DefaultView>(
    getDefaultView
  );
  const [tasksPerPage, setTasksPerPageState] = useState(getTasksPerPage);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const updateNotifications = useCallback((next: NotificationPrefs) => {
    setNotifications(next);
    setNotificationPrefs(next);
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await get<PaginatedTasksResponse>("/api/tasks?limit=1000");
      const blob = new Blob([JSON.stringify(data.data ?? [], null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "taskflow-export.json";
      anchor.click();
      URL.revokeObjectURL(url);
      appToast.success("Tasks exported successfully");
    } catch (err) {
      appToast.error(getErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setIsDeleting(true);
    try {
      await del<ApiResponse<{ message: string }>>("/api/auth/account");
      setDeleteOpen(false);
      setDeleteConfirm("");
      clearSession();
      router.push("/register");
      appToast.success("Account deleted");
    } catch (err) {
      appToast.error(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-text-primary">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-text-secondary">
          Customize your TaskFlow experience.
        </p>
      </header>

      <SettingsCard title="Appearance">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {themeOptions.map(({ value, label, icon: Icon, swatch }) => {
            const selected = preference === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setThemePreference(value)}
                className={cn(
                  "relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-colors",
                  selected
                    ? "border-indigo-600 bg-indigo-50/50 dark:border-primary-500 dark:bg-primary-900/20"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-border dark:bg-bg-surface"
                )}
              >
                {selected && (
                  <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <Check className="h-3 w-3" />
                  </span>
                )}
                <span
                  className={cn("h-8 w-full rounded-md border", swatch)}
                  aria-hidden
                />
                <Icon className="h-5 w-5 text-slate-700 dark:text-text-secondary" />
                <span className="text-sm font-medium text-slate-800 dark:text-text-primary">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </SettingsCard>

      <SettingsCard title="Notifications">
        <div className="divide-y divide-slate-100 dark:divide-border">
          <Toggle
            checked={notifications.taskReminders}
            onChange={(taskReminders) =>
              updateNotifications({ ...notifications, taskReminders })
            }
            label="Task reminders"
            description="Get notified when tasks are due soon"
          />
          <Toggle
            checked={notifications.taskUpdates}
            onChange={(taskUpdates) =>
              updateNotifications({ ...notifications, taskUpdates })
            }
            label="Task updates"
            description="Get notified when tasks are updated"
          />
          <Toggle
            checked={notifications.weeklySummary}
            onChange={(weeklySummary) =>
              updateNotifications({ ...notifications, weeklySummary })
            }
            label="Weekly summary"
            description="Receive a weekly summary of your progress"
          />
        </div>
      </SettingsCard>

      <SettingsCard title="Task Preferences">
        <div className="space-y-6">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-text-primary">
              Default priority
            </p>
            <div className="flex flex-wrap gap-2">
              {(["Low", "Medium", "High"] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setDefaultPriorityState(p);
                    setDefaultPriority(p);
                  }}
                  className={cn(
                    "min-h-10 rounded-full px-4 text-sm font-medium transition-colors",
                    defaultPriority === p
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-border dark:bg-bg-surface"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-text-primary">
              Default view
            </p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { value: "table" as const, label: "Table", icon: List },
                  { value: "cards" as const, label: "Cards", icon: LayoutGrid },
                ] as const
              ).map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setDefaultViewState(value);
                    setDefaultView(value);
                  }}
                  className={cn(
                    "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
                    defaultView === value
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 dark:border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-text-primary">
              Tasks per page
            </p>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 25].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => {
                    setTasksPerPageState(n);
                    setTasksPerPage(n);
                  }}
                  className={cn(
                    "min-h-10 rounded-full px-4 text-sm font-medium transition-colors",
                    tasksPerPage === n
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-300 bg-white text-slate-700 dark:border-border"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Data & Privacy">
        <div className="space-y-4">
          <Button variant="secondary" onClick={clearFilterPreferences}>
            Clear all filters
          </Button>
          <Button
            variant="secondary"
            onClick={() => void handleExport()}
            isLoading={isExporting}
          >
            <Download className="h-4 w-4" />
            Export tasks
          </Button>

          <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 dark:border-danger-500/30 dark:bg-danger-500/5">
            <h3 className="text-sm font-semibold text-rose-800 dark:text-danger-500">
              Danger zone
            </h3>
            <p className="mt-1 text-sm text-rose-700/90 dark:text-text-secondary">
              Permanently delete your account and all associated tasks.
            </p>
            <Button
              variant="secondary"
              className="mt-4 border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-danger-500/40 dark:text-danger-500"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </div>
      </SettingsCard>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-border dark:bg-bg-surface">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-text-primary">
              Delete account?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-text-secondary">
              This will permanently delete your account and all tasks. This
              cannot be undone.
            </p>
            <p className="mt-4 text-sm text-slate-700 dark:text-text-secondary">
              Type <strong>DELETE</strong> to confirm:
            </p>
            <Input
              className="mt-2"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              autoComplete="off"
            />
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleteConfirm("");
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => void handleDeleteAccount()}
                disabled={deleteConfirm !== "DELETE"}
                isLoading={isDeleting}
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
