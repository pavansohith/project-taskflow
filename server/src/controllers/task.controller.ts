import type { Response, NextFunction } from "express";
import mongoose, { type FilterQuery } from "mongoose";
import {
  Task,
  type TaskDocument,
  type TaskPriority,
  type TaskStatus,
} from "../models/Task.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest, CreateTaskBody, UpdateTaskBody } from "../types/index.js";

interface ListTasksQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
}

function getOwnerId(req: AuthRequest): string {
  if (!req.user?.id) {
    throw new AppError("Authentication required", 401);
  }
  return req.user.id;
}

function parseDueDate(
  value: string | Date | null | undefined
): Date | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  return value instanceof Date ? value : new Date(value);
}

function buildOwnerFilter(ownerId: string): FilterQuery<TaskDocument> {
  return { owner: new mongoose.Types.ObjectId(ownerId) };
}

export async function getTasks(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);
    const { search, status, priority, page = 1, limit = 10 } =
      req.query as ListTasksQuery;

    const filter: FilterQuery<TaskDocument> = buildOwnerFilter(ownerId);

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { description: regex }];
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
      Task.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / safeLimit) || 1;

    res.json({
      success: true,
      data: tasks,
      total,
      page: safePage,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
}

export async function getTaskActivity(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);
    const filter = buildOwnerFilter(ownerId);

    const tasks = await Task.find(filter)
      .sort({ updatedAt: -1 })
      .limit(10)
      .select("title status priority updatedAt createdAt");

    const activity = tasks.map((task) => ({
      taskTitle: task.title,
      status: task.status,
      priority: task.priority,
      updatedAt: task.updatedAt,
      createdAt: task.createdAt,
    }));

    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
}

export async function getTaskStats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);
    const filter = buildOwnerFilter(ownerId);

    const [total, completed, pending, inProgress] = await Promise.all([
      Task.countDocuments(filter),
      Task.countDocuments({ ...filter, status: "Completed" }),
      Task.countDocuments({ ...filter, status: "Todo" }),
      Task.countDocuments({ ...filter, status: "In Progress" }),
    ]);

    res.json({
      success: true,
      data: { total, completed, pending, inProgress },
    });
  } catch (error) {
    next(error);
  }
}

export async function createTask(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);
    const { title, description, priority, status, dueDate } =
      req.body as CreateTaskBody;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate: parseDueDate(dueDate),
      owner: ownerId,
    });

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);
    const { title, description, priority, status, dueDate } =
      req.body as UpdateTaskBody;

    const updates: Partial<CreateTaskBody> = {};

    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (status !== undefined) updates.status = status;
    if (dueDate !== undefined) {
      updates.dueDate =
        dueDate === null ? undefined : parseDueDate(dueDate);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: ownerId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = getOwnerId(req);

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: ownerId,
    });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
}
