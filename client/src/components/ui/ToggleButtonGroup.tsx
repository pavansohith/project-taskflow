"use client";

import { cn } from "@/lib/utils";

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  className?: string;
  activeClassName?: string;
}

interface ToggleButtonGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  /** Inactive buttons use transparent bg (e.g. inside modals with a single surface color) */
  transparentInactive?: boolean;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  disabled,
  className,
  transparentInactive = false,
}: ToggleButtonGroupProps<T>) {
  return (
    <div
      className={cn("gap-2", className ?? "flex flex-wrap")}
      role="group"
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200",
              transparentInactive
                ? "border-border bg-transparent text-text-secondary hover:bg-bg-elevated/40"
                : "border-border bg-bg-surface text-text-secondary hover:bg-bg-elevated",
              "disabled:cursor-not-allowed disabled:opacity-50",
              isActive && "border-transparent shadow-sm",
              isActive && option.activeClassName,
              !isActive && option.className
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
