import type { ReactNode } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  animate?: boolean;
}

export const Section = ({
  children,
  className = "",
  id,
  animate = true,
}: SectionProps) => {
  return (
    <section
      id={id}
      className={`w-full px-6 py-16 md:px-12 md:py-20 lg:px-24 nth-of-type-[2]:lg:pt-32 last-of-type:lg:pb-32  ${className}`}
    >
      <div className="mx-auto">
        {animate ? <ScrollReveal>{children}</ScrollReveal> : children}
      </div>
    </section>
  );
};
