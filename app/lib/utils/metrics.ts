/**
 * Custom metrics tracking system for business and user analytics.
 * Tracks events, user behavior, and business metrics.
 */

import * as Sentry from '@sentry/nextjs';
import { logger } from './logger';

export enum MetricEvent {
  // RSVP Events
  RSVP_FORM_STARTED = 'rsvp.form.started',
  RSVP_FORM_SUBMITTED = 'rsvp.form.submitted',
  RSVP_FORM_SUCCESS = 'rsvp.form.success',
  RSVP_FORM_ERROR = 'rsvp.form.error',
  RSVP_VALIDATION_ERROR = 'rsvp.validation.error',

  // Admin Events
  ADMIN_LOGIN_ATTEMPT = 'admin.login.attempt',
  ADMIN_LOGIN_SUCCESS = 'admin.login.success',
  ADMIN_LOGIN_FAILURE = 'admin.login.failure',
  ADMIN_LOGOUT = 'admin.logout',
  ADMIN_RSVP_VIEWED = 'admin.rsvp.viewed',
  ADMIN_RSVP_EDITED = 'admin.rsvp.edited',
  ADMIN_RSVP_DELETED = 'admin.rsvp.deleted',

  // User Engagement Events
  PAGE_VIEW = 'page.view',
  SECTION_VIEWED = 'section.viewed',
  BUTTON_CLICKED = 'button.clicked',
  LINK_CLICKED = 'link.clicked',
  MODAL_OPENED = 'modal.opened',
  MODAL_CLOSED = 'modal.closed',

  // Form Events
  FORM_FIELD_FOCUSED = 'form.field.focused',
  FORM_FIELD_BLURRED = 'form.field.blurred',
  FORM_FIELD_CHANGED = 'form.field.changed',
  FORM_ABANDONED = 'form.abandoned',

  // Performance Events
  DB_QUERY_SLOW = 'db.query.slow',
  API_REQUEST_SLOW = 'api.request.slow',
}

export interface MetricData {
  [key: string]: string | number | boolean | undefined;
  userId?: string;
  component?: string;
  timestamp?: number;
}

export interface ValidationErrorData extends MetricData {
  field: string;
  errorType: string;
  errorMessage: string;
}

export interface FormAbandonmentData extends MetricData {
  formName: string;
  lastField?: string;
  completionPercentage: number;
  timeSpentMs: number;
}

export interface PerformanceMetricData extends MetricData {
  operation: string;
  durationMs: number;
  threshold: number;
}

class MetricsTracker {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private eventQueue: Array<{ event: MetricEvent; data: MetricData }> = [];
  private flushInterval = 5000; // Flush every 5 seconds
  private maxQueueSize = 50;

