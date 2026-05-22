import "dotenv/config";
import { connectDB, disconnectDB } from "./config/db.js";
import { Task, type TaskPriority, type TaskStatus } from "./models/Task.js";
import { User } from "./models/User.js";

const DEMO_EMAIL = "demo@taskflow.com";

function daysFromNow(offset: number): Date {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
}

interface SeedTask {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: Date;
}

const SEED_TASKS: SeedTask[] = [
  {
    title: "Finalize Q2 product roadmap",
    description:
      "Align engineering and design on milestone dates and dependency order for the next release cycle.",
    priority: "High",
    status: "In Progress",
    dueDate: daysFromNow(-3),
  },
  {
    title: "Review pull requests for auth module",
    description:
      "Focus on cookie handling, validation middleware, and error response consistency.",
    priority: "Medium",
    status: "Todo",
    dueDate: daysFromNow(0),
  },
  {
    title: "Update API documentation",
    description:
      "Document auth and task endpoints with query params, response shapes, and example payloads.",
    priority: "Low",
    status: "Completed",
    dueDate: daysFromNow(-7),
  },
  {
    title: "Set up staging environment",
    description:
      "Provision Railway and Vercel preview deployments with Atlas staging database.",
    priority: "High",
    status: "Todo",
    dueDate: daysFromNow(5),
  },
  {
    title: "Design dashboard empty states",
    description:
      "Illustrations and copy for no tasks, no activity, and filtered-empty views.",
    priority: "Medium",
    status: "Completed",
    dueDate: daysFromNow(-1),
  },
  {
    title: "Implement debounced task search",
    description:
      "400ms debounce on title search with server-side filtering and pagination reset.",
    priority: "Medium",
    status: "In Progress",
    dueDate: daysFromNow(2),
  },
  {
    title: "Chaos middleware integration tests",
    description:
      "Manually verify delay, failure, empty, duplicate, and session-expiry scenarios on the task list.",
    priority: "High",
    status: "Todo",
    dueDate: daysFromNow(7),
  },
  {
    title: "Accessibility audit — auth pages",
    description:
      "Check focus order, labels, contrast ratios, and keyboard navigation on login and register.",
    priority: "Low",
    status: "Todo",
    dueDate: daysFromNow(14),
  },
  {
    title: "Optimize MongoDB indexes",
    description:
      "Confirm owner + createdAt compound index performs well under paginated list queries.",
    priority: "Medium",
    status: "Completed",
    dueDate: daysFromNow(-5),
  },
  {
    title: "Prepare demo walkthrough script",
    description:
      "Five-minute flow: register, create tasks, filters, dark mode, and chaos refresh demo.",
    priority: "Low",
    status: "In Progress",
    dueDate: daysFromNow(3),
  },
  {
    title: "Fix mobile filter drawer overlap",
    description:
      "Ensure filter sheet and task form bottom sheet do not conflict on small viewports.",
    priority: "High",
    status: "Todo",
    dueDate: daysFromNow(-2),
  },
  {
    title: "Ship v1.0 release checklist",
    description:
      "Production builds, env vars, seed script, README live URLs, and evaluator test credentials.",
    priority: "High",
    status: "In Progress",
    dueDate: daysFromNow(10),
  },
];

async function seed(): Promise<void> {
  await connectDB();

  const existing = await User.findOne({ email: DEMO_EMAIL });
  if (existing) {
    console.log("Seed already run");
    await disconnectDB();
    process.exit(0);
  }

  const user = await User.create({
    name: "Pavan Sohith",
    email: DEMO_EMAIL,
    password: "Demo@1234",
  });

  await Task.insertMany(
    SEED_TASKS.map((task) => ({
      ...task,
      owner: user._id,
    }))
  );

  console.log("✅ Seed complete — demo@taskflow.com / Demo@1234");
  await disconnectDB();
  process.exit(0);
}

seed().catch(async (error) => {
  console.error("Seed failed:", error);
  await disconnectDB().catch(() => undefined);
  process.exit(1);
});
