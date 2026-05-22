"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
  mode: "guest" | "protected";
}

export function AuthGuard({ children, mode }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (mode === "protected" && !isAuthenticated) {
      router.replace("/login");
    }

    if (mode === "guest" && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, mode, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-base">
        <div className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-bg-surface p-8 shadow-sm">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    );
  }

  if (mode === "protected" && !isAuthenticated) return null;
  if (mode === "guest" && isAuthenticated) return null;

  return <>{children}</>;
}
