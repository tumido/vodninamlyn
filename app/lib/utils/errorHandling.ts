import type { PostgrestError } from "@supabase/supabase-js";
import { logger } from "./logger";

/**
 * Unified error handler for Supabase errors
 * Logs using logger and returns a user-friendly error message
 */
export function handleSupabaseError(
  error: PostgrestError,
  context: string,
  userMessage: string
): string {
  logger.error(`Supabase error in ${context}`, new Error(error.message), {
    operation: context,
    metadata: {
      code: error.code,
      details: error.details,
      hint: error.hint,
    },
  });
  return `${userMessage}: ${error.message}`;
}
