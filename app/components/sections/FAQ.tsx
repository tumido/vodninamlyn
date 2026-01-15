"use client";

import { Section } from "@/app/components/ui/Section";
import { useState } from "react";
import { WEDDING_INFO } from "@/app/lib/constants";
import Icon from "../ui/Icon";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section id="faq" animate={true}>
      <h2 className="mb-16">Možná se chcete zeptat</h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {WEDDING_INFO.faq.map((item, index) => (
          <div
            key={index}
            className="border-b border-palette-green/20 pb-4 last:border-0"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full text-left flex justify-between items-center gap-4 group cursor-pointer"
            >
              <h3 className="text-xl">{item.question}</h3>
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
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
};
