/**
 * Performance monitoring utilities using Sentry spans.
 * Tracks operation timing and integrates with Sentry performance monitoring.
 */

import * as Sentry from '@sentry/nextjs';

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

class PerformanceMonitor {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Measure an async operation with Sentry span
   */
  async measureAsync<T>(
    operation: OperationType,
    name: string,
    fn: () => Promise<T>,
    context?: PerformanceContext
  ): Promise<T> {
    if (this.isDevelopment) {
      return await fn();
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
        const startTime = performance.now();

        try {
          const result = await fn();
          const duration = performance.now() - startTime;

          span?.setAttribute('duration_ms', Math.round(duration));
          span?.setStatus({ code: 1, message: 'ok' });

          return result;
        } catch (error) {
          const duration = performance.now() - startTime;

          span?.setAttribute('duration_ms', Math.round(duration));
          span?.setStatus({ code: 2, message: 'internal_error' });

          throw error;
        }
      }
    );
  }

  /**
   * Measure a synchronous operation with Sentry span
   */
  measure<T>(
    operation: OperationType,
    name: string,
    fn: () => T,
    context?: PerformanceContext
  ): T {
    if (this.isDevelopment) {
      return fn();
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
        const startTime = performance.now();

        try {
          const result = fn();
          const duration = performance.now() - startTime;

          span?.setAttribute('duration_ms', Math.round(duration));
          span?.setStatus({ code: 1, message: 'ok' });

          return result;
        } catch (error) {
          const duration = performance.now() - startTime;

          span?.setAttribute('duration_ms', Math.round(duration));
          span?.setStatus({ code: 2, message: 'internal_error' });

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
