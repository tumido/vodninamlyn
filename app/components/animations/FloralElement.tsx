'use client';

import { useEffect, useState } from 'react';

interface FloralElementProps {
  children: React.ReactNode;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  delay: number;
  animation: 'grow-left' | 'grow-right' | 'grow-bottom';
}

export const FloralElement = ({
  children,
  position,
  delay,
  animation
}: FloralElementProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch device
    setIsTouchDevice('ontouchstart' in window);

    // Trigger entrance animation after delay
    const timer = setTimeout(() => setHasLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`absolute hidden md:block pointer-events-none ${
        hasLoaded ? `animate-${animation}` : 'opacity-0'
      }`}
      style={{
        ...position,
        width: 'clamp(60px, 10vw, 150px)',
        height: 'clamp(60px, 10vw, 150px)',
        willChange: hasLoaded ? 'auto' : 'transform, opacity'
      }}
    >
      <div
        className={`floral-hover-transition ${isHovered ? 'opacity-30' : 'opacity-100'}`}
        onMouseEnter={!isTouchDevice ? () => setIsHovered(true) : undefined}
        onMouseLeave={!isTouchDevice ? () => setIsHovered(false) : undefined}
        style={{ pointerEvents: 'auto' }}
      >
        {children}
      </div>
    </div>
  );
};
