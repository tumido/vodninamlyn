import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";

export const AdditionalInfo = () => {
  return (
    <Section id="o-svatbe" className="flex flex-col" animate={true}>
      <div className="grid max-w-5xl gap-12 md:grid-cols-2">
        {WEDDING_INFO.details.map((detail) => (
          <div
            key={detail.name}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="m-4 h-24 w-24">
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
