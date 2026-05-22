import type { Response, NextFunction } from "express";
import { Task } from "../models/Task.js";
import { User, type UserHydratedDocument } from "../models/User.js";
import { clearAuthCookie, setAuthCookie, signToken } from "../middleware/auth.js";
import { AppError } from "../middleware/errorHandler.js";
import type {
  AuthRequest,
  LoginBody,
  RegisterBody,
  UpdatePasswordBody,
  UpdateProfileBody,
} from "../types/index.js";

function toPublicUser(
  user: UserHydratedDocument | { _id: unknown; name: string; email: string; createdAt?: Date; updatedAt?: Date }
) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
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
      throw new AppError("An account with this email already exists", 409);
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
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      data: { user: toPublicUser(user) },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const { name } = req.body as UpdateProfileBody;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError("User not found", 404);
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

export async function updatePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const { currentPassword, newPassword } = req.body as UpdatePasswordBody;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const matches = await user.comparePassword(currentPassword);
    if (!matches) {
      throw new AppError("Current password is incorrect", 400);
    }

    const sameAsCurrent = await user.comparePassword(newPassword);
    if (sameAsCurrent) {
      throw new AppError("New password must be different from current password", 400);
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    next(error);
  }
}

export async function deleteAccount(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    const ownerId = req.user.id;

    await Task.deleteMany({ owner: ownerId });
    await User.findByIdAndDelete(ownerId);
    clearAuthCookie(res);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    next(error);
  }
}
