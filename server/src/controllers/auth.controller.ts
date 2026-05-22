import type { Response, NextFunction } from "express";
import { User, type UserHydratedDocument } from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import type { AuthRequest, LoginBody, RegisterBody } from "../types/index.js";

function toPublicUser(user: UserHydratedDocument | { _id: unknown; name: string; email: string }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  };
}

export async function register(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, email, password } = req.body as RegisterBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const user = await User.create({ name, email, password });

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    setAuthCookie(res, token);

    res.status(201).json({
      success: true,
      data: { user: toPublicUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    });

    setAuthCookie(res, token);

    res.json({
      success: true,
      data: { user: toPublicUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    clearAuthCookie(res);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    res.json({
      success: true,
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
}
