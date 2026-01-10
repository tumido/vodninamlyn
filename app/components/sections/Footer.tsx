import { WEDDING_INFO } from '@/app/lib/constants';

export const Footer = () => {
  return (
    <footer className="relative bg-neutral-900 text-white py-16 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-serif font-light mb-4">
          {WEDDING_INFO.couple.bride} & {WEDDING_INFO.couple.groom}
        </h3>

        <p className="text-neutral-400 mb-6">
          Těšíme se, že s námi budete slavit náš velký den!
        </p>

        <div className="space-y-2 text-neutral-300">
          <p>
            <a
              href={`mailto:${WEDDING_INFO.contact.email}`}
              className="hover:text-pastel-blue transition-colors"
            >
              {WEDDING_INFO.contact.email}
            </a>
          </p>
          <p>
            <a
              href={`tel:${WEDDING_INFO.contact.phone.replace(/\s/g, '')}`}
              className="hover:text-pastel-orange transition-colors"
            >
              {WEDDING_INFO.contact.phone}
            </a>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-800 text-sm text-neutral-500">
          <p>{WEDDING_INFO.date.display}</p>
        </div>
      </div>
    </footer>
  );
};
