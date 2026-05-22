import type { Request } from "express";
import type { TaskPriority, TaskStatus } from "../models/Task.js";

export type { IUser } from "../models/User.js";
export type { ITask, TaskPriority, TaskStatus } from "../models/Task.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError extends Error {
  statusCode?: number;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | Date;
}

export interface UpdateTaskBody {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | Date | null;
}
