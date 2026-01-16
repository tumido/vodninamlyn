/**
 * Performance monitoring utilities using Sentry spans.
 * Tracks operation timing and integrates with Sentry performance monitoring.
 */

import * as Sentry from '@sentry/nextjs';
import { trackSlowOperation } from './metrics';

export enum OperationType {
  // Database operations
  DB_QUERY = 'db.query',
  DB_INSERT = 'db.insert',
  DB_UPDATE = 'db.update',
  DB_DELETE = 'db.delete',

  // Auth operations
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_CHECK = 'auth.check',

  // RSVP operations
  RSVP_SUBMIT = 'rsvp.submit',
  RSVP_FETCH = 'rsvp.fetch',
  RSVP_UPDATE = 'rsvp.update',
  RSVP_DELETE = 'rsvp.delete',

  // Form operations
  FORM_VALIDATE = 'form.validate',
  FORM_SUBMIT = 'form.submit',

  // Page operations
  PAGE_LOAD = 'page.load',
  PAGE_NAVIGATION = 'page.navigation',
}

export interface PerformanceContext {
  userId?: string;
  component?: string;
  metadata?: Record<string, unknown>;
}

// Thresholds for slow operation detection (in milliseconds)
const SLOW_OPERATION_THRESHOLDS: Record<string, number> = {
  [OperationType.DB_QUERY]: 1000,
  [OperationType.DB_INSERT]: 2000,
  [OperationType.DB_UPDATE]: 2000,
  [OperationType.DB_DELETE]: 1500,
  [OperationType.AUTH_LOGIN]: 3000,
  [OperationType.AUTH_LOGOUT]: 1000,
  [OperationType.AUTH_CHECK]: 500,
  [OperationType.RSVP_SUBMIT]: 3000,
  [OperationType.RSVP_FETCH]: 2000,
  [OperationType.RSVP_UPDATE]: 2000,
  [OperationType.RSVP_DELETE]: 1500,
  [OperationType.FORM_VALIDATE]: 500,
  [OperationType.FORM_SUBMIT]: 3000,
  [OperationType.PAGE_LOAD]: 3000,
  [OperationType.PAGE_NAVIGATION]: 1000,
};

// Get metric name from operation type
function getMetricName(operation: OperationType): string {
  if (operation.startsWith('db.')) {
    return 'db.duration';
  }
  if (operation.startsWith('auth.')) {
    return 'auth.duration';
  }
  if (operation.startsWith('rsvp.')) {
    return 'rsvp.duration';
  }
  if (operation.startsWith('form.')) {
    return 'form.duration';
  }
  if (operation.startsWith('page.')) {
    return 'page.duration';
  }
  return 'operation.duration';
}

class PerformanceMonitor {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Measure an async operation with Sentry span
   * Automatically tracks slow operations and records distribution metrics
   */
  async measureAsync<T>(
    operation: OperationType,
    name: string,
    fn: () => Promise<T>,
    context?: PerformanceContext
  ): Promise<T> {
    const startTime = performance.now();

    if (this.isDevelopment) {
      try {
        const result = await fn();
        const duration = performance.now() - startTime;
        console.debug(`[Performance] ${name} completed in ${Math.round(duration)}ms`);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.debug(`[Performance] ${name} failed after ${Math.round(duration)}ms`);
        throw error;
      }
    }

    return await Sentry.startSpan(
      {
        op: operation,
        name,
        attributes: {
          ...context?.metadata,
          component: context?.component,
        },
      },
      async (span) => {
        try {
          const result = await fn();
          const duration = performance.now() - startTime;
          const durationMs = Math.round(duration);

          span?.setAttribute('duration_ms', durationMs);
          span?.setStatus({ code: 1, message: 'ok' });

          // Record distribution metric
          const metricName = getMetricName(operation);
          this.recordMetric(metricName, durationMs);

          // Check for slow operation
          const threshold = SLOW_OPERATION_THRESHOLDS[operation];
          if (threshold && durationMs > threshold) {
            const operationCategory = operation.split('.')[0] as 'db' | 'api';
            trackSlowOperation(operationCategory, {
              operation: name,
              durationMs,
              threshold,
              component: context?.component,
              ...context?.metadata,
            });
          }

          return result;
        } catch (error) {
          const duration = performance.now() - startTime;
          const durationMs = Math.round(duration);

          span?.setAttribute('duration_ms', durationMs);
          span?.setStatus({ code: 2, message: 'internal_error' });

          // Still record metric for failed operations
          const metricName = getMetricName(operation);
          this.recordMetric(metricName, durationMs);

          throw error;
        }
      }
    );
  }

  /**
   * Measure a synchronous operation with Sentry span
   * Automatically tracks slow operations and records distribution metrics
   */
  measure<T>(
    operation: OperationType,
    name: string,
    fn: () => T,
    context?: PerformanceContext
  ): T {
    const startTime = performance.now();

    if (this.isDevelopment) {
      try {
        const result = fn();
        const duration = performance.now() - startTime;
        console.debug(`[Performance] ${name} completed in ${Math.round(duration)}ms`);
        return result;
      } catch (error) {
        const duration = performance.now() - startTime;
        console.debug(`[Performance] ${name} failed after ${Math.round(duration)}ms`);
        throw error;
      }
    }

    return Sentry.startSpan(
      {
        op: operation,
        name,
        attributes: {
          ...context?.metadata,
          component: context?.component,
        },
      },
      (span) => {
        try {
          const result = fn();
          const duration = performance.now() - startTime;
          const durationMs = Math.round(duration);

          span?.setAttribute('duration_ms', durationMs);
          span?.setStatus({ code: 1, message: 'ok' });

          // Record distribution metric
          const metricName = getMetricName(operation);
          this.recordMetric(metricName, durationMs);

          // Check for slow operation
          const threshold = SLOW_OPERATION_THRESHOLDS[operation];
          if (threshold && durationMs > threshold) {
            const operationCategory = operation.split('.')[0] as 'db' | 'api';
            trackSlowOperation(operationCategory, {
              operation: name,
              durationMs,
              threshold,
              component: context?.component,
              ...context?.metadata,
            });
          }

          return result;
        } catch (error) {
          const duration = performance.now() - startTime;
          const durationMs = Math.round(duration);

          span?.setAttribute('duration_ms', durationMs);
          span?.setStatus({ code: 2, message: 'internal_error' });

          // Still record metric for failed operations
          const metricName = getMetricName(operation);
          this.recordMetric(metricName, durationMs);

          throw error;
        }
      }
    );
  }

  /**
   * Record a custom metric distribution
   */
  recordMetric(name: string, value: number, unit: string = 'millisecond'): void {
    if (this.isDevelopment) return;

    Sentry.metrics.distribution(name, value, {
      unit,
    });
  }

  /**
   * Set a gauge metric
   */
  setGauge(name: string, value: number): void {
    if (this.isDevelopment) return;

    Sentry.metrics.gauge(name, value);
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export convenience functions
export const measureAsync = performanceMonitor.measureAsync.bind(performanceMonitor);
export const measure = performanceMonitor.measure.bind(performanceMonitor);
export const recordMetric = performanceMonitor.recordMetric.bind(performanceMonitor);
export const setGauge = performanceMonitor.setGauge.bind(performanceMonitor);
