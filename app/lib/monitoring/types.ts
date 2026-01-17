/**
 * Shared types for the monitoring system
 */

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  [key: string]: unknown;
  component?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
  operation?: string;
  userId?: string;
}

export enum OperationType {
  // Auth operations
  AUTH_LOGIN = "auth.login",
  AUTH_LOGOUT = "auth.logout",
  AUTH_CHECK = "auth.check",

  // RSVP operations
  RSVP_SUBMIT = "rsvp.submit",
  RSVP_FETCH = "rsvp.fetch",
  RSVP_UPDATE = "rsvp.update",
  RSVP_DELETE = "rsvp.delete",
}

export interface PerformanceContext {
  component?: string;
  metadata?: Record<string, unknown>;
  userId?: string;
}

export enum MetricEvent {
  // RSVP Events
  RSVP_FORM_STARTED = "rsvp.form.started",
  RSVP_FORM_SUBMITTED = "rsvp.form.submitted",

  // Admin Events
  ADMIN_LOGIN_ATTEMPT = "admin.login.attempt",

  // User Engagement Events
  PAGE_VIEW = "page.view",
  SECTION_VIEWED = "section.viewed",
}

export interface MetricData {
  [key: string]: string | number | boolean | undefined;
  component?: string;
  timestamp?: number;
  userId?: string;
}

export interface ValidationErrorData extends MetricData {
  errorMessage: string;
  errorType: string;
  field: string;
}

export interface FormAbandonmentData extends MetricData {
  completionPercentage: number;
  formName: string;
  lastField?: string;
  timeSpentMs: number;
}
