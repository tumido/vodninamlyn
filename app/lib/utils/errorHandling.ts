import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Unified error handler for Supabase errors
 * Logs to console and returns a user-friendly error message
 */
export function handleSupabaseError(
  error: PostgrestError,
  context: string,
  userMessage: string
): string {
  console.error(`${context}:`, error);
  return `${userMessage}: ${error.message}`;
}
