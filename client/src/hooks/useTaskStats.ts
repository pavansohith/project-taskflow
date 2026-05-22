"use client";

import { useCallback, useEffect, useState } from "react";
import { get } from "@/lib/axios";
import { getErrorMessage, isUnauthorizedError } from "@/lib/errors";
import { useVisibilityPolling } from "@/hooks/useVisibilityPolling";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, TaskStats } from "@/types";

const DEFAULT_STATS: TaskStats = {
  total: 0,
  completed: 0,
  pending: 0,
  inProgress: 0,
  createdToday: 0,
  completedToday: 0,
};

const POLL_INTERVAL_MS = 30_000;

export function useTaskStats() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<TaskStats>(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [justPolled, setJustPolled] = useState(false);

  const fetchStats = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) return;

      if (!silent) setIsLoading(true);
      setError(null);

      try {
        const data = await get<ApiResponse<TaskStats>>("/api/tasks/stats");
        if (data.data) {
          setStats(data.data);
        }
        if (silent) {
          setJustPolled(true);
        }
      } catch (err) {
        if (isUnauthorizedError(err)) {
          if (!silent) setIsLoading(false);
          return;
        }
        setError(getErrorMessage(err));
        if (!silent) setStats(DEFAULT_STATS);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchStats]);

  useVisibilityPolling(
    () => {
      void fetchStats(true);
    },
    POLL_INTERVAL_MS,
    isAuthenticated
  );

  useEffect(() => {
    if (!justPolled) return;
    const timer = window.setTimeout(() => setJustPolled(false), 5000);
    return () => window.clearTimeout(timer);
  }, [justPolled]);

  return {
    stats,
    isLoading,
    error,
    justPolled,
    /** Silent by default so polling/updates do not swap cards to skeletons */
    refetch: (silent = true) => fetchStats(silent),
  };
}
