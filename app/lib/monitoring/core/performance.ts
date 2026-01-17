/**
 * Performance monitoring utilities using Sentry spans.
 * Tracks operation timing and integrates with Sentry performance monitoring.
 *
 * IMPORTANT: Use this module for performance measurement and timing.
 * For logging, use the logger module.
 */

import * as Sentry from "@sentry/nextjs";
import type { OperationType, PerformanceContext } from "../types";
import * as logger from "./logger";

const isDevelopment = process.env.NODE_ENV === "development";

// Thresholds for slow operation detection (in milliseconds)
const SLOW_OPERATION_THRESHOLDS: Partial<Record<OperationType, number>> = {
  "auth.check": 500,
  "auth.login": 3000,
  "auth.logout": 1000,
  "rsvp.delete": 1500,
  "rsvp.fetch": 2000,
  "rsvp.submit": 3000,
  "rsvp.update": 2000,
};

/**
 * Get metric name from operation type for distribution metrics
 */
function getMetricName(operation: OperationType): string {
  const category = operation.split(".")[0];
  return `${category}.duration`;
}

/**
 * Record a distribution metric in Sentry
 */
export function recordMetric(
  name: string,
  value: number,
  unit: string = "millisecond",
): void {
  if (isDevelopment) return;

  Sentry.metrics.distribution(name, value, {
    unit,
  });
}

/**
 * Set a gauge metric in Sentry
 */
export function setGauge(name: string, value: number): void {
  if (isDevelopment) return;

  Sentry.metrics.gauge(name, value);
}

/**
 * Measure an async operation with Sentry span
 * Automatically tracks slow operations and records distribution metrics
 */
export async function measureAsync<T>(
  operation: OperationType,
  name: string,
  fn: () => Promise<T>,
  context?: PerformanceContext,
): Promise<T> {
  const startTime = performance.now();

  if (isDevelopment) {
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      console.debug(
        `[Performance] ${name} completed in ${Math.round(duration)}ms`,
      );
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.debug(
        `[Performance] ${name} failed after ${Math.round(duration)}ms`,
      );
      throw error;
    }
  }

  return await Sentry.startSpan(
    {
      attributes: {
        ...context?.metadata,
        component: context?.component,
      },
      name,
      op: operation,
    },
    async (span) => {
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        const durationMs = Math.round(duration);

        span?.setAttribute("duration_ms", durationMs);
        span?.setStatus({ code: 1, message: "ok" });

        // Record distribution metric
        const metricName = getMetricName(operation);
        recordMetric(metricName, durationMs);

        // Check for slow operation
        const threshold = SLOW_OPERATION_THRESHOLDS[operation];
        if (threshold && durationMs > threshold) {
          logger.warn(`Slow ${operation}: ${name}`, {
            component: context?.component,
            duration: durationMs,
            metadata: {
              threshold,
              ...context?.metadata,
            },
            operation: name,
          });
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        const durationMs = Math.round(duration);

        span?.setAttribute("duration_ms", durationMs);
        span?.setStatus({ code: 2, message: "internal_error" });

        // Still record metric for failed operations
        const metricName = getMetricName(operation);
        recordMetric(metricName, durationMs);

        throw error;
      }
    },
  );
}

/**
 * Measure a synchronous operation with Sentry span
 * Automatically tracks slow operations and records distribution metrics
 */
export function measure<T>(
  operation: OperationType,
  name: string,
  fn: () => T,
  context?: PerformanceContext,
): T {
  const startTime = performance.now();

  if (isDevelopment) {
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      console.debug(
        `[Performance] ${name} completed in ${Math.round(duration)}ms`,
      );
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.debug(
        `[Performance] ${name} failed after ${Math.round(duration)}ms`,
      );
      throw error;
    }
  }

  return Sentry.startSpan(
    {
      attributes: {
        ...context?.metadata,
        component: context?.component,
      },
      name,
      op: operation,
    },
    (span) => {
      try {
        const result = fn();
        const duration = performance.now() - startTime;
        const durationMs = Math.round(duration);

        span?.setAttribute("duration_ms", durationMs);
        span?.setStatus({ code: 1, message: "ok" });

        // Record distribution metric
        const metricName = getMetricName(operation);
        recordMetric(metricName, durationMs);

        // Check for slow operation
        const threshold = SLOW_OPERATION_THRESHOLDS[operation];
        if (threshold && durationMs > threshold) {
          logger.warn(`Slow ${operation}: ${name}`, {
            component: context?.component,
            duration: durationMs,
            metadata: {
              threshold,
              ...context?.metadata,
            },
            operation: name,
          });
        }

        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        const durationMs = Math.round(duration);

        span?.setAttribute("duration_ms", durationMs);
        span?.setStatus({ code: 2, message: "internal_error" });

        // Still record metric for failed operations
        const metricName = getMetricName(operation);
        recordMetric(metricName, durationMs);

        throw error;
      }
    },
  );
}
