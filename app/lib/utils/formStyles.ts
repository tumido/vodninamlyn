/**
 * Shared styling constants for form input components
 * Using string literals to ensure Tailwind can detect all classes
 */

/**
 * Base classes for all form inputs (Input, Textarea, Select)
 */
export const BASE_INPUT_CLASSES =
  "w-full px-4 py-3 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-palette-green/50 focus:border-transparent";

/**
 * Error state border and background
 */
export const ERROR_CLASSES = "border-red-300 bg-red-50";

/**
 * Normal state border and background
 */
export const NORMAL_CLASSES = "border-palette-green/20 bg-white/40 hover:border-palette-green";
