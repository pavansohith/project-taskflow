"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, type ThemePreference } from "@/lib/preferences";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark" || stored === "system") {
      return stored;
    }
  } catch {
    /* private browsing */
  }
  return "system";
}

export function resolveAppliedTheme(preference: ThemePreference): Theme {
  if (preference === "light" || preference === "dark") {
    return preference;
  }
  return getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function readThemeFromDom(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getInitialPreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  return resolveThemePreference();
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return readThemeFromDom();
}

export type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeState(): ThemeContextValue {
  const [preference, setPreference] =
    useState<ThemePreference>(getInitialPreference);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const syncTimer = window.setTimeout(() => {
      const pref = resolveThemePreference();
      const resolved = resolveAppliedTheme(pref);
      setPreference(pref);
      setTheme(resolved);
      applyTheme(resolved);
    }, 0);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      const pref = resolveThemePreference();
      if (pref !== "system") return;
      const system = getSystemTheme();
      setTheme(system);
      applyTheme(system);
    };

    mq.addEventListener("change", onSystemChange);
    return () => {
      window.clearTimeout(syncTimer);
      mq.removeEventListener("change", onSystemChange);
    };
  }, []);

  const setThemePreference = useCallback((next: ThemePreference) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    const resolved = resolveAppliedTheme(next);
    setPreference(next);
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    const resolved = theme === "dark" ? "light" : "dark";
    setThemePreference(resolved);
  }, [theme, setThemePreference]);

  return { theme, preference, setThemePreference, toggleTheme };
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
