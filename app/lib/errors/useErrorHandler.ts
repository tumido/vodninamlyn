"use client";

import { useState, useCallback } from "react";
import type { AppError, ErrorType } from "@/app/lib/types";

export const useErrorHandler = () => {
  const [error, setError] = useState<AppError | null>(null);

  const showError = useCallback(
    (message: string, type: ErrorType = "toast") => {
      setError({
        message,
        timestamp: Date.now(),
        type,
      });
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    clearError,
    error,
    showError,
  };
};
