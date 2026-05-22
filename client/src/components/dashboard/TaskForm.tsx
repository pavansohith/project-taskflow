"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, ListTodo, X } from "lucide-react";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToggleButtonGroup } from "@/components/ui/ToggleButtonGroup";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { getErrorMessage } from "@/lib/errors";
import { taskSchema, type TaskFormValues } from "@/lib/validators";
import { getDefaultPriority } from "@/lib/preferences";
import { cn } from "@/lib/utils";
import type {
  CreateTaskInput,
  ITask,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from "@/types";

export interface TaskFormProps {
  task?: ITask;
  onClose: () => void;
  onSuccess: () => void;
  createTask: (data: CreateTaskInput) => Promise<Task | undefined>;
  updateTask: (id: string, data: UpdateTaskInput) => Promise<Task | undefined>;
}

const DESCRIPTION_MAX = 500;

const priorityOptions: {
  value: TaskPriority;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "Low",
    label: "Low",
    activeClassName: "bg-slate-600 text-white dark:bg-slate-500",
  },
  {
    value: "Medium",
    label: "Medium",
    activeClassName: "bg-amber-500 text-white",
  },
  {
    value: "High",
    label: "High",
    activeClassName: "bg-rose-500 text-white",
  },
];

const statusOptions: {
  value: TaskStatus;
  label: string;
  activeClassName: string;
}[] = [
  {
    value: "Todo",
    label: "Todo",
    activeClassName: "bg-slate-600 text-white dark:bg-slate-500",
  },
  {
    value: "In Progress",
    label: "In progress",
    activeClassName: "bg-indigo-600 text-white",
  },
  {
    value: "Completed",
    label: "Done",
    activeClassName: "bg-emerald-600 text-white",
  },
];

function toDateInputValue(dueDate?: string): string {
  if (!dueDate) return "";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function getDefaultValues(task?: ITask): TaskFormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    priority: (task?.priority ?? getDefaultPriority()) as TaskPriority,
    status: (task?.status ?? "Todo") as TaskStatus,
    dueDate: toDateInputValue(task?.dueDate),
  };
}

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-transparent px-3 text-base text-text-primary placeholder:text-text-muted focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 sm:text-sm";

export function TaskForm({
  task,
  onClose,
  onSuccess,
  createTask,
  updateTask,
}: TaskFormProps) {
  const isEditMode = Boolean(task);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [descLength, setDescLength] = useState(
    () => task?.description?.length ?? 0
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(task),
  });

  const descriptionRegister = register("description");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const defaults = getDefaultValues(task);
    reset(defaults);
    setDescLength(defaults.description?.length ?? 0);
  }, [task, reset]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !mounted) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));

    const timer = window.setTimeout(() => {
      getFocusable()[0]?.focus();
    }, 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted, onClose]);

  const onSubmit = async (values: TaskFormValues) => {
    setSubmitError(null);
    const payload = {
      title: values.title,
      description: values.description?.trim() || undefined,
      priority: values.priority,
      status: values.status,
      dueDate: values.dueDate?.trim() || undefined,
    };

    try {
      if (isEditMode && task) {
        await updateTask(task._id, payload);
        appToast.success("Task updated");
      } else {
        await createTask(payload);
        appToast.success("Task created");
      }
      onSuccess();
      onClose();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  if (!mounted) return null;

  const modalTitle = isEditMode ? "Edit task" : "New task";
  const modalSubtitle = isEditMode
    ? "Update details and save your changes."
    : "Add a title and optional details to track your work.";

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4 md:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[var(--overlay)] animate-modal-overlay-in"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "animate-task-modal-in relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-bg-surface shadow-[var(--shadow-modal)] md:max-w-2xl md:rounded-2xl",
          "max-h-[90vh]"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div
          className="flex shrink-0 justify-center pt-3 pb-1 sm:hidden"
          aria-hidden
        >
          <span className="h-1 w-10 rounded-full bg-border-strong" />
        </div>

        {/* Header — same surface bg as body; border only for separation */}
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-5 pb-4 pt-1 sm:px-6 sm:pt-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-indigo-600 dark:text-indigo-400">
            <ListTodo className="h-5 w-5" strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 flex-1 pr-2">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-text-primary sm:text-xl"
            >
              {modalTitle}
            </h2>
            <p className="mt-0.5 text-sm text-text-muted">{modalSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:text-text-primary"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6 sm:py-6">
            <div className="w-full space-y-4">
              <Input
                label="Title"
                placeholder="What needs to be done?"
                error={errors.title?.message}
                disabled={isSubmitting}
                className={fieldClass}
                {...register("title")}
              />

              <div className="flex w-full flex-col gap-1.5">
                <label
                  htmlFor="task-description"
                  className="text-sm font-medium text-text-primary"
                >
                  Description
                  <span className="ml-1 font-normal text-text-muted">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  maxLength={DESCRIPTION_MAX}
                  disabled={isSubmitting}
                  placeholder="Add notes, links, or context..."
                  className={cn(
                    fieldClass,
                    "min-h-[88px] resize-none py-2.5"
                  )}
                  name={descriptionRegister.name}
                  ref={descriptionRegister.ref}
                  onBlur={descriptionRegister.onBlur}
                  onChange={(e) => {
                    setDescLength(e.target.value.length);
                    void descriptionRegister.onChange(e);
                  }}
                />
                <div className="flex items-center justify-between gap-2">
                  {errors.description?.message ? (
                    <p className="text-sm text-danger-600">
                      {errors.description.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <p className="text-xs tabular-nums text-text-muted">
                    {descLength}/{DESCRIPTION_MAX}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Priority
              </p>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    options={priorityOptions}
                    value={field.value as TaskPriority}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    transparentInactive
                    className="grid grid-cols-3 gap-2"
                  />
                )}
              />
            </div>

            <div className="w-full space-y-3">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Status
              </p>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    options={statusOptions}
                    value={field.value as TaskStatus}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    transparentInactive
                    className="grid grid-cols-3 gap-2"
                  />
                )}
              />
            </div>

            <div className="w-full space-y-3">
              <label
                htmlFor="task-due-date"
                className="flex items-center gap-2 text-sm font-medium text-text-primary"
              >
                <Calendar
                  className="h-4 w-4 text-indigo-500"
                  strokeWidth={1.75}
                  aria-hidden
                />
                Due date
                <span className="font-normal text-text-muted">(optional)</span>
              </label>
              <input
                id="task-due-date"
                type="date"
                disabled={isSubmitting}
                className={fieldClass}
                {...register("dueDate")}
              />
              {errors.dueDate?.message && (
                <p className="text-sm text-danger-600">
                  {errors.dueDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
            <FormErrorBanner message={submitError} />
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="submit"
                className="h-11 w-full sm:flex-1"
                isLoading={isSubmitting}
              >
                {isEditMode ? "Save changes" : "Create task"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-11 w-full sm:w-auto sm:min-w-[100px]"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
