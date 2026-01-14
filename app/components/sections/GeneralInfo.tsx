import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";

export const GeneralInfo = () => {
  return (
    <Section id="o-svatbe" className="flex flex-col" animate={true}>
      <h2>Slavíme spolu</h2>
      <p className="text-xl leading-relaxed mb-12 max-w-2xl text-center mx-auto">
        Jak již víte, rozhodli jsme se, že od 18. dubna 2026 budeme manželé. Prý
        to není samo sebou! Je k tomu potřeba svatba. Tak budiž. Našli jsme
        krásné místo a pozvali vás - naše rodiny a kamarády. Budeme rádi, když
        budete tento čas trávit a slavit s námi.
      </p>

      <div className="grid md:grid-cols-2 gap-12 mt-24 max-w-5xl">
        {WEDDING_INFO.details.map((detail) => (
          <div
            key={detail.name}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="w-24 h-24 m-4">
              <Icon icon={detail.icon} />
            </div>
            <h3>{detail.name}</h3>
            <p className="text-lg leading-relaxed">{detail.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
};
