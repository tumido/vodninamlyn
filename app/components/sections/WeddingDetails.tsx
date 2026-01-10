import { WEDDING_INFO } from '@/app/lib/constants';
import { SectionContainer } from '../ui/SectionContainer';
import { ScrollReveal } from '../animations/ScrollReveal';
import { AnimatedDivider } from '../animations/AnimatedDivider';
import type { Venue } from '@/app/lib/types';

const VenueCard = ({ venue, title }: { venue: Venue; title: string }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-neutral-100">
    <h3 className="text-2xl font-semibold text-neutral-900 mb-4">{title}</h3>
    <div className="space-y-3">
      <div>
        <p className="text-xl font-medium text-pastel-blue-dark">{venue.name}</p>
      </div>
      <div className="text-neutral-700">
        <p>{venue.address.street}</p>
        <p>{venue.address.city} {venue.address.zip}</p>
      </div>
      <a
        href={venue.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-pastel-blue hover:text-pastel-blue-dark transition-colors underline"
      >
        Zobrazit na mapě →
      </a>
    </div>
  </div>
);

export const WeddingDetails = () => {
  return (
    <SectionContainer id="detaily" className="bg-neutral-50">
      <ScrollReveal>
        <h2 className="text-4xl md:text-5xl font-serif font-light text-center text-neutral-900 mb-4">
          Detaily svatby
        </h2>
        <p className="text-center text-neutral-600 mb-12 max-w-2xl mx-auto">
          Těšíme se, že s námi budete slavit náš velký den
        </p>

        <AnimatedDivider />

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <VenueCard venue={WEDDING_INFO.venue.ceremony} title="Obřad" />
          <VenueCard venue={WEDDING_INFO.venue.reception} title="Hostina" />
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
};
