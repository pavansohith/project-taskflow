"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { StatusPopover } from "@/components/dashboard/StatusPopover";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { dueDateTextClass, getDueDateTone, isTaskOverdue } from "@/lib/dueDate";
import { cn, formatDate } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void | Promise<void>;
  onStatusChange: (id: string, status: TaskStatus) => void;
  isUpdatingId?: string | null;
}

function DueDateCell({ dueDate }: { dueDate?: string }) {
  const tone = getDueDateTone(dueDate);
  return (
    <span className={cn("text-sm", dueDateTextClass[tone])}>
      {dueDate ? formatDate(dueDate) : "—"}
    </span>
  );
}

function TaskActions({
  task,
  onEdit,
  onDelete,
  disabled,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(task)}
        disabled={disabled}
        className="h-11 w-11 min-h-11 min-w-11 p-0"
        title="Edit task"
        aria-label={`Edit ${task.title}`}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(task)}
        disabled={disabled}
        className="h-11 w-11 min-h-11 min-w-11 p-0 text-danger-600 hover:text-danger-600"
        title="Delete task"
        aria-label={`Delete ${task.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function TaskCardMobile({
  task,
  statusOpenId,
  setStatusOpenId,
  isUpdating,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  task: Task;
  statusOpenId: string | null;
  setStatusOpenId: (id: string | null) => void;
  isUpdating: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}) {
  const overdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <motion.article
      variants={staggerItem}
      className={cn(
        "rounded-xl border border-border bg-bg-surface p-4 shadow-sm",
        overdue && "border-l-4 border-l-danger-500"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-text-primary">{task.title}</h3>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-xs text-text-muted">
              {task.description}
            </p>
          )}
        </div>
        <TaskActions
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          disabled={isUpdating}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge
          label={task.priority}
          kind="priority"
          value={task.priority}
          showDot
        />
        <StatusPopover
          status={task.status}
          isOpen={statusOpenId === task._id}
          disabled={isUpdating}
          onOpen={() => setStatusOpenId(task._id)}
          onClose={() => setStatusOpenId(null)}
          onSelect={(status) => onStatusChange(task._id, status)}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
        <DueDateCell dueDate={task.dueDate} />
        <span className="text-mono-data">
          {formatDate(task.createdAt, "MMM d")}
        </span>
      </div>

      <p className="mt-2 text-center text-[10px] text-text-muted/80">
        Swipe for actions — coming soon
      </p>
    </motion.article>
  );
}

export const TaskTable = memo(function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdatingId,
}: TaskTableProps) {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusOpenId, setStatusOpenId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(taskToDelete._id);
      setTaskToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Mobile cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-3 lg:hidden"
      >
        {tasks.map((task) => (
          <TaskCardMobile
            key={task._id}
            task={task}
            statusOpenId={statusOpenId}
            setStatusOpenId={setStatusOpenId}
            isUpdating={isUpdatingId === task._id}
            onEdit={onEdit}
            onDelete={setTaskToDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </motion.div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-bg-surface lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 dark:border-border dark:bg-bg-elevated/80">
              <tr>
                <th className="px-4 py-3 text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Title
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Priority
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Due Date
                </th>
                <th className="px-4 py-3 text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium tracking-widest text-slate-500 uppercase dark:text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border">
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task.dueDate, task.status);
                const isUpdating = isUpdatingId === task._id;

                return (
                  <motion.tr
                    key={task._id}
                    variants={staggerItem}
                    className={cn(
                      "transition-colors hover:bg-slate-50 dark:hover:bg-bg-elevated",
                      overdue && "border-l-4 border-l-danger-500"
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-text-primary">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-text-muted">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        label={task.priority}
                        kind="priority"
                        value={task.priority}
                        showDot
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusPopover
                        status={task.status}
                        isOpen={statusOpenId === task._id}
                        disabled={isUpdating}
                        onOpen={() => setStatusOpenId(task._id)}
                        onClose={() => setStatusOpenId(null)}
                        onSelect={(status) =>
                          onStatusChange(task._id, status)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <DueDateCell dueDate={task.dueDate} />
                    </td>
                    <td className="px-4 py-3 text-mono-data text-text-secondary">
                      {formatDate(task.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <TaskActions
                        task={task}
                        onEdit={onEdit}
                        onDelete={setTaskToDelete}
                        disabled={isUpdating}
                      />
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={taskToDelete !== null}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete task?"
        message={
          taskToDelete
            ? `Delete "${taskToDelete.title}"? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </>
  );
});
