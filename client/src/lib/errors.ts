import axios, { type AxiosError } from "axios";

export interface ApiErrorBody {
  success: false;
  message: string;
  errorCode?: string;
  errors?: Array<{ field?: string; msg?: string; message?: string }>;
}

const TECHNICAL_MESSAGE_PATTERNS = [
  /^AxiosError/i,
  /^Network Error$/i,
  /^Request failed with status code \d+$/i,
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /ETIMEDOUT/i,
  /timeout of \d+ms exceeded/i,
  /CORS blocked/i,
];

function isTechnicalMessage(message: string): boolean {
  return TECHNICAL_MESSAGE_PATTERNS.some((pattern) => pattern.test(message));
}

function statusToMessage(status: number): string {
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You don't have permission to do that.";
  if (status === 404) return "The requested resource was not found.";
  if (status === 409) return "This resource already exists.";
  if (status === 422) return "Please check your input and try again.";
  if (status === 429) return "Too many requests. Please slow down.";
  if (status >= 500) return "Server error. Please try again in a moment.";
  return "Something went wrong. Please try again.";
}

function normalizeServerMessage(message: string, status?: number): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return status ? statusToMessage(status) : "Something went wrong. Please try again.";
  }
  if (isTechnicalMessage(trimmed)) {
    return status ? statusToMessage(status) : "An unexpected error occurred. Please try again.";
  }
  return trimmed;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorBody>;
    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message;

    if (serverMessage && typeof serverMessage === "string") {
      return normalizeServerMessage(serverMessage, status);
    }

    if (status) {
      return statusToMessage(status);
    }

    if (axiosError.request && !axiosError.response) {
      return "Cannot connect to server. Check your internet connection.";
    }

    if (axiosError.message && !isTechnicalMessage(axiosError.message)) {
      return axiosError.message;
    }

    return "Cannot connect to server. Check your internet connection.";
  }

  if (error instanceof Error) {
    if (isTechnicalMessage(error.message)) {
      return "An unexpected error occurred. Please try again.";
    }
    return error.message;
  }

  if (typeof error === "string" && error.trim()) {
    return isTechnicalMessage(error)
      ? "An unexpected error occurred. Please try again."
      : error;
  }

  return "An unexpected error occurred. Please try again.";
}

export function getFieldErrors(
  error: unknown
): Record<string, string> | null {
  if (!axios.isAxiosError(error)) return null;

  const body = error.response?.data as ApiErrorBody | undefined;
  const errors = body?.errors;
  if (!errors?.length) return null;

  const map: Record<string, string> = {};
  for (const item of errors) {
    const field = item.field;
    const msg = item.msg ?? item.message;
    if (field && msg) {
      map[field] = msg;
    }
  }

  return Object.keys(map).length > 0 ? map : null;
}

export function isUnauthorizedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

export function isAuthRequestUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register")
  );
}

export function isSilentAuthUrl(url?: string): boolean {
  if (!url) return false;
  return url.includes("/auth/me") || url.includes("/auth/logout");
}
