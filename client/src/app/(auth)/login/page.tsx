"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { appToast } from "@/lib/toast";
import { AuthMobileLogo } from "@/components/auth/AuthMobileLogo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { fadeInUp } from "@/lib/motion";
import { getErrorMessage } from "@/lib/axios";
import { loginSchema, type LoginFormValues } from "@/lib/validators";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(false);
    try {
      await login(values, { redirect: false });
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 650));
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(true);
      appToast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <AuthMobileLogo />
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-border dark:bg-bg-surface"
      >
        <div className="mb-8">
          <h1 className="text-heading-2">Welcome back</h1>
          <p className="mt-2 text-body">Sign in to your TaskFlow account</p>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          animate={submitError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-5"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between gap-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500/50"
              />
              Remember me
            </label>
            <Link
              href="#"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
              onClick={(e) => e.preventDefault()}
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="h-11 w-full"
            isLoading={isSubmitting && !success}
            disabled={success}
          >
            <AnimatePresence mode="wait" initial={false}>
              {success ? (
                <motion.span
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Signed in!
                </motion.span>
              ) : (
                <motion.span key="default">
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              Register
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </>
  );
}
