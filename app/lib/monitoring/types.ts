/**
 * Shared types for the monitoring system
 */

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

export enum OperationType {
  // Auth operations
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_CHECK = 'auth.check',

  // RSVP operations
  RSVP_SUBMIT = 'rsvp.submit',
  RSVP_FETCH = 'rsvp.fetch',
  RSVP_UPDATE = 'rsvp.update',
  RSVP_DELETE = 'rsvp.delete',
}

export interface PerformanceContext {
  userId?: string;
  component?: string;
  metadata?: Record<string, unknown>;
}

export enum MetricEvent {
  // RSVP Events
  RSVP_FORM_STARTED = 'rsvp.form.started',
  RSVP_FORM_SUBMITTED = 'rsvp.form.submitted',

  // Admin Events
  ADMIN_LOGIN_ATTEMPT = 'admin.login.attempt',

  // User Engagement Events
  PAGE_VIEW = 'page.view',
  SECTION_VIEWED = 'section.viewed',
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
