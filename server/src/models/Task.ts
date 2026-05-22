import mongoose, {
  Schema,
  type Document,
  type HydratedDocument,
  type Model,
  type Types,
} from "mongoose";

export const TASK_PRIORITIES = ["Low", "Medium", "High"] as const;
export const TASK_STATUSES = ["Todo", "In Progress", "Completed"] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface ITask {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDocument extends Omit<ITask, "_id">, Document {}

export type TaskHydratedDocument = HydratedDocument<TaskDocument>;

interface TaskModel extends Model<TaskDocument, Record<string, never>, Record<string, never>, Record<string, never>, TaskHydratedDocument> {}

const taskSchema = new Schema<TaskDocument, TaskModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: "Medium",
    },
    status: {
      type: String,
      enum: TASK_STATUSES,
      default: "Todo",
    },
    dueDate: {
      type: Date,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ owner: 1, createdAt: -1 });

export const Task = mongoose.model<TaskDocument, TaskModel>("Task", taskSchema);
