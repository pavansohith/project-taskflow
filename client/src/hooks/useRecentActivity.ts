"use client";

import { useCallback, useEffect, useState } from "react";
import { get } from "@/lib/axios";
import { getErrorMessage, isUnauthorizedError } from "@/lib/errors";
import { useVisibilityPolling } from "@/hooks/useVisibilityPolling";
import { useAuth } from "@/hooks/useAuth";
import type { ApiResponse, TaskActivityItem } from "@/types";

const POLL_INTERVAL_MS = 30_000;

export function useRecentActivity() {
  const { isAuthenticated } = useAuth();
  const [activity, setActivity] = useState<TaskActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) return;

      if (!silent) setIsLoading(true);
      setError(null);

      try {
        const data = await get<ApiResponse<TaskActivityItem[]>>(
          "/api/tasks/activity"
        );
        setActivity(data.data ?? []);
      } catch (err) {
        if (isUnauthorizedError(err)) {
          if (!silent) setIsLoading(false);
          return;
        }
        setError(getErrorMessage(err));
        if (!silent) setActivity([]);
      } finally {
        if (!silent) setIsLoading(false);
      }
    },
    [isAuthenticated]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchActivity();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchActivity]);

  useVisibilityPolling(
    () => {
      void fetchActivity(true);
    },
    POLL_INTERVAL_MS,
    isAuthenticated
  );

  return {
    activity,
    isLoading,
    error,
    refetch: () => fetchActivity(),
  };
}
