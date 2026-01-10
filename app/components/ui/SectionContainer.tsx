import type { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const SectionContainer = ({ children, className = '', id }: SectionContainerProps) => {
  return (
    <section
      id={id}
      className={`w-full px-6 py-16 md:px-12 md:py-24 lg:px-24 lg:py-32 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        {children}
      </div>
    </section>
  );
};
