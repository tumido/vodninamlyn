import { WEDDING_INFO } from "@/app/lib/constants";
import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import SquigglyLine from "@/app/components/ui/SquigglyLine";
import React from "react";
import { ScrollReveal } from "@/app/components/ui/ScrollReveal";

export const Schedule = () => {
  return (
    <Section id="program" className="" animate={true}>
      <h2 className="text-4xl mb-16">Tohle vše se stane</h2>

      <div className="lg:grid grid-cols-[2fr_3fr] items-center">
        <div className="lg:h-128 lg:w-lg lg:mr-0 aspect-square w-full mx-auto mb-24 lg:mb-0">
          <Icon icon="mill" duration={2} />
        </div>
        <div className="grid grid-cols-[1fr_10px_4fr]">
          <div className="row-start-1 row-end-10 col-start-2">
            <SquigglyLine />
          </div>
          {WEDDING_INFO.schedule.map((item) => (
            <React.Fragment key={item.title}>
              <div className="text-lg text-right pr-8 py-8 text-palette-green">
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
