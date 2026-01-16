/**
 * Structured logging utility for consistent logging across the application.
 * Integrates with Sentry for production error tracking and provides rich context.
 */

import * as Sentry from '@sentry/nextjs';

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  [key: string]: unknown;
  userId?: string;
  component?: string;
  operation?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: string;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Format log entry for console output
   */
  private formatLogEntry(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry;
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Send log entry to Sentry with appropriate level and context
   */
  private sendToSentry(entry: LogEntry): void {
    if (this.isDevelopment) return;

    const { level, message, context, error } = entry;

    // Add context as breadcrumb
    if (context) {
      Sentry.addBreadcrumb({
        category: context.component || 'app',
        message,
        level: level as Sentry.SeverityLevel,
        data: context,
      });
    }

    // Set additional context
    if (context?.userId) {
      Sentry.setUser({ id: context.userId });
    }

    if (context?.operation) {
      Sentry.setTag('operation', context.operation);
    }

    // Send to Sentry based on level
    switch (level) {
      case LogLevel.ERROR:
        if (error) {
          Sentry.captureException(error, {
            contexts: {
              custom: context,
            },
          });
        } else {
          Sentry.captureMessage(message, {
            level: 'error',
            contexts: {
              custom: context,
            },
          });
        }
        break;
      case LogLevel.WARN:
        Sentry.captureMessage(message, {
          level: 'warning',
          contexts: {
            custom: context,
          },
        });
        break;
      case LogLevel.INFO:
        // Info logs are captured as breadcrumbs only
        break;
      case LogLevel.DEBUG:
        // Debug logs are not sent to Sentry
        break;
    }
  }

  /**
   * Log a message with context
   */
  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
      error,
    };

    // Always log to console
    const formattedMessage = this.formatLogEntry(entry);
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, error || '');
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, error || '');
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, error || '');
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, error || '');
        break;
    }

    // Send to Sentry in production
    this.sendToSentry(entry);
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  /**
   * Log informational message
   */
  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Start a performance measurement
   */
  startTimer(operation: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.info(`${operation} completed`, {
        operation,
        duration: Math.round(duration),
      });
      return duration;
    };
  }

  /**
   * Log with performance timing
   */
  async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: LogContext
  ): Promise<T> {
    const startTime = performance.now();

    try {
      const result = await fn();
      const duration = performance.now() - startTime;

      this.info(`${operation} succeeded`, {
        ...context,
        operation,
        duration: Math.round(duration),
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.error(
        `${operation} failed`,
        error instanceof Error ? error : new Error(String(error)),
        {
          ...context,
          operation,
          duration: Math.round(duration),
        }
      );

      throw error;
    }
  }

  /**
   * Log synchronous operation with timing
   */
  measure<T>(operation: string, fn: () => T, context?: LogContext): T {
    const startTime = performance.now();

    try {
      const result = fn();
      const duration = performance.now() - startTime;

      this.info(`${operation} succeeded`, {
        ...context,
        operation,
        duration: Math.round(duration),
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      this.error(
        `${operation} failed`,
        error instanceof Error ? error : new Error(String(error)),
        {
          ...context,
          operation,
          duration: Math.round(duration),
        }
      );

      throw error;
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const measureAsync = logger.measureAsync.bind(logger);
export const measure = logger.measure.bind(logger);
export const startTimer = logger.startTimer.bind(logger);
