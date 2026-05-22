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
import { fadeOverlay, scaleIn, slideInUp } from "@/lib/motion";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { getErrorMessage } from "@/lib/errors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
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
    activeClassName: "bg-warning-500 text-white",
  },
  {
    value: "High",
    label: "High",
    activeClassName: "bg-danger-500 text-white",
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
    label: "In Progress",
    activeClassName: "bg-primary-600 text-white",
  },
  {
    value: "Completed",
    label: "Done",
    activeClassName: "bg-success-600 text-white",
  },
];

const dateInputClass =
  "h-11 w-full rounded-lg border border-border bg-bg-surface px-3 text-base text-text-primary transition-ring focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark] sm:text-sm";

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
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
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
    const defaults = getDefaultValues(task);
    reset(defaults);
    setDescLength(defaults.description?.length ?? 0);
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

  const panelVariants = isMobile ? slideInUp : scaleIn;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isVisible && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
          role="presentation"
        >
          <motion.button
            type="button"
            variants={fadeOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 bg-[var(--overlay)]"
            onClick={requestClose}
            aria-label="Close dialog"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              "mobile-gpu relative z-10 flex w-full flex-col overflow-hidden border border-border bg-bg-surface shadow-[var(--shadow-modal)]",
              "max-h-[min(92dvh,92vh)] rounded-t-2xl sm:max-h-[min(90dvh,90vh)] sm:max-w-lg sm:rounded-xl"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 px-4 py-3.5 sm:px-6 sm:py-4">
              <h2
                id={titleId}
                className="text-base font-semibold text-white sm:text-lg"
              >
                {isEditMode ? "Edit Task" : "Create Task"}
              </h2>
              <button
                type="button"
                onClick={requestClose}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-white/90 hover:bg-white/15"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:space-y-6 sm:p-6">
                <section className="space-y-4">
                  <Input
                    label="Title"
                    error={errors.title?.message}
                    disabled={isSubmitting}
                    className="text-base sm:text-sm"
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
                      rows={3}
                      maxLength={DESCRIPTION_MAX}
                      disabled={isSubmitting}
                      placeholder="Optional details..."
                      className={cn(
                        "w-full resize-none rounded-lg border border-border bg-bg-surface px-3 py-2.5 text-base text-text-primary placeholder:text-text-muted transition-ring sm:py-2 sm:text-sm",
                        "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50"
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
                      <p className="text-xs text-text-muted">
                        {descLength} / {DESCRIPTION_MAX}
                      </p>
                    </div>
                  </div>
                </section>

                <hr className="border-border" />

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

              <div
                className="shrink-0 space-y-2 border-t border-border bg-bg-elevated/50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
              >
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
