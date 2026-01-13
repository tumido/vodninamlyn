import { WEDDING_INFO } from "@/app/lib/constants";
import { Section } from "../ui/Section";
import type { ScheduleItem } from "@/app/lib/types";

const TimelineItem = ({
  item,
  isHighlight,
}: {
  item: ScheduleItem;
  isHighlight: boolean;
}) => (
  <div className="relative flex flex-col items-center min-w-45 md:min-w-50">
    {/* Icon */}
    <div className="text-4xl md:text-5xl mb-4 md:mb-6">{item.icon}</div>

    {/* Bullet point for ceremony */}
    {isHighlight && (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 md:top-auto md:bottom-0 md:-mb-8 z-10">
        <div className="w-4 h-4 rounded-full bg-pastel-blue-dark border-4 border-pastel-cream" />
      </div>
    )}

    {/* Content */}
    <div className="text-center space-y-2 md:space-y-3">
      <div className="text-lg md:text-xl font-semibold text-pastel-blue-dark">
        {item.time}
      </div>
      <h3 className="text-xl md:text-2xl font-medium text-neutral-900">
        {item.title}
      </h3>
      <p className="text-sm md:text-base text-neutral-600 max-w-50">
        {item.description}
      </p>
    </div>
  </div>
);

export const Schedule = () => {
  return (
    <Section id="program" className="" animate={true}>
      <h2 className="text-4xl md:text-6xl font-serif font-light text-center text-neutral-900 mb-12 md:mb-16">
        Tohle vše se stane
      </h2>

      {/* Timeline container */}
      <div className="relative">
        {/* Timeline line - vertical on mobile, horizontal on desktop */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-palette-dark-green md:hidden" />

        {/* Timeline days */}
        <div className="flex flex-col md:flex-row gap-0">
          {WEDDING_INFO.schedule.map((scheduleDay, dayIndex) => (
            <div key={dayIndex}>
              {/* Day header */}
              <div className="text-center pt-8 pb-6 md:pt-0 md:pb-8">
                <h3 className="text-2xl md:text-3xl font-serif font-light text-pastel-blue-dark">
                  {scheduleDay.day}
                </h3>
                {scheduleDay.date && (
                  <p className="text-sm md:text-base text-neutral-600 mt-1">
                    {scheduleDay.date}
                  </p>
                )}
              </div>

              {/* Desktop timeline line for this day section */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 rounded-full bg-palette-dark-green -translate-y-1/2" />

              {/* Timeline items */}
              <div className="flex flex-col md:flex-row md:justify-around gap-12 md:gap-8 pl-16 md:pl-0 pb-12 md:pb-0">
                {scheduleDay.items.map((item, index) => (
                  <TimelineItem
                    key={index}
                    item={item}
                    isHighlight={item.title === "Obřad"}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
