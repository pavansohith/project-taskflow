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
import { registerSchema, type RegisterFormValues } from "@/lib/validators";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [submitError, setSubmitError] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setSubmitError(false);
    try {
      const { name, email, password } = values;
      await registerUser({ name, email, password }, { redirect: false });
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
        className="w-full max-w-md rounded-2xl border border-border bg-bg-surface p-8 shadow-xl"
      >
        <div className="mb-8">
          <h1 className="text-heading-2">Create account</h1>
          <p className="mt-2 text-body">Get started with TaskFlow today</p>
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          animate={submitError ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-5"
        >
          <Input
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <PasswordInput
            label="Password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

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
                  Account created!
                </motion.span>
              ) : (
                <motion.span key="default">
                  {isSubmitting ? "Creating account..." : "Create account"}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:underline dark:text-primary-400"
            >
              Sign in
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </>
  );
}
