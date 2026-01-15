import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";

export const AdditionalInfo = () => {
  return (
    <Section id="o-svatbe" className="flex flex-col" animate={true}>
      <div className="grid md:grid-cols-2 gap-12 max-w-5xl">
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
