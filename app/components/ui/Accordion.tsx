"use client";

import { useState, ReactNode } from "react";
import Icon from "./Icon";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion = ({ items, className = "" }: AccordionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border-b border-palette-green/20 pb-4 last:border-0"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full text-left flex justify-between items-center gap-4 group cursor-pointer"
          >
            <h3 className="text-xl">{item.title}</h3>
            <span
              className={`text-2xl transition-transform shrink-0 w-8 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <Icon icon="arrow-down" animate={false} />
            </span>
          </button>

          {openIndex === index && (
            <div className="mt-4 mb-8 text-lg leading-relaxed text-neutral-700 animate-in fade-in duration-200">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
