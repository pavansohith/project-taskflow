"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { AuthMobileLogo } from "@/components/auth/AuthMobileLogo";
import { Button } from "@/components/ui/Button";
import { FormErrorBanner } from "@/components/ui/FormErrorBanner";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { fadeInUp } from "@/lib/motion";
import { getErrorMessage } from "@/lib/errors";
import { loginSchema, type LoginFormValues } from "@/lib/validators";

const authFormShell =
  "[&_label]:text-sm [&_label]:font-medium [&_label]:text-white/70";

const authInputClass =
  "h-10 rounded-md border-[#1f2d45] bg-[#0a0f1e] text-sm text-white placeholder:text-white/30 focus:border-indigo-500 focus:ring-0 focus:outline-none";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get("reason") === "session_expired";
  const [submitError, setSubmitError] = useState<string | null>(null);
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
    setSubmitError(null);
    try {
      await login(values, { redirect: false });
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 650));
      router.push("/dashboard");
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className={`w-full max-w-sm rounded-xl border border-[#1f2d45] bg-[#111827] p-8 ${authFormShell}`}
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-white/50">
          Sign in to your TaskFlow account
        </p>
      </div>

      {sessionExpired && (
        <div className="mb-5 rounded-md border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200">
          You were signed out. Please log in again.
        </div>
      )}

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
          className={authInputClass}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          className={authInputClass}
          {...register("password")}
        />

        <div className="flex items-center justify-between gap-4">
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-white/50">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#1f2d45] bg-[#0a0f1e] text-indigo-600 focus:ring-0"
            />
            Remember me
          </label>
          <Link
            href="#"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
            onClick={(e) => e.preventDefault()}
          >
            Forgot password?
          </Link>
        </div>

        <FormErrorBanner message={submitError} />

        <Button
          type="submit"
          className="h-10 w-full rounded-md bg-indigo-600 text-sm font-semibold shadow-none hover:bg-indigo-500"
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
                <Check className="h-4 w-4" />
                Signed in!
              </motion.span>
            ) : (
              <motion.span key="default">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <p className="text-center text-sm text-white/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.form>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <>
      <AuthMobileLogo />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
