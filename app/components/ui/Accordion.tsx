"use client";

import { useState, ReactNode } from "react";
import Icon from "./Icon";

export interface AccordionItem {
  content: ReactNode;
  title: string;
}

interface AccordionProps {
  className?: string;
  items: AccordionItem[];
}

export const Accordion = ({ className = "", items }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border-palette-green/20 border-b pb-4 last:border-0"
        >
          <button
            onClick={() => toggleItem(index)}
            className="group flex w-full cursor-pointer items-center justify-between gap-4 text-left"
          >
            <h3 className="text-xl">{item.title}</h3>
            <span
              className={`w-8 shrink-0 text-2xl transition-transform ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <Icon icon="arrow-down" animate={false} />
            </span>
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              openIndex === index
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="text-palette-dark-green mt-4 mb-8 text-lg leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
