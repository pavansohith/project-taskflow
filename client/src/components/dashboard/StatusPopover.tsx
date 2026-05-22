"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const STATUS_OPTIONS: TaskStatus[] = ["Todo", "In Progress", "Completed"];

const statusIcons: Record<TaskStatus, React.ReactNode> = {
  Todo: <Circle className="h-3 w-3" aria-hidden />,
  "In Progress": <Clock className="h-3 w-3" aria-hidden />,
  Completed: <CheckCircle2 className="h-3 w-3" aria-hidden />,
};

interface StatusPopoverProps {
  status: TaskStatus;
  isOpen: boolean;
  disabled?: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (status: TaskStatus) => void;
  className?: string;
}

export function StatusPopover({
  status,
  isOpen,
  disabled,
  onOpen,
  onClose,
  onSelect,
  className,
}: StatusPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="rounded-full transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Change status (current: ${status})`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Badge
          label={status}
          kind="status"
          value={status}
          icon={statusIcons[status]}
        />
      </button>

      {isOpen && (
        <motion.ul
          role="listbox"
          variants={scaleIn}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute left-0 top-full z-30 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-border bg-bg-surface py-1 shadow-lg"
        >
          {STATUS_OPTIONS.map((option) => (
            <li key={option} role="option" aria-selected={option === status}>
              <button
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-bg-elevated",
                  option === status && "bg-bg-elevated font-medium"
                )}
                onClick={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Badge
                  label={option}
                  kind="status"
                  value={option}
                  icon={statusIcons[option]}
                />
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
