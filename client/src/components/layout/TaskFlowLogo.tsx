import { cn } from "@/lib/utils";

export function TaskFlowLogo({
  className,
  iconOnly = false,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect
          x="2"
          y="2"
          width="9"
          height="9"
          rx="2"
          className="fill-primary-600"
          opacity="0.9"
        />
        <rect
          x="9"
          y="9"
          width="9"
          height="9"
          rx="2"
          className="fill-primary-400"
          opacity="0.75"
        />
        <path
          d="M5.5 10.5L7.5 12.5L11 8.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!iconOnly && (
        <span className="text-sm font-semibold text-text-primary">TaskFlow</span>
      )}
    </div>
  );
}
