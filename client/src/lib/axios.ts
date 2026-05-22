import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { appToast } from "@/lib/toast";
import { tokenStore } from "@/lib/tokenStore";
import {
  type ApiErrorBody,
  getErrorMessage,
  isAuthRequestUrl,
  isSilentAuthUrl,
  isUnauthorizedError,
} from "@/lib/errors";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;

export function registerSessionExpiredHandler(
  handler: SessionExpiredHandler | null
): void {
  sessionExpiredHandler = handler;
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const errorCode = error.response?.data?.errorCode;
    const requestUrl = error.config?.url ?? "";

    const sessionExpired =
      status === 401 ||
      errorCode === "SESSION_EXPIRED";

    if (sessionExpired && typeof window !== "undefined") {
      tokenStore.clear();

      if (isAuthRequestUrl(requestUrl) || isSilentAuthUrl(requestUrl)) {
        return Promise.reject(error);
      }

      sessionExpiredHandler?.();
      appToast.error("Your session has expired. Signing you out...");

      const path = window.location.pathname;
      const isAuthPage =
        path.startsWith("/login") || path.startsWith("/register");

      if (!isAuthPage) {
        window.location.href = "/login?reason=session_expired";
      }
    }

    return Promise.reject(error);
  }
);

export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.get<T>(url, config);
  return response.data;
}

export async function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.post<T>(url, body, config);
  return response.data;
}

export async function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.put<T>(url, body, config);
  return response.data;
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response: AxiosResponse<T> = await api.delete<T>(url, config);
  return response.data;
}

/** @alias del */
export { del as delete };

export {
  getErrorMessage,
  getFieldErrors,
  isUnauthorizedError,
  type ApiErrorBody,
} from "@/lib/errors";
