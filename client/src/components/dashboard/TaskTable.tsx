"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
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
  embedded?: boolean;
}

const badgeClass = "px-2.5 py-1 text-xs";

function DueDateCell({ dueDate }: { dueDate?: string }) {
  const tone = getDueDateTone(dueDate);
  return (
    <span className={dueDateTextClass[tone]}>
      {dueDate ? formatDate(dueDate) : "—"}
    </span>
  );
}

function RowActions({
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
  const btn =
    "flex h-7 w-7 items-center justify-center rounded-md text-text-muted opacity-100 transition-all duration-150 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-bg-elevated hover:text-text-primary disabled:opacity-40";

  return (
    <div className="flex items-center justify-end gap-0.5">
      <button
        type="button"
        onClick={() => onEdit(task)}
        disabled={disabled}
        className={btn}
        title="Edit task"
        aria-label={`Edit ${task.title}`}
      >
        <Pencil className="h-[15px] w-[15px]" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(task)}
        disabled={disabled}
        className={cn(btn, "hover:bg-rose-500/10 hover:text-rose-400")}
        title="Delete task"
        aria-label={`Delete ${task.title}`}
      >
        <Trash2 className="h-[15px] w-[15px]" strokeWidth={1.5} />
      </button>
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
        "group border-b border-border px-5 py-4 last:border-b-0",
        overdue && "border-l-2 border-l-rose-500"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-medium text-text-primary">{task.title}</h3>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">
              {task.description}
            </p>
          )}
        </div>
        <RowActions
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
          className={badgeClass}
        />
        <StatusPopover
          status={task.status}
          isOpen={statusOpenId === task._id}
          disabled={isUpdating}
          onOpen={() => setStatusOpenId(task._id)}
          onClose={() => setStatusOpenId(null)}
          onSelect={(s) => onStatusChange(task._id, s)}
        />
      </div>
      <div className="mt-2">
        <DueDateCell dueDate={task.dueDate} />
      </div>
    </motion.article>
  );
}

export const TaskTable = memo(function TaskTable({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  isUpdatingId,
  embedded = false,
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

  const thClass =
    "px-5 py-3 text-left text-[11px] font-semibold tracking-widest text-text-muted uppercase";

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col lg:hidden"
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

      <div className={cn("hidden lg:block", !embedded && "overflow-hidden rounded-xl border border-border shadow-[var(--shadow-card)] dark:shadow-none")}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-elevated">
                <th className={thClass}>Title</th>
                <th className={thClass}>Status</th>
                <th className={thClass}>Priority</th>
                <th className={thClass}>Due Date</th>
                <th className={cn(thClass, "text-right")}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const overdue = isTaskOverdue(task.dueDate, task.status);
                const isUpdating = isUpdatingId === task._id;

                return (
                  <motion.tr
                    key={task._id}
                    variants={staggerItem}
                    className={cn(
                      "group border-b border-border transition-colors duration-150 last:border-b-0 hover:bg-bg-elevated",
                      overdue && "border-l-2 border-l-rose-500"
                    )}
                  >
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-text-primary">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-text-muted">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPopover
                        status={task.status}
                        isOpen={statusOpenId === task._id}
                        disabled={isUpdating}
                        onOpen={() => setStatusOpenId(task._id)}
                        onClose={() => setStatusOpenId(null)}
                        onSelect={(s) => onStatusChange(task._id, s)}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        label={task.priority}
                        kind="priority"
                        value={task.priority}
                        className={badgeClass}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <DueDateCell dueDate={task.dueDate} />
                    </td>
                    <td className="px-5 py-4">
                      <RowActions
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
