import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex items-center gap-2", className)}>
      <span className="text-xs font-semibold tracking-widest text-text-muted uppercase">
        {title}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
