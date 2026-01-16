"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/app/lib/utils/metrics';

/**
 * Hook to track page views and time spent on page
 */
export const usePageTracking = () => {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(0);

  useEffect(() => {
    // Track new page view
    pageStartTimeRef.current = Date.now();

    trackPageView(pathname, {
      component: 'usePageTracking',
    });

    // Track time spent when leaving page
    return () => {
      const timeSpentMs = Date.now() - pageStartTimeRef.current;

      // Only track if user spent more than 1 second on page
      if (timeSpentMs > 1000) {
        trackPageView(pathname, {
          component: 'usePageTracking',
          timeSpentMs,
          leaving: true,
        });
      }
    };
  }, [pathname]);
};
