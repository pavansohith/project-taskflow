"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { appToast } from "@/lib/toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ToggleButtonGroup } from "@/components/ui/ToggleButtonGroup";
import { fadeOverlay, scaleIn } from "@/lib/motion";
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
    activeClassName:
      "bg-slate-600 text-white dark:bg-slate-500",
  },
  {
    value: "Medium",
    label: "Medium",
    activeClassName:
      "bg-warning-500 text-white",
  },
  {
    value: "High",
    label: "High",
    activeClassName:
      "bg-danger-500 text-white",
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
    activeClassName:
      "bg-slate-600 text-white dark:bg-slate-500",
  },
  {
    value: "In Progress",
    label: "In Progress",
    activeClassName:
      "bg-primary-600 text-white",
  },
  {
    value: "Completed",
    label: "Done",
    activeClassName:
      "bg-success-600 text-white",
  },
];

const dateInputClass =
  "h-11 w-full rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary transition-ring focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]";

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
  const [isVisible, setIsVisible] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: getDefaultValues(task),
  });

  const descriptionValue = watch("description") ?? "";

  useEffect(() => {
    reset(getDefaultValues(task));
  }, [task, reset]);

  const requestClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleExitComplete = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isVisible) return;

    const focusableSelector =
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));

    const timer = window.setTimeout(() => {
      getFocusable()[0]?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
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
  }, [isVisible, requestClose]);

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
      requestClose();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center md:items-center md:p-4"
          role="presentation"
        >
          <motion.button
            type="button"
            variants={fadeOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-md"
            onClick={requestClose}
            aria-label="Close dialog"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "relative z-10 flex w-full max-h-[92vh] max-w-lg flex-col overflow-hidden rounded-t-xl border border-border bg-bg-surface shadow-[var(--shadow-modal)] max-md:max-w-none md:max-h-[90vh] md:rounded-xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient header */}
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 px-6 py-4">
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {isEditMode ? "Edit Task" : "Create Task"}
              </h2>
              <button
                type="button"
                onClick={requestClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex max-h-[calc(92vh-4rem)] flex-col overflow-y-auto"
            >
              <div className="space-y-6 p-6">
                {/* Basics */}
                <section className="space-y-4">
                  <Input
                    label="Title"
                    error={errors.title?.message}
                    disabled={isSubmitting}
                    {...register("title")}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="task-description"
                      className="text-sm font-medium text-text-primary"
                    >
                      Description
                    </label>
                    <textarea
                      id="task-description"
                      rows={4}
                      maxLength={DESCRIPTION_MAX}
                      disabled={isSubmitting}
                      placeholder="Optional details..."
                      className={cn(
                        "w-full resize-none rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted transition-ring",
                        "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
                      )}
                      {...register("description")}
                    />
                    <div className="flex items-center justify-between gap-2">
                      {errors.description?.message ? (
                        <p className="text-sm text-danger-600">
                          {errors.description.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-text-muted">
                        {descriptionValue.length} / {DESCRIPTION_MAX}
                      </p>
                    </div>
                  </div>
                </section>

                <hr className="border-border" />

                {/* Priority & status */}
                <section className="space-y-4">
                  <div>
                    <p className="text-label mb-3">Priority</p>
                    <Controller
                      name="priority"
                      control={control}
                      render={({ field }) => (
                        <ToggleButtonGroup
                          options={priorityOptions}
                          value={field.value as TaskPriority}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <p className="text-label mb-3">Status</p>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <ToggleButtonGroup
                          options={statusOptions}
                          value={field.value as TaskStatus}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </div>
                </section>

                <hr className="border-border" />

                {/* Due date */}
                <section>
                  <label
                    htmlFor="task-due-date"
                    className="text-sm font-medium text-text-primary"
                  >
                    Due date
                  </label>
                  <input
                    id="task-due-date"
                    type="date"
                    disabled={isSubmitting}
                    className={cn(dateInputClass, "mt-1.5")}
                    {...register("dueDate")}
                  />
                  {errors.dueDate?.message && (
                    <p className="mt-1 text-sm text-danger-600">
                      {errors.dueDate.message}
                    </p>
                  )}
                </section>
              </div>

              <div className="shrink-0 space-y-2 border-t border-border bg-bg-elevated/50 p-6">
                <FormErrorBanner message={submitError} />
                <Button
                  type="submit"
                  className="h-11 w-full"
                  isLoading={isSubmitting}
                >
                  {isEditMode ? "Save changes" : "Create task"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 w-full"
                  onClick={requestClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
