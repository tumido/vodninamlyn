import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { Accordion } from "../ui/Accordion";
import { WEDDING_INFO } from "@/app/lib/constants";

export const Accommodation = () => {
  const accommodationItems = WEDDING_INFO.accommodation.options.map(
    (option) => ({
      title: option.beds
        ? `${option.title} (${option.beds} míst)`
        : option.title,
      content: option.content,
    })
  );

  return (
    <Section id="nocleh" className="pt-0">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_32px_2fr] gap-12 items-start">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-24 h-24 m-4 mx-auto">
            <Icon icon="tent" />
          </div>
          <h3>{WEDDING_INFO.accommodation.heading}</h3>
          <p className="text-lg leading-relaxed text-center">
            {WEDDING_INFO.accommodation.description}
          </p>
        </div>
        <div className="w-8 h-full hidden md:block self-center">
          <Icon icon="bracket" preserveAspectRatio={false} />
        </div>

        <div className=" pt-12">
          <Accordion items={accommodationItems} />
        </div>
      </div>
    </Section>
  );
};
