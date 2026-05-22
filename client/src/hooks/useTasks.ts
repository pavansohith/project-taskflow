"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { appToast } from "@/lib/toast";
import {
  get,
  post,
  put,
  del,
  getErrorMessage,
  type ApiErrorBody,
} from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { useVisibilityPolling } from "@/hooks/useVisibilityPolling";
import { useAuth } from "@/context/AuthContext";
import type {
  ApiResponse,
  CreateTaskInput,
  PaginatedTasksResponse,
  Task,
  TaskFilterPriority,
  TaskFilterStatus,
  UpdateTaskInput,
} from "@/types";

const PAGE_LIMIT = 10;
const POLL_INTERVAL_MS = 30_000;
const MAX_FETCH_ATTEMPTS = 2;

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
  if (status === 401 || status === 403) return false;
  if (status === 500) return true;
  if (!error.response) return true;
  return false;
}

function handleAuthError(
  err: unknown,
  logout: () => Promise<void>
): boolean {
  if (!axios.isAxiosError<ApiErrorBody>(err)) return false;
  if (err.response?.status !== 401) return false;
  void logout();
  return true;
}

export function useTasks() {
  const { isAuthenticated, logout } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);

  const [search, setSearchState] = useState("");
  const [statusFilter, setStatusFilterState] =
    useState<TaskFilterStatus>("all");
  const [priorityFilter, setPriorityFilterState] =
    useState<TaskFilterPriority>("all");

  const debouncedSearch = useDebounce(search, 400);

  const fetchTasks = useCallback(
    async (silent = false) => {
      if (!isAuthenticated) return;

      if (!silent) {
        setIsLoading(true);
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
          params.set("limit", String(PAGE_LIMIT));

          const data = await get<PaginatedTasksResponse>(
            `/api/tasks?${params.toString()}`
          );

          const rawList = Array.isArray(data.data) ? data.data : [];
          const list = deduplicateById(rawList);

          if (rawList.length > list.length) {
            appToast.warning("Duplicate data detected and cleaned");
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

          if (handleAuthError(err, logout)) {
            if (!silent) setIsLoading(false);
            return;
          }

          if (axios.isAxiosError<ApiErrorBody>(err)) {
            const status = err.response?.status;
            const errorCode = err.response?.data?.errorCode;
            const message =
              err.response?.data?.message ?? getErrorMessage(err);

            if (status === 500 && errorCode === "SERVER_FAILURE") {
              if (attempt < MAX_FETCH_ATTEMPTS - 1 && shouldAutoRetry(err)) {
                continue;
              }
              setIsError(true);
              setErrorMessage(message);
              setIsEmpty(false);
              setTasks([]);
              if (!silent) setIsLoading(false);
              return;
            }
          }

          if (attempt < MAX_FETCH_ATTEMPTS - 1 && shouldAutoRetry(err)) {
            continue;
          }

          setIsError(true);
          setErrorMessage(getErrorMessage(err));
          setIsEmpty(false);
          setTasks([]);
          if (!silent) setIsLoading(false);
          return;
        }
      }

      if (lastError) {
        setIsError(true);
        setErrorMessage(getErrorMessage(lastError));
        setTasks([]);
      }
      if (!silent) setIsLoading(false);
    },
    [
      isAuthenticated,
      logout,
      debouncedSearch,
      statusFilter,
      priorityFilter,
      currentPage,
    ]
  );

  const retry = useCallback(() => {
    void fetchTasks();
  }, [fetchTasks]);

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
    setPage,
    setSearch,
    setStatusFilter,
    setPriorityFilter,
  };
}
