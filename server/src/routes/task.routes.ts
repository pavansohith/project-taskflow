import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskActivity,
  getTaskStats,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authenticate } from "../middleware/auth.js";
import { chaosMiddleware } from "../middleware/chaos.js";
import { validate } from "../middleware/validate.js";
import {
  createTaskValidation,
  listTasksValidation,
  taskIdValidation,
  updateTaskValidation,
} from "../validators/task.validators.js";

const router = Router();

router.use(authenticate);

router.get("/stats", getTaskStats);
router.get("/activity", getTaskActivity);
router.get("/", listTasksValidation, validate, chaosMiddleware, getTasks);
router.post("/", createTaskValidation, validate, createTask);
router.put("/:id", updateTaskValidation, validate, updateTask);
router.delete("/:id", taskIdValidation, validate, deleteTask);

export default router;
