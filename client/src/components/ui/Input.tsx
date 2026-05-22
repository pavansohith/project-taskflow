"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
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
            className="text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-lg border border-border bg-bg-surface px-3 text-sm text-text-primary placeholder:text-text-muted transition-ring",
            "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error &&
              "border-danger-500 focus:border-danger-500 focus:ring-danger-500/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger-600 dark:text-danger-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
