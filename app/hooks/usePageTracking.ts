"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { metrics } from "@/app/lib/monitoring";

/**
 * Hook to track page views and time spent on page
 */
export const usePageTracking = () => {
  const pathname = usePathname();
  const pageStartTimeRef = useRef<number>(0);

  useEffect(() => {
    // Track new page view
    pageStartTimeRef.current = Date.now();

    metrics.trackPageView(pathname, {
      component: "usePageTracking",
    });

    // Track time spent when leaving page
    return () => {
      const timeSpentMs = Date.now() - pageStartTimeRef.current;

      // Only track if user spent more than 1 second on page
      if (timeSpentMs > 1000) {
        metrics.trackPageView(pathname, {
          component: "usePageTracking",
          leaving: true,
          timeSpentMs,
        });
      }
    };
  }, [pathname]);
};
