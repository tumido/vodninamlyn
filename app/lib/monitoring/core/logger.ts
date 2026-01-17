/**
 * Structured logging utility for consistent logging across the application.
 * Integrates with Sentry for production error tracking and provides rich context.
 *
 * IMPORTANT: Use this module for logging only. For performance measurement,
 * use the performance module.
 */

import * as Sentry from "@sentry/nextjs";
import type { LogLevel, LogContext } from "../types";
import { LogLevel as LogLevelEnum } from "../types";

const isDevelopment = process.env.NODE_ENV === "development";

interface LogEntry {
  context?: LogContext;
  error?: Error;
  level: LogLevel;
  message: string;
  timestamp: string;
}

/**
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const { context, level, message, timestamp } = entry;
  const contextStr = context ? ` | ${JSON.stringify(context)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
}

/**
 * Send log entry to Sentry with appropriate level and context
 */
function sendToSentry(entry: LogEntry): void {
  if (isDevelopment) return;

  const { context, error, level, message } = entry;

  // Add context as breadcrumb
  if (context) {
    Sentry.addBreadcrumb({
      category: context.component || "app",
      data: context,
      level: level as Sentry.SeverityLevel,
      message,
    });
  }

  // Set additional context
  if (context?.userId) {
    Sentry.setUser({ id: context.userId });
  }

  if (context?.operation) {
    Sentry.setTag("operation", context.operation);
  }

  // Send to Sentry based on level
  switch (level) {
    case LogLevelEnum.ERROR:
      if (error) {
        Sentry.captureException(error, {
          contexts: {
            custom: context,
          },
        });
      } else {
        Sentry.captureMessage(message, {
          contexts: {
            custom: context,
          },
          level: "error",
        });
      }
      break;
    case LogLevelEnum.WARN:
      Sentry.captureMessage(message, {
        contexts: {
          custom: context,
        },
        level: "warning",
      });
      break;
    case LogLevelEnum.INFO:
      // Info logs are captured as breadcrumbs only
      break;
    case LogLevelEnum.DEBUG:
      // Debug logs are not sent to Sentry
      break;
  }
}

/**
 * Core logging function
 */
function log(
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error,
): void {
  const entry: LogEntry = {
    context,
    error,
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  // Always log to console
  const formattedMessage = formatLogEntry(entry);
  switch (level) {
    case LogLevelEnum.DEBUG:
      console.debug(formattedMessage, error || "");
      break;
    case LogLevelEnum.INFO:
      console.info(formattedMessage, error || "");
      break;
    case LogLevelEnum.WARN:
      console.warn(formattedMessage, error || "");
      break;
    case LogLevelEnum.ERROR:
      console.error(formattedMessage, error || "");
      break;
  }

  // Send to Sentry in production
  sendToSentry(entry);
}

/**
 * Log debug message (development only)
 */
export function debug(message: string, context?: LogContext): void {
  if (isDevelopment) {
    log(LogLevelEnum.DEBUG, message, context);
  }
}

/**
 * Log informational message
 */
export function info(message: string, context?: LogContext): void {
  log(LogLevelEnum.INFO, message, context);
}

/**
 * Log warning message
 */
export function warn(message: string, context?: LogContext): void {
  log(LogLevelEnum.WARN, message, context);
}

/**
 * Log error message
 */
export function error(
  message: string,
  err?: Error,
  context?: LogContext,
): void {
  log(LogLevelEnum.ERROR, message, context, err);
}
