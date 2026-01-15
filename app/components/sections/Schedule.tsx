import { WEDDING_INFO } from "@/app/lib/constants";
import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import React from "react";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";

export const Schedule = () => {
  return (
    <Section id="program" className="" animate={true}>
      <h2 className="text-4xl lg:mb-16">Tohle vše se stane</h2>

      <div className="lg:grid grid-cols-[2fr_3fr] items-center">
        <div className="lg:h-128 lg:w-lg lg:mr-0 aspect-square w-full md:w-1/2 mx-auto mb-24 md:mb-0">
          <Icon icon="mill" duration={3} />
        </div>
        <div className="grid lg:grid-cols-[1fr_10px_4fr] grid-cols-[1fr_10px_3fr]">
          <div className="row-start-1 row-end-10 col-start-2">
            <Icon icon="vertical-line" preserveAspectRatio={false} />
          </div>
          {WEDDING_INFO.schedule.map((item) => (
            <React.Fragment key={item.title}>
              <div className="md:text-lg text-right pr-8 py-8 text-palette-green">
                <ScrollReveal>{item.time}</ScrollReveal>
              </div>
              <div className="space-y-2 pl-8 py-8 col-start-3 relative">
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
