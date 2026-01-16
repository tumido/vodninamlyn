"use client";

import { usePageTracking } from '@/app/hooks/usePageTracking';

/**
 * Client component to track page views and time on page
 */
export const PageTracker = () => {
  usePageTracking();
  return null;
};
