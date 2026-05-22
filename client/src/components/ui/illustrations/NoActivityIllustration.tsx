export function NoActivityIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      className={className ?? "mx-auto h-20 w-32 text-primary-400 dark:text-primary-600"}
      aria-hidden
    >
      <line
        x1="28"
        y1="16"
        x2="28"
        y2="64"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.25"
      />
      <circle cx="28" cy="24" r="5" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="44" r="5" fill="currentColor" opacity="0.35" />
      <circle cx="28" cy="60" r="5" fill="currentColor" opacity="0.2" />
      <rect
        x="44"
        y="20"
        width="56"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="44"
        y="36"
        width="44"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.22"
      />
      <rect
        x="44"
        y="52"
        width="36"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}
