import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import type { ApiError } from "../types/index.js";

export class AppError extends Error implements ApiError {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

function formatDuplicateField(field: string): string {
  if (field === "email") {
    return "An account with this email already exists";
  }
  return `This ${field} is already in use`;
}

export function resolveErrorResponse(err: unknown): {
  statusCode: number;
  message: string;
} {
  let statusCode = 500;
  let message = "Something went wrong. Please try again.";

  if (err instanceof AppError) {
    return { statusCode: err.statusCode, message: err.message };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return { statusCode, message };
  }

  if (err instanceof mongoose.Error.CastError) {
    return { statusCode: 404, message: "Resource not found" };
  }

  const mongoErr = err as { code?: number; keyValue?: Record<string, unknown> };
  if (mongoErr?.code === 11000 && mongoErr.keyValue) {
    const field = Object.keys(mongoErr.keyValue)[0] ?? "field";
    return {
      statusCode: 409,
      message: formatDuplicateField(field),
    };
  }

  const named = err as { name?: string; message?: string };

  if (named.name === "JsonWebTokenError") {
    return { statusCode: 401, message: "Invalid session. Please log in again" };
  }

  if (named.name === "TokenExpiredError") {
    return { statusCode: 401, message: "Session expired. Please log in again" };
  }

  if (named.name === "CastError") {
    return { statusCode: 404, message: "Resource not found" };
  }

  if (named.message) {
    message = isProduction() ? sanitizeMessage(named.message) : named.message;
  }

  return { statusCode, message };
}

function sanitizeMessage(msg: string): string {
  if (
    msg.includes("ECONNREFUSED") ||
    msg.includes("MongoServerError") ||
    msg.includes("mongoose") ||
    msg.includes("jwt") ||
    msg.includes("JWT") ||
    msg.includes("CORS blocked") ||
    msg.includes("Not allowed by CORS")
  ) {
    return "Something went wrong. Please try again.";
  }
  return msg;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { statusCode, message } = resolveErrorResponse(err);

  if (statusCode >= 500) {
    console.error(err);
  }

  const response: {
    success: false;
    message: string;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (!isProduction() && err instanceof Error && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
}
