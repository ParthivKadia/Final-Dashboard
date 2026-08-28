// src/hooks/useApiError.ts
import { useState, useCallback } from "react";
import { ApiError } from "../api/apiClient";

const STATUS_MESSAGES: Record<number, string> = {
  0:   "Network error. Please check your connection.",
  400: "Invalid request. Please check your inputs.",
  401: "You're not logged in. Please sign in and try again.",
  403: "You don't have permission to do that.",
  404: "Resource not found.",
  409: "This already exists. Please try a different name.",
  422: "Some fields are invalid. Please review your inputs.",
  429: "Too many requests. Please slow down and try again.",
  500: "Server error. Please try again in a moment.",
  503: "This already exists or the service is unavailable.",
};

export interface ApiErrorInfo {
  message: string;
  status: number;
  data: any;
}

export function useApiError() {
  const [error, setError] = useState<ApiErrorInfo | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof ApiError) {
      const msg =
        err.data?.message ||
        err.message ||
        STATUS_MESSAGES[err.status] ||
        "An unexpected error occurred.";
      setError({ message: msg, status: err.status, data: err.data });
    } else if (err instanceof Error) {
      setError({ message: err.message, status: -1, data: null });
    } else {
      setError({ message: "An unexpected error occurred.", status: -1, data: null });
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // convenience: still get a plain string when you don't care about field-mapping
  return { error, message: error?.message ?? null, handleError, clearError };
}