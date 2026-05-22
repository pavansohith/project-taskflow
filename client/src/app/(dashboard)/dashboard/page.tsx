"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ListTodo,
  Plus,
} from "lucide-react";
import { appToast } from "@/lib/toast";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Pagination } from "@/components/dashboard/Pagination";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TaskForm } from "@/components/dashboard/TaskForm";
import { TaskTable } from "@/components/dashboard/TaskTable";
import { Button } from "@/components/ui/Button";
import { TaskListSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTaskStats } from "@/hooks/useTaskStats";
import { useTasks } from "@/hooks/useTasks";
import { getGreeting } from "@/lib/greeting";
import { getErrorMessage } from "@/lib/axios";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { ITask, TaskStatus } from "@/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    stats,
    isLoading: statsLoading,
    error: statsError,
    justPolled,
    refetch,
  } = useTaskStats();

  const totalTrend =
    stats.createdToday > 0
      ? `+ ${stats.createdToday} today`
      : "No new tasks today";
  const completedTrend =
    stats.completedToday > 0
      ? `+ ${stats.completedToday} today`
      : "None today";
  const pollTrend = justPolled ? "Updated just now" : undefined;
  const {
    activity,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useRecentActivity();

  const {
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
    setSearch,
    setStatusFilter,
    setPriorityFilter,
    setPage,
    retry,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ITask | undefined>(undefined);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [celebrateTotal, setCelebrateTotal] = useState(false);

  const filterKey = useMemo(
    () => `${search}|${statusFilter}|${priorityFilter}`,
    [search, statusFilter, priorityFilter]
  );

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all";

  const greeting = useMemo(
    () => getGreeting(user?.name ?? "there"),
    [user?.name]
  );

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }, [setSearch, setStatusFilter, setPriorityFilter]);

  const handleOpenCreate = useCallback(() => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  }, []);

  const handleOpenEdit = useCallback((task: ITask) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTask(id);
        appToast.success("Task deleted");
        void refetchActivity();
        void refetch();
      } catch (err) {
        appToast.error(getErrorMessage(err));
      }
    },
    [deleteTask, refetch, refetchActivity]
  );

  const handleStatusChange = useCallback(
    async (id: string, status: TaskStatus) => {
      setUpdatingId(id);
      try {
        await updateTask(id, { status });
        appToast.success("Status updated");
        void refetchActivity();
        void refetch();
      } catch (err) {
        appToast.error(getErrorMessage(err));
      } finally {
        setUpdatingId(null);
      }
    },
    [updateTask, refetch, refetchActivity]
  );

  const handleFormSuccess = useCallback(() => {
    const wasCreate = !editingTask;
    handleCloseForm();
    void refetch();
    void refetchActivity();
    if (wasCreate) {
      setCelebrateTotal(true);
      window.setTimeout(() => setCelebrateTotal(false), 1000);
    }
  }, [editingTask, handleCloseForm, refetch, refetchActivity]);

  const statsSharedError = statsError;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-text-primary">
          {greeting}
        </h1>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-text-secondary">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800 dark:text-text-primary">
          Overview
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Total"
              value={stats.total}
              icon={ListTodo}
              variant="indigo"
              trend={totalTrend}
              isLoading={statsLoading}
              error={statsSharedError}
              onRetry={refetch}
              celebrate={celebrateTotal}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              variant="emerald"
              trend={completedTrend}
              isLoading={statsLoading}
              error={statsSharedError}
              onRetry={refetch}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Circle}
              variant="amber"
              trend={pollTrend}
              isLoading={statsLoading}
              error={statsSharedError}
              onRetry={refetch}
            />
          </motion.div>
          <motion.div variants={staggerItem}>
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon={Clock}
              variant="violet"
              trend={pollTrend}
              isLoading={statsLoading}
              error={statsSharedError}
              onRetry={refetch}
            />
          </motion.div>
        </motion.div>
      </section>

      <RecentActivity
        activity={activity}
        isLoading={activityLoading}
        error={activityError}
        onRetry={refetchActivity}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              Tasks
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {isLoading
                ? "Loading…"
                : `${total} task${total === 1 ? "" : "s"} total`}
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="min-h-11 w-full shrink-0 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          onClear={clearFilters}
          hasActiveFilters={hasActiveFilters}
          total={total}
          isLoading={isLoading}
        />

        <motion.div
          key={filterKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isError && errorMessage ? (
            <ErrorState message={errorMessage} onRetry={retry} />
          ) : isLoading ? (
            <TaskListSkeleton rows={5} />
          ) : isEmpty ? (
            <EmptyState
              title={hasActiveFilters ? "No matching tasks" : "No tasks yet"}
              description={
                hasActiveFilters
                  ? "Try adjusting your search or filters."
                  : "Create your first task to get started."
              }
              actionLabel={hasActiveFilters ? undefined : "Create task"}
              onAction={hasActiveFilters ? undefined : handleOpenCreate}
            />
          ) : (
            <>
              <TaskTable
                tasks={tasks}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                isUpdatingId={updatingId}
              />
              <Pagination
                className="mt-4"
                page={currentPage}
                totalPages={totalPages}
                total={total}
                onPageChange={setPage}
              />
            </>
          )}
        </motion.div>
      </section>

      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            key={editingTask?._id ?? "create"}
            task={editingTask}
            createTask={createTask}
            updateTask={updateTask}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
