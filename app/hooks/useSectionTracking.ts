"use client";

import { useEffect, useRef } from "react";
import { metrics } from "@/app/lib/monitoring";

/**
 * Hook to track when a section becomes visible (scroll tracking)
 */
export const useSectionTracking = (
  sectionName: string,
  elementRef: React.RefObject<HTMLElement | null>,
) => {
  const hasBeenViewedRef = useRef(false);
  const viewStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !sectionName) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Section became visible
            if (!hasBeenViewedRef.current) {
              hasBeenViewedRef.current = true;
              viewStartTimeRef.current = Date.now();

              metrics.trackSectionView(sectionName, {
                component: "useSectionTracking",
                visibility: entry.intersectionRatio,
              });
            }
          } else {
            // Section left viewport
            if (viewStartTimeRef.current !== null) {
              const timeViewedMs = Date.now() - viewStartTimeRef.current;

              // Track time spent viewing if more than 1 second
              if (timeViewedMs > 1000) {
                metrics.trackSectionView(sectionName, {
                  component: "useSectionTracking",
                  leaving: true,
                  timeViewed: timeViewedMs,
                });
              }

              viewStartTimeRef.current = null;
            }
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: [0.1, 0.5, 0.9], // Track at 10%, 50%, and 90% visibility
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [sectionName, elementRef]);
};
