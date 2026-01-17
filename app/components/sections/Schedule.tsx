import { WEDDING_INFO } from "@/app/lib/constants";
import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import React from "react";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";

export const Schedule = () => {
  return (
    <Section id="program" className="" animate={true}>
      <h2 className="text-4xl lg:mb-16">Tohle vše se stane</h2>

      <div className="grid-cols-[2fr_3fr] items-center lg:grid">
        <div className="mx-auto mb-24 aspect-square w-full md:mb-0 md:w-1/2 lg:mr-0 lg:h-128 lg:w-lg">
          <Icon icon="mill" duration={3} />
        </div>
        <div className="grid grid-cols-[1fr_10px_3fr] lg:grid-cols-[1fr_10px_4fr]">
          <div className="col-start-2 row-start-1 row-end-10">
            <Icon icon="vertical-line" preserveAspectRatio={false} />
          </div>
          {WEDDING_INFO.schedule.map((item) => (
            <React.Fragment key={item.title}>
              <div className="text-palette-green py-8 pr-8 text-right md:text-lg">
                <ScrollReveal>{item.time}</ScrollReveal>
              </div>
              <div className="relative col-start-3 space-y-2 py-8 pl-8">
                <ScrollReveal>
                  <h3 className="text-xl">{item.title}</h3>
                </ScrollReveal>
                {item.description && (
                  <ScrollReveal>
                    <p className="text-lg">{item.description}</p>
                  </ScrollReveal>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </Section>
  );
};
