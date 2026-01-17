"use client";

import { useEffect, useState, useRef } from "react";

interface UseIntersectionObserverOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * Custom hook for Intersection Observer API
 * Returns a ref to attach to the element and a boolean indicating visibility
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {},
) => {
  const { rootMargin = "0px", threshold = 0.1 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { isVisible, ref };
};
