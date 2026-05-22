"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { appToast } from "@/lib/toast";
import { get, post, put, del } from "@/lib/axios";
import {
  getErrorMessage,
  isUnauthorizedError,
  type ApiErrorBody,
} from "@/lib/errors";
import { useDebounce } from "@/hooks/useDebounce";
import { useVisibilityPolling } from "@/hooks/useVisibilityPolling";
import { useAuth } from "@/context/AuthContext";
import { getTasksPerPage } from "@/lib/preferences";
import type {
  ApiResponse,
  CreateTaskInput,
  PaginatedTasksResponse,
  Task,
  TaskFilterPriority,
  TaskFilterStatus,
  UpdateTaskInput,
} from "@/types";

const POLL_INTERVAL_MS = 30_000;
const MAX_FETCH_ATTEMPTS = 2;
const LOADING_TIMEOUT_MS = 8_000;

function deduplicateById(taskList: Task[]): Task[] {
  const seen = new Set<string>();
  return taskList.filter((task) => {
    const id = String(task._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function shouldAutoRetry(error: unknown): boolean {
  if (!axios.isAxiosError<ApiErrorBody>(error)) return true;
  const status = error.response?.status;
  if (status && status >= 400 && status < 500) return false;
  if (status === 500) return true;
  if (!error.response) return true;
  return false;
}

function resolveTasksErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;

    if (status === 500 || errorCode === "SERVER_FAILURE") {
      return "The server returned an error.";
    }
  }

  return getErrorMessage(error);
}

export function useTasks() {
  const { isAuthenticated } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const [search, setSearchState] = useState("");
  const [statusFilter, setStatusFilterState] =
    useState<TaskFilterStatus>("all");
  const [priorityFilter, setPriorityFilterState] =
    useState<TaskFilterPriority>("all");
  const [pageLimit, setPageLimit] = useState(() =>
    typeof window !== "undefined" ? getTasksPerPage() : 10
  );

  const fetchGenerationRef = useRef(0);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const onSettingsChange = () => {
      setPageLimit(getTasksPerPage());
      setCurrentPage(1);
    };
    window.addEventListener("taskflow-settings-change", onSettingsChange);
    return () =>
      window.removeEventListener("taskflow-settings-change", onSettingsChange);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsSlowLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setIsSlowLoading(true);
    }, LOADING_TIMEOUT_MS);

    return () => window.clearTimeout(timer);
  }, [isLoading]);

  const fetchTasks = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) return;

      const generation = ++fetchGenerationRef.current;

      if (!silent) {
        setIsLoading(true);
        setIsSlowLoading(false);
      }
      setIsError(false);
      setErrorMessage(null);

      let lastError: unknown = null;

      for (let attempt = 0; attempt < MAX_FETCH_ATTEMPTS; attempt++) {
        try {
          const params = new URLSearchParams();
          if (debouncedSearch.trim()) {
            params.set("search", debouncedSearch.trim());
          }
          if (statusFilter !== "all") {
            params.set("status", statusFilter);
          }
          if (priorityFilter !== "all") {
            params.set("priority", priorityFilter);
          }
          params.set("page", String(currentPage));
          params.set("limit", String(pageLimit));

          const data = await get<PaginatedTasksResponse>(
            `/api/tasks?${params.toString()}`
          );

          if (generation !== fetchGenerationRef.current) return;

          const rawList = Array.isArray(data.data) ? data.data : [];
          const list = deduplicateById(rawList);

          if (rawList.length > list.length) {
            appToast.warning(
              "Duplicate data detected and cleaned automatically"
            );
          }

          setTasks(list);
          setTotal(typeof data.total === "number" ? data.total : list.length);
          setTotalPages(
            typeof data.totalPages === "number"
              ? Math.max(data.totalPages, 1)
              : 1
          );
          setIsEmpty(list.length === 0);
          setIsError(false);
          setErrorMessage(null);

          if (
            typeof data.totalPages === "number" &&
            currentPage > data.totalPages &&
            data.totalPages > 0
          ) {
            setCurrentPage(data.totalPages);
          }

          if (!silent) setIsLoading(false);
          return;
        } catch (err) {
          lastError = err;

          if (isUnauthorizedError(err)) {
            if (!silent) setIsLoading(false);
            return;
          }

          if (attempt < MAX_FETCH_ATTEMPTS - 1 && shouldAutoRetry(err)) {
            continue;
          }

          if (generation !== fetchGenerationRef.current) return;

          setIsError(true);
          setErrorMessage(resolveTasksErrorMessage(err));
          setIsEmpty(false);
          setTasks([]);
          if (!silent) setIsLoading(false);
          return;
        }
      }

      if (lastError && generation === fetchGenerationRef.current) {
        setIsError(true);
        setErrorMessage(resolveTasksErrorMessage(lastError));
        setTasks([]);
      }
      if (!silent) setIsLoading(false);
    },
    [
      isAuthenticated,
      debouncedSearch,
      statusFilter,
      priorityFilter,
      currentPage,
      pageLimit,
    ]
  );

  const retry = useCallback(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const cancelLoading = useCallback(() => {
    fetchGenerationRef.current += 1;
    setIsLoading(false);
    setIsSlowLoading(false);
  }, []);

  const dismissSlowLoading = useCallback(() => {
    setIsSlowLoading(false);
  }, []);

  const setPage = useCallback((n: number) => {
    setCurrentPage(Math.max(1, n));
  }, []);

  const setSearch = useCallback((s: string) => {
    setSearchState(s);
    setCurrentPage(1);
  }, []);

  const setStatusFilter = useCallback((status: TaskFilterStatus) => {
    setStatusFilterState(status);
    setCurrentPage(1);
  }, []);

  const setPriorityFilter = useCallback((priority: TaskFilterPriority) => {
    setPriorityFilterState(priority);
    setCurrentPage(1);
  }, []);

  const createTask = useCallback(
    async (data: CreateTaskInput) => {
      const response = await post<ApiResponse<Task>>("/api/tasks", data);
      await fetchTasks(true);
      return response.data;
    },
    [fetchTasks]
  );

  const updateTask = useCallback(
    async (id: string, data: UpdateTaskInput) => {
      const response = await put<ApiResponse<Task>>(`/api/tasks/${id}`, data);
      await fetchTasks(true);
      return response.data;
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await del<ApiResponse<{ message: string }>>(`/api/tasks/${id}`);
      await fetchTasks(true);
    },
    [fetchTasks]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchTasks();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [fetchTasks]);

  useVisibilityPolling(
    () => {
      void fetchTasks(true);
    },
    POLL_INTERVAL_MS,
    isAuthenticated
  );

  return {
    tasks,
    total,
    totalPages,
    currentPage,
    isLoading,
    isSlowLoading,
    isError,
    errorMessage,
    isEmpty,
    search,
    statusFilter,
    priorityFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    retry,
    cancelLoading,
    dismissSlowLoading,
    setPage,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
  };
}
