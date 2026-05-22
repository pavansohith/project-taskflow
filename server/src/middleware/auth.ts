import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../types/index.js";
import { AppError } from "./errorHandler.js";

export const COOKIE_NAME = "token";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
}

export function getToken(req: Request): string | null {
  const cookieToken = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = req.headers.authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
}

export function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const token = getToken(req);

    if (!token) {
      next(new AppError("Authentication required", 401));
      return;
    }

    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Session expired. Please log in again", 401));
      return;
    }
    next(new AppError("Invalid session. Please log in again", 401));
  }
}
