"use client";

import { forwardRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, id, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            className={cn(
              "h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition-ring dark:border-border dark:bg-bg-surface dark:text-text-primary dark:placeholder:text-text-muted",
              "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-danger-500 focus:border-danger-500 focus:ring-danger-500/50",
              className
            )}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-muted transition-ring hover:bg-bg-elevated hover:text-text-primary"
          >
            <AnimatePresence mode="wait" initial={false}>
              {showPassword ? (
                <motion.span
                  key="hide"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  <EyeOff className="h-4 w-4" aria-hidden />
                </motion.span>
              ) : (
                <motion.span
                  key="show"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex"
                >
                  <Eye className="h-4 w-4" aria-hidden />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
        <FieldError message={error} />
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
