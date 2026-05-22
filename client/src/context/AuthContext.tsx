"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  get,
  post,
  registerSessionExpiredHandler,
} from "@/lib/axios";
import type {
  ApiResponse,
  AuthResponse,
  LoginInput,
  RegisterInput,
  User,
} from "@/types";

interface AuthOptions {
  redirect?: boolean;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (input: LoginInput, options?: AuthOptions) => Promise<void>;
  register: (input: RegisterInput, options?: AuthOptions) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<void>;
  clearSession: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    registerSessionExpiredHandler(clearUser);
    return () => registerSessionExpiredHandler(null);
  }, [clearUser]);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      try {
        const data = await get<ApiResponse<AuthResponse>>("/api/auth/me");
        setUser(data.data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (input: LoginInput, options?: AuthOptions) => {
      const data = await post<ApiResponse<AuthResponse>>(
        "/api/auth/login",
        input
      );
      setUser(data.data?.user ?? null);
      if (options?.redirect !== false) {
        router.push("/dashboard");
      }
    },
    [router]
  );

  const register = useCallback(
    async (input: RegisterInput, options?: AuthOptions) => {
      const data = await post<ApiResponse<AuthResponse>>(
        "/api/auth/register",
        input
      );
      setUser(data.data?.user ?? null);
      if (options?.redirect !== false) {
        router.push("/dashboard");
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await post<ApiResponse<{ message: string }>>("/api/auth/logout");
    } catch {
      /* Logout still clears local session if the server is unreachable */
    } finally {
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const updateUser = useCallback((next: User) => {
    setUser(next);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await get<ApiResponse<AuthResponse>>("/api/auth/me");
      setUser(data.data?.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
      clearSession,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
      refreshUser,
      clearSession,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return {
    ...context,
    isAuthenticated: context.user !== null,
  };
}
