"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-right"
      closeButton
      richColors={false}
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-xl !border !border-border !bg-bg-surface !text-text-primary !shadow-lg",
          title: "!text-sm !font-medium !text-text-primary",
          description: "!text-sm !text-text-secondary",
          closeButton:
            "!border-border !bg-bg-elevated !text-text-secondary hover:!text-text-primary",
          success:
            "toast-success !border-success-500/40 !bg-success-50 !text-success-800 dark:!bg-success-700/25 dark:!text-success-500",
          error:
            "toast-error !border-danger-500/40 !bg-danger-50 !text-danger-800 dark:!bg-danger-500/15 dark:!text-danger-500",
          warning:
            "toast-warning !border-warning-500/40 !bg-warning-50 !text-warning-800 dark:!bg-warning-700/25 dark:!text-warning-500",
          info: "toast-info !border-primary-500/40 !bg-primary-50 !text-primary-800 dark:!bg-primary-900/40 dark:!text-primary-300",
        },
      }}
    />
  );
}
