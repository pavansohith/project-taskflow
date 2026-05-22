import { cn } from "@/lib/utils";

type TaskFlowLogoSize = "default" | "lg";

const sizeStyles: Record<
  TaskFlowLogoSize,
  { icon: number; text: string; gap: string }
> = {
  default: { icon: 24, text: "text-base", gap: "gap-2.5" },
  lg: { icon: 28, text: "text-xl", gap: "gap-3" },
};

export function TaskFlowLogo({
  className,
  iconOnly = false,
  size = "default",
}: {
  className?: string;
  iconOnly?: boolean;
  size?: TaskFlowLogoSize;
}) {
  const styles = sizeStyles[size];

  return (
    <div className={cn("flex min-w-0 items-center", styles.gap, className)}>
      <svg
        width={styles.icon}
        height={styles.icon}
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
          className="fill-indigo-600"
          opacity="0.9"
        />
        <rect
          x="9"
          y="9"
          width="9"
          height="9"
          rx="2"
          className="fill-indigo-400"
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
        <span
          className={cn(
            "truncate font-semibold tracking-tight text-text-primary",
            styles.text
          )}
        >
          TaskFlow
        </span>
      )}
    </div>
  );
}
