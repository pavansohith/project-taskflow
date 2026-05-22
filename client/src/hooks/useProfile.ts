"use client";

import { useCallback, useState } from "react";
import { put } from "@/lib/axios";
import { getErrorMessage } from "@/lib/errors";
import { tokenStore } from "@/lib/tokenStore";
import type { ApiResponse, AuthResponse } from "@/types";

interface UpdateProfileInput {
  name: string;
}

interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await put<ApiResponse<AuthResponse>>(
        "/api/auth/profile",
        input
      );
      if (data.token) {
        tokenStore.set(data.token);
      }
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (input: UpdatePasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await put<ApiResponse<{ message: string }>>(
        "/api/auth/password",
        input
      );
      return data;
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    updateProfile,
    updatePassword,
  };
}
