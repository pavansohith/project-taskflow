"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-500 focus-visible:ring-primary-500",
  secondary:
    "border border-border bg-transparent text-text-primary hover:bg-white/5 focus-visible:ring-primary-500 dark:hover:bg-white/5",
  danger:
    "border border-danger-500/50 bg-transparent text-danger-500 hover:bg-danger-500/10 focus-visible:ring-danger-500",
  ghost:
    "bg-transparent text-text-secondary hover:bg-white/5 hover:text-text-primary focus-visible:ring-primary-500 dark:hover:bg-white/5",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm [&_svg]:size-3.5",
  md: "h-8 gap-1.5 px-3 py-1.5 text-sm [&_svg]:size-3.5",
  lg: "h-9 gap-2 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <span
            className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
