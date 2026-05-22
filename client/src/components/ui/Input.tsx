"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { FieldError } from "@/components/ui/FieldError";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-ring dark:border-border dark:bg-bg-surface dark:text-text-primary dark:placeholder:text-text-muted",
            "focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:border-primary-500 dark:focus:ring-primary-500/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-danger-500 focus:border-danger-500 focus:ring-danger-500/50",
            className
          )}
          {...props}
        />
        <FieldError message={error} />
      </div>
    );
  }
);

Input.displayName = "Input";
