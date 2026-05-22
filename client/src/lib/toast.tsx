"use client";

import { AlertTriangle, Check, Info, X } from "lucide-react";
import { toast } from "sonner";

const iconClass = "h-4 w-4 shrink-0";

/** Themed toasts — success / error / warning / info with Lucide icons */
export const appToast = {
  success: (message: string) =>
    toast.success(message, {
      icon: <Check className={iconClass} aria-hidden />,
    }),

  error: (message: string) =>
    toast.error(message, {
      icon: <X className={iconClass} aria-hidden />,
    }),

  warning: (message: string) =>
    toast.warning(message, {
      icon: <AlertTriangle className={iconClass} aria-hidden />,
    }),

  info: (message: string) =>
    toast.info(message, {
      icon: <Info className={iconClass} aria-hidden />,
    }),
};
