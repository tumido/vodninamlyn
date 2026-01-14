import { ZodError } from "zod";

/**
 * Parse Zod validation errors into a flat object structure
 * suitable for form field error display.
 *
 * @param error - ZodError instance from validation
 * @returns Object mapping field names to error messages
 *
 * @example
 * try {
 *   schema.parse(data);
 * } catch (error) {
 *   if (error instanceof ZodError) {
 *     const errors = parseZodErrors(error);
 *     // errors = { email: "Invalid email", password: "Too short" }
 *   }
 * }
 */
export function parseZodErrors(error: ZodError): Record<string, string> {
  const formErrors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    if (issue.path.length > 0) {
      const fieldName = issue.path[0] as string;
      formErrors[fieldName] = issue.message;
    }
  });
  return formErrors;
}
