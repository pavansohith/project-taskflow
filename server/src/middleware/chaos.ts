import type { NextFunction, Request, Response } from "express";

export const CHAOS_ENABLED = process.env.CHAOS_MODE === "true";

const SCENARIOS = [
  "NORMAL",
  "DELAY",
  "FAILURE",
  "EMPTY",
  "SESSION_EXPIRE",
  "DUPLICATE_RECORDS",
] as const;

type ChaosScenario = (typeof SCENARIOS)[number];

function pickScenario(): ChaosScenario {
  const index = Math.floor(Math.random() * SCENARIOS.length);
  return SCENARIOS[index] ?? "NORMAL";
}

function randomDelayMs(): number {
  return 3000 + Math.floor(Math.random() * 2001);
}

export function chaosMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!CHAOS_ENABLED) {
    next();
    return;
  }

  const scenario = pickScenario();
  console.log(`[CHAOS] ${scenario} — ${req.method} ${req.originalUrl}`);

  switch (scenario) {
    case "NORMAL":
      next();
      break;

    case "DELAY":
      setTimeout(() => next(), randomDelayMs());
      break;

    case "FAILURE":
      res.status(500).json({
        success: false,
        message: "Internal server error",
        errorCode: "SERVER_FAILURE",
      });
      break;

    case "EMPTY":
      res.status(200).json({
        success: true,
        data: [],
        total: 0,
        message: "No data available",
      });
      break;

    case "SESSION_EXPIRE":
      res.status(401).json({
        success: false,
        message: "Session expired",
        errorCode: "SESSION_EXPIRED",
      });
      break;

    case "DUPLICATE_RECORDS": {
      const originalJson = res.json.bind(res);
      res.json = function duplicateRecordsJson(body: unknown) {
        if (
          body &&
          typeof body === "object" &&
          "data" in body &&
          Array.isArray((body as { data: unknown }).data)
        ) {
          const payload = body as {
            data: Record<string, unknown>[];
            total?: number;
            totalPages?: number;
          };
          payload.data = payload.data.flatMap((item) => [item, { ...item }]);
          if (typeof payload.total === "number") {
            payload.total = payload.data.length;
          }
        }
        return originalJson.call(this, body);
      };
      next();
      break;
    }

    default:
      next();
  }
}
