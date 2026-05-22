/**
 * TaskFlow design system tokens (TypeScript).
 * CSS variables live in globals.css; keep values in sync when changing palette.
 */

export const palette = {
  primary: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  accent: {
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
  },
  success: {
    50: "#ecfdf5",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  danger: {
    50: "#fff1f2",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
} as const;

/** 8px base grid — use multiples for layout rhythm */
export const spacing = {
  0: "0",
  1: "0.25rem", /* 4px — half step */
  2: "0.5rem", /* 8px */
  3: "0.75rem", /* 12px */
  4: "1rem", /* 16px */
  5: "1.25rem", /* 20px */
  6: "1.5rem", /* 24px */
  8: "2rem", /* 32px */
  10: "2.5rem", /* 40px */
  12: "3rem", /* 48px */
  16: "4rem", /* 64px */
} as const;

export const typography = {
  fontFamily: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  fontFeatureSettings: "'cv02', 'cv03', 'cv04', 'cv11'",
  scale: {
    display: {
      size: "2.25rem",
      lineHeight: "2.5rem",
      weight: "700",
      tracking: "-0.025em",
    },
    h2: {
      size: "1.5rem",
      lineHeight: "2rem",
      weight: "600",
      tracking: "-0.025em",
    },
    h3: {
      size: "1.125rem",
      lineHeight: "1.75rem",
      weight: "500",
    },
    body: {
      size: "0.875rem",
      lineHeight: "1.625rem",
      weight: "400",
    },
    label: {
      size: "0.75rem",
      lineHeight: "1rem",
      weight: "500",
      tracking: "0.05em",
    },
    mono: {
      size: "0.75rem",
      lineHeight: "1rem",
    },
  },
} as const;

export const radii = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1rem",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
  md: "0 4px 6px -1px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06)",
  lg: "0 10px 15px -3px rgb(15 23 42 / 0.08), 0 4px 6px -4px rgb(15 23 42 / 0.06)",
  xl: "0 20px 25px -5px rgb(15 23 42 / 0.08), 0 8px 10px -6px rgb(15 23 42 / 0.06)",
} as const;

export const theme = {
  palette,
  spacing,
  typography,
  radii,
  shadows,
} as const;

export type Theme = typeof theme;
