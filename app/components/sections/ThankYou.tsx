"use client";

import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";

export const ThankYou = () => {
  // Check if wedding has passed
  const weddingDate = new Date(WEDDING_INFO.date.full);
  const now = new Date();
  const hasWeddingPassed = now > weddingDate;

  return (
    <Section id="dekujeme">
      <div
        className={`text-center mx-auto ${
          hasWeddingPassed ? "max-w-3xl" : "max-w-2xl"
        }`}
      >
        <div className="w-24 h-24 mb-8 mx-auto">
          <Icon icon="heart" />
        </div>

        {hasWeddingPassed ? (
          <>
            <h2 className="mb-8">Děkujeme</h2>
            <p className="text-xl leading-relaxed mb-12">
              Děkujeme všem, kteří s námi sdíleli tento den. Vaše přítomnost pro
              nás byla tím nejkrásnějším darem.
            </p>

            {/* Photo gallery placeholder - to be filled after the wedding */}
            <div className="mt-16">
              <h3 className="mb-8">Fotografie ze svatby</h3>
              <div className="bg-white/50 rounded-lg p-12 text-neutral-500">
                <p>Brzy zde naleznete fotografie z našeho velkého dne.</p>
                <p className="mt-4 text-sm">
                  Profesionální fotografie budou k dispozici v příštích týdnech.
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div className="mt-16 pt-8 border-t border-palette-green/20">
              <p className="text-lg">
                Máte fotografie nebo vzpomínky, které byste chtěli sdílet?
              </p>
              <p className="mt-4">
                <a
                  href={`mailto:${WEDDING_INFO.contact.email}`}
                  className="text-palette-orange hover:underline"
                >
                  Napište nám
                </a>
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-8">Těšíme se na vás</h2>
            <p className="text-xl leading-relaxed">
              Jsme rádi, že jste se rozhodli s námi sdílet tento den. Po svatbě
              zde najdete fotografie a další vzpomínky.
            </p>
          </>
        )}
      </div>
    </Section>
  );
};
