export function NoTasksIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className ?? "mx-auto h-24 w-40 text-primary-400 dark:text-primary-600"}
      aria-hidden
    >
      <rect
        x="24"
        y="20"
        width="112"
        height="72"
        rx="12"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="40"
        y="40"
        width="72"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.35"
      />
      <rect
        x="40"
        y="56"
        width="56"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.25"
      />
      <rect
        x="40"
        y="70"
        width="40"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="48" cy="88" r="5" fill="currentColor" opacity="0.5" />
      <path
        d="M100 28 L108 36 L124 20"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.45"
      />
    </svg>
  );
}
