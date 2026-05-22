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

function getStatusCode(err: ApiError): number {
  if (err.statusCode) {
    return err.statusCode;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return 400;
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    return 409;
  }

  return 500;
}

function getErrorMessage(err: ApiError): string {
  if (err instanceof AppError) {
    return err.message;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
  }

  if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    return "Email already registered";
  }

  return err.message || "Internal Server Error";
}

export function errorHandler(
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = getStatusCode(err);
  const message = getErrorMessage(err);

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
}
