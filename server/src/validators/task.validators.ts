import { body, param, query } from "express-validator";
import { TASK_PRIORITIES, TASK_STATUSES } from "../models/Task.js";

export const listTasksValidation = [
  query("search")
    .optional()
    .trim()
    .isString()
    .withMessage("Search must be a string"),
  query("status")
    .optional()
    .isIn([...TASK_STATUSES])
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`),
  query("priority")
    .optional()
    .isIn([...TASK_PRIORITIES])
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(", ")}`),
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
];

export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("priority")
    .optional()
    .isIn([...TASK_PRIORITIES])
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(", ")}`),
  body("status")
    .optional()
    .isIn([...TASK_STATUSES])
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),
];

export const updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("priority")
    .optional()
    .isIn([...TASK_PRIORITIES])
    .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(", ")}`),
  body("status")
    .optional()
    .isIn([...TASK_STATUSES])
    .withMessage(`Status must be one of: ${TASK_STATUSES.join(", ")}`),
  body("dueDate")
    .optional({ values: "null" })
    .custom((value) => value === null || !Number.isNaN(Date.parse(String(value))))
    .withMessage("Due date must be a valid date or null"),
];

export const taskIdValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),
];