  constructor() {
    if (!this.isDevelopment) {
      // Start periodic flush
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  /**
   * Track a metric event
   */
  track(event: MetricEvent, data?: MetricData): void {
    const enrichedData: MetricData = {
      ...data,
      timestamp: Date.now(),
    };

    // Log in development
    if (this.isDevelopment) {
      logger.debug(`Metric: ${event}`, enrichedData);
      return;
    }

    // Add to Sentry breadcrumb
    Sentry.addBreadcrumb({
      category: 'metric',
      message: event,
      level: 'info',
      data: enrichedData,
    });

    // Queue for batch processing
    this.eventQueue.push({ event, data: enrichedData });

    // Flush if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  /**
   * Track RSVP form submission
   */
  trackRsvpSubmission(success: boolean, data?: MetricData): void {
    const event = success ? MetricEvent.RSVP_FORM_SUCCESS : MetricEvent.RSVP_FORM_ERROR;
    this.track(event, data);

    // Record counter metrics
    if (!this.isDevelopment) {
      Sentry.metrics.count('rsvp.submissions', 1);

      if (success) {
        Sentry.metrics.count('rsvp.submissions.success', 1);
      } else {
        Sentry.metrics.count('rsvp.submissions.failure', 1);
      }
    }
  }

  /**
   * Track validation error
   */
  trackValidationError(field: string, errorType: string, errorMessage: string): void {
    const data: ValidationErrorData = {
      field,
      errorType,
      errorMessage,
    };

    this.track(MetricEvent.RSVP_VALIDATION_ERROR, data);

    // Record counter for validation errors
    if (!this.isDevelopment) {
      Sentry.metrics.count('rsvp.validation.errors', 1);
    }
  }

  /**
   * Track form abandonment
   */
  trackFormAbandonment(formData: FormAbandonmentData): void {
    this.track(MetricEvent.FORM_ABANDONED, formData);

    logger.info('Form abandoned', {
      component: formData.formName,
      metadata: {
        lastField: formData.lastField,
        completionPercentage: formData.completionPercentage,
        timeSpentMs: formData.timeSpentMs,
      },
    });
  }

  /**
   * Track slow query or operation
   */
  trackSlowOperation(type: 'db' | 'api', data: PerformanceMetricData): void {
    const event = type === 'db' ? MetricEvent.DB_QUERY_SLOW : MetricEvent.API_REQUEST_SLOW;
    this.track(event, data);

    logger.warn(`Slow ${type} operation: ${data.operation}`, {
      operation: data.operation,
      duration: data.durationMs,
      metadata: { threshold: data.threshold },
    });

    // Record metric distribution
    if (!this.isDevelopment) {
      Sentry.metrics.distribution(`${type}.duration`, data.durationMs, {
        unit: 'millisecond',
      });
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, metadata?: MetricData): void {
    this.track(MetricEvent.PAGE_VIEW, {
      ...metadata,
      path,
    });
  }

  /**
   * Track section viewed (scroll into view)
   */
  trackSectionView(sectionName: string, metadata?: MetricData): void {
    this.track(MetricEvent.SECTION_VIEWED, {
      ...metadata,
      section: sectionName,
    });
  }

  /**
   * Track admin operation
   */
  trackAdminOperation(
    operation: 'login' | 'logout' | 'view' | 'edit' | 'delete',
    success: boolean,
    metadata?: MetricData
  ): void {
    let event: MetricEvent;

    switch (operation) {
      case 'login':
        event = success ? MetricEvent.ADMIN_LOGIN_SUCCESS : MetricEvent.ADMIN_LOGIN_FAILURE;
        break;
      case 'logout':
        event = MetricEvent.ADMIN_LOGOUT;
        break;
      case 'view':
        event = MetricEvent.ADMIN_RSVP_VIEWED;
        break;
      case 'edit':
        event = MetricEvent.ADMIN_RSVP_EDITED;
        break;
      case 'delete':
        event = MetricEvent.ADMIN_RSVP_DELETED;
        break;
    }

    this.track(event, {
      ...metadata,
      success,
    });
  }

  /**
   * Flush queued events
   */
  private flush(): void {
    if (this.eventQueue.length === 0) return;

    // In production, events are already sent to Sentry via breadcrumbs
    // This is a placeholder for future analytics integration
    logger.debug(`Flushed ${this.eventQueue.length} metric events`);

    // Clear queue
    this.eventQueue = [];
  }

  /**
   * Get current queue size (for debugging)
   */
  getQueueSize(): number {
    return this.eventQueue.length;
  }
}

// Export singleton instance
export const metrics = new MetricsTracker();

// Export convenience functions
export const trackEvent = metrics.track.bind(metrics);
export const trackRsvpSubmission = metrics.trackRsvpSubmission.bind(metrics);
export const trackValidationError = metrics.trackValidationError.bind(metrics);
export const trackFormAbandonment = metrics.trackFormAbandonment.bind(metrics);
export const trackSlowOperation = metrics.trackSlowOperation.bind(metrics);
export const trackPageView = metrics.trackPageView.bind(metrics);
export const trackSectionView = metrics.trackSectionView.bind(metrics);
export const trackAdminOperation = metrics.trackAdminOperation.bind(metrics);
