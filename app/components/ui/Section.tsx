"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { useSectionTracking } from "@/app/hooks/useSectionTracking";

interface SectionProps {
  animate?: boolean;
  children: ReactNode;
  className?: string;
  id?: string;
  trackVisibility?: boolean;
}

export const Section = ({
  animate = true,
  children,
  className = "",
  id,
  trackVisibility = true,
}: SectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  // Track section visibility - hook is called unconditionally
  // Pass empty string when tracking is disabled or no ID is provided
  useSectionTracking(trackVisibility && id ? id : "", sectionRef);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`w-full px-6 py-16 md:px-12 md:py-20 lg:px-24 last-of-type:lg:pb-32 nth-of-type-[2]:lg:pt-32 ${className}`}
    >
      <div className="mx-auto">
        {animate ? <ScrollReveal>{children}</ScrollReveal> : children}
      </div>
    </section>
  );
};
