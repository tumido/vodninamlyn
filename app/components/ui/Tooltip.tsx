"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!content || content === "-") {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY - 8,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg w-max max-w-xs whitespace-normal pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>,
          document.body
        )}
    </>
  );
}
