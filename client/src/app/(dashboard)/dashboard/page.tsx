"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { format } from "date-fns";
import {
  CalendarDays,
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
import { TaskListSkeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { useTaskStats } from "@/hooks/useTaskStats";
import { useTasks } from "@/hooks/useTasks";
import { getGreeting } from "@/lib/greeting";
import { getErrorMessage } from "@/lib/utils";
import { SlowLoadingState } from "@/components/ui/SlowLoadingState";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { ITask, TaskStatus } from "@/types";

function DashboardSectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="shrink-0 text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
        {title}
      </span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

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
    isSlowLoading,
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
    cancelLoading,
    dismissSlowLoading,
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

  const todayLabel = useMemo(
    () => format(new Date(), "EEEE, MMMM d"),
    []
  );

  const taskCountLabel = useMemo(() => {
    if (isLoading) return "Loading…";
    return `${total} task${total === 1 ? "" : "s"}`;
  }, [isLoading, total]);

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
  const isMobile = useMediaQuery("(max-width: 1023px)");

  const statsCards = (
    <>
      <StatsCard
        className="h-full"
        title="Total"
        value={stats.total}
        icon={ListTodo}
        variant="indigo"
        trend={totalTrend}
        isLoading={statsLoading}
        error={statsSharedError}
        onRetry={() => void refetch(false)}
        celebrate={celebrateTotal}
      />
      <StatsCard
        className="h-full"
        title="Completed"
        value={stats.completed}
        icon={CheckCircle2}
        variant="emerald"
        trend={completedTrend}
        isLoading={statsLoading}
        error={statsSharedError}
        onRetry={() => void refetch(false)}
      />
      <StatsCard
        className="h-full"
        title="Pending"
        value={stats.pending}
        icon={Circle}
        variant="amber"
        trend={pollTrend}
        isLoading={statsLoading}
        error={statsSharedError}
        onRetry={() => void refetch(false)}
      />
      <StatsCard
        className="h-full"
        title="In Progress"
        value={stats.inProgress}
        icon={Clock}
        variant="violet"
        trend={pollTrend}
        isLoading={statsLoading}
        error={statsSharedError}
        onRetry={() => void refetch(false)}
      />
    </>
  );

  const taskListContent = (
    <>
      {isError && errorMessage ? (
        <div className="px-4 py-8 sm:px-5">
          <ErrorState
            title="Unable to load tasks"
            message={errorMessage}
            onRetry={retry}
            compact
          />
        </div>
      ) : isLoading ? (
        isSlowLoading ? (
          <SlowLoadingState
            onCancel={cancelLoading}
            onKeepWaiting={dismissSlowLoading}
          />
        ) : (
          <TaskListSkeleton rows={5} />
        )
      ) : isEmpty ? (
        <div className="px-4 py-8 sm:px-5">
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
        </div>
      ) : (
        <>
          <TaskTable
            embedded
            tasks={tasks}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            isUpdatingId={updatingId}
          />
          <Pagination
            embedded
            page={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {greeting}
          </h1>
          <p className="mt-2 text-base text-text-muted">
            Here&apos;s what&apos;s happening with your tasks today.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5 rounded-lg border border-border bg-bg-surface px-5 py-3 shadow-[var(--shadow-card)] dark:shadow-none">
          <CalendarDays
            className="h-4 w-4 shrink-0 text-indigo-400"
            strokeWidth={1.5}
            aria-hidden
          />
          <span className="text-base font-medium text-text-secondary">{todayLabel}</span>
        </div>
      </header>

      <section>
        <DashboardSectionHeading title="Overview" />
        {isMobile ? (
          <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2">
            {statsCards}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={staggerItem} className="h-full">
              <StatsCard
                className="h-full"
                title="Total"
                value={stats.total}
                icon={ListTodo}
                variant="indigo"
                trend={totalTrend}
                isLoading={statsLoading}
                error={statsSharedError}
                onRetry={() => void refetch(false)}
                celebrate={celebrateTotal}
              />
            </motion.div>
            <motion.div variants={staggerItem} className="h-full">
              <StatsCard
                className="h-full"
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                variant="emerald"
                trend={completedTrend}
                isLoading={statsLoading}
                error={statsSharedError}
                onRetry={() => void refetch(false)}
              />
            </motion.div>
            <motion.div variants={staggerItem} className="h-full">
              <StatsCard
                className="h-full"
                title="Pending"
                value={stats.pending}
                icon={Circle}
                variant="amber"
                trend={pollTrend}
                isLoading={statsLoading}
                error={statsSharedError}
                onRetry={() => void refetch(false)}
              />
            </motion.div>
            <motion.div variants={staggerItem} className="h-full">
              <StatsCard
                className="h-full"
                title="In Progress"
                value={stats.inProgress}
                icon={Clock}
                variant="violet"
                trend={pollTrend}
                isLoading={statsLoading}
                error={statsSharedError}
                onRetry={() => void refetch(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs font-semibold tracking-[0.12em] text-text-muted uppercase">
            Tasks
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-muted">{taskCountLabel}</span>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-md bg-indigo-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-indigo-500"
            >
              <Plus className="h-[15px] w-[15px]" strokeWidth={1.5} />
              New Task
            </button>
          </div>
        </div>
        <div className="mb-6 h-px w-full bg-border-subtle" aria-hidden />

        <div className="overflow-hidden rounded-xl border border-border bg-bg-surface shadow-[var(--shadow-card)] dark:shadow-none">
          <FilterBar
            embedded
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

          {isMobile ? (
            <div key={filterKey}>{taskListContent}</div>
          ) : (
            <motion.div
              key={filterKey}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {taskListContent}
            </motion.div>
          )}
        </div>
      </section>

      <RecentActivity
        activity={activity}
        isLoading={activityLoading}
        error={activityError}
        onRetry={refetchActivity}
      />

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
    </div>
  );
}
