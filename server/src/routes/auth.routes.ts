import { Router } from "express";
import {
  deleteAccount,
  getMe,
  login,
  logout,
  register,
  updatePassword,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidation,
  registerValidation,
  updatePasswordValidation,
  updateProfileValidation,
} from "../validators/auth.validators.js";

const router = Router();

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);
router.post("/logout", logout);
router.get("/me", authenticate, getMe);
router.put("/profile", authenticate, updateProfileValidation, validate, updateProfile);
router.put(
  "/password",
  authenticate,
  updatePasswordValidation,
  validate,
  updatePassword
);
router.delete("/account", authenticate, deleteAccount);

export default router;
