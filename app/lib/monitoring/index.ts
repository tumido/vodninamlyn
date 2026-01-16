/**
 * Unified monitoring module for the application
 *
 * This module consolidates logging, performance tracking, and metrics
 * into a single import point.
 *
 * Usage:
 * ```typescript
 * import { logger, performance, metrics } from '@/app/lib/monitoring';
 *
 * // Logging
 * logger.info('Operation completed', { operation: 'fetch' });
 * logger.error('Operation failed', error, { operation: 'fetch' });
 *
 * // Performance tracking
 * const result = await performance.measureAsync(
 *   OperationType.DB_QUERY,
 *   'fetch_users',
 *   async () => await fetchUsers()
 * );
 *
 * // Event tracking
 * metrics.track(MetricEvent.PAGE_VIEW, { path: '/home' });
 * ```
 */

// Core modules
import * as logger from './core/logger';
import * as performance from './core/performance';
import * as metrics from './core/metrics';

// Re-export everything from types
export * from './types';

// Re-export dashboard metrics
export * from './dashboardMetrics';

// Re-export error handling
export * from './errorHandling';

// Export core modules as namespaces
export { logger, performance, metrics };
