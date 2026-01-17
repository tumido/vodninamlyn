/**
 * Custom metrics tracking system for business and user analytics.
 * Tracks events, user behavior, and business metrics.
 *
 * IMPORTANT: Use this module for event tracking and business metrics.
 * For performance measurement, use the performance module.
 * For logging, use the logger module.
 */

import * as Sentry from "@sentry/nextjs";
import type {
  MetricEvent,
  MetricData,
  ValidationErrorData,
  FormAbandonmentData,
} from "../types";
import { MetricEvent as MetricEventEnum } from "../types";
import * as logger from "./logger";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Track a metric event
 */
export function track(event: MetricEvent, data?: MetricData): void {
  const enrichedData: MetricData = {
    ...data,
    timestamp: Date.now(),
  };

  // Log in development
  if (isDevelopment) {
    logger.debug(`Metric: ${event}`, enrichedData);
    return;
  }

  // Add to Sentry breadcrumb for production
  Sentry.addBreadcrumb({
    category: "metric",
    data: enrichedData,
    level: "info",
    message: event,
  });
}

/**
 * Track RSVP form submission
 */
export function trackRsvpSubmission(success: boolean, data?: MetricData): void {
  const event = MetricEventEnum.RSVP_FORM_SUBMITTED;
  track(event, { ...data, success });

  // Record counter metrics
  if (!isDevelopment) {
    Sentry.metrics.count("rsvp.submissions", 1);

    if (success) {
      Sentry.metrics.count("rsvp.submissions.success", 1);
    } else {
      Sentry.metrics.count("rsvp.submissions.failure", 1);
    }
  }
}

/**
 * Track validation error
 */
export function trackValidationError(
  field: string,
  errorType: string,
  errorMessage: string,
): void {
  const data: ValidationErrorData = {
    errorMessage,
    errorType,
    field,
  };

  track("rsvp.validation.error" as MetricEvent, data);

  // Record counter for validation errors
  if (!isDevelopment) {
    Sentry.metrics.count("rsvp.validation.errors", 1);
  }
}

/**
 * Track form abandonment
 */
export function trackFormAbandonment(formData: FormAbandonmentData): void {
  track("form.abandoned" as MetricEvent, formData);

  logger.info("Form abandoned", {
    component: formData.formName,
    metadata: {
      completionPercentage: formData.completionPercentage,
      lastField: formData.lastField,
      timeSpentMs: formData.timeSpentMs,
    },
  });
}

/**
 * Track page view
 */
export function trackPageView(path: string, metadata?: MetricData): void {
  track(MetricEventEnum.PAGE_VIEW, {
    ...metadata,
    path,
  });
}

/**
 * Track section viewed (scroll into view)
 */
export function trackSectionView(
  sectionName: string,
  metadata?: MetricData,
): void {
  track(MetricEventEnum.SECTION_VIEWED, {
    ...metadata,
    section: sectionName,
  });
}

/**
 * Track admin operation
 */
export function trackAdminOperation(
  operation: "login" | "logout" | "view" | "edit" | "delete",
  success: boolean,
  metadata?: MetricData,
): void {
  let event: string;

  switch (operation) {
    case "login":
      event = success ? "admin.login.success" : "admin.login.failure";
      break;
    case "logout":
      event = "admin.logout";
      break;
    case "view":
      event = "admin.rsvp.viewed";
      break;
    case "edit":
      event = "admin.rsvp.edited";
      break;
    case "delete":
      event = "admin.rsvp.deleted";
      break;
  }

  track(event as MetricEvent, {
    ...metadata,
    success,
  });
}
