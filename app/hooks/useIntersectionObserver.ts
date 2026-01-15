"use client";

import { useEffect, useState, useRef } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
}

/**
 * Custom hook for Intersection Observer API
 * Returns a ref to attach to the element and a boolean indicating visibility
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const { threshold = 0.1, rootMargin = "0px" } = options;
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
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};
