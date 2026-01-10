import { WEDDING_INFO } from '@/app/lib/constants';
import { SectionContainer } from '../ui/SectionContainer';
import { ScrollReveal } from '../animations/ScrollReveal';
import type { ScheduleItem } from '@/app/lib/types';

const ScheduleItemCard = ({ item }: { item: ScheduleItem }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="text-5xl mb-4">{item.icon}</div>
    <div className="text-xl font-semibold text-pastel-blue-dark mb-2">{item.time}</div>
    <h3 className="text-2xl font-medium text-neutral-900 mb-2">{item.title}</h3>
    <p className="text-neutral-600">{item.description}</p>
  </div>
);

export const Schedule = () => {
  return (
    <SectionContainer id="program" className="bg-white">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-neutral-900 mb-12">
          Program dne
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {WEDDING_INFO.schedule.map((item, index) => (
            <ScheduleItemCard key={index} item={item} />
          ))}
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
};
