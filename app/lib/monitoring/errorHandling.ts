/**
 * Error handling utilities for common error scenarios
 */

import type { PostgrestError } from "@supabase/supabase-js";
import * as logger from "./core/logger";

/**
 * Unified error handler for Supabase errors
 * Logs using logger and returns a user-friendly error message
 */
export function handleSupabaseError(
  error: PostgrestError,
  context: string,
  userMessage: string,
): string {
  logger.error(`Supabase error in ${context}`, new Error(error.message), {
    metadata: {
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
    operation: context,
  });
  return `${userMessage}: ${error.message}`;
}
