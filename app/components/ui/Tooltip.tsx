"use client";

import { useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  if (!content || content === "-") {
    return <>{children}</>;
  }

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2 + window.scrollX,
        top: rect.top + window.scrollY - 8,
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
            className="pointer-events-none fixed z-50 w-max max-w-xs -translate-x-1/2 -translate-y-full transform rounded-lg bg-gray-900 px-3 py-2 text-sm whitespace-normal text-white shadow-lg"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
            }}
          >
            {content}
            <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900"></div>
          </div>,
          document.body,
        )}
    </>
  );
}
