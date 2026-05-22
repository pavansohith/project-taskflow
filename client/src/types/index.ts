export type TaskStatus = "Todo" | "In Progress" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High";

export type TaskFilterStatus = TaskStatus | "all";

export type TaskFilterPriority = TaskPriority | "all";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

/** Alias for task entities (e.g. forms, API models). */
export type ITask = Task;

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  createdToday: number;
  completedToday: number;
}

export interface TaskActivityItem {
  taskTitle: string;
  status: TaskStatus;
  priority: TaskPriority;
  updatedAt: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: string;
}

export interface PaginatedTasksResponse {
  success: boolean;
  data: Task[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string | null;
}

export interface TaskFilters {
  search: string;
  status: TaskFilterStatus;
  priority: TaskFilterPriority;
  page: number;
  limit: number;
}
