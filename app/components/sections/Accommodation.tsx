import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { Accordion } from "../ui/Accordion";
import { WEDDING_INFO } from "@/app/lib/constants";

export const Accommodation = () => {
  const accommodationItems = WEDDING_INFO.accommodation.options.map(
    (option) => ({
      content: option.content,
      title: option.beds
        ? `${option.title} (${option.beds} míst)`
        : option.title,
    }),
  );

  return (
    <Section id="nocleh" className="pt-0">
      <div className="mx-auto grid max-w-7xl items-start gap-12 md:grid-cols-[1fr_32px_2fr]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="m-4 mx-auto h-24 w-24">
            <Icon icon="tent" />
          </div>
          <h3>{WEDDING_INFO.accommodation.heading}</h3>
          <p className="text-center text-lg leading-relaxed">
            {WEDDING_INFO.accommodation.description}
          </p>
        </div>
        <div className="hidden h-full w-8 self-center md:block">
          <Icon icon="bracket" preserveAspectRatio={false} />
        </div>

        <div className="pt-12">
          <Accordion items={accommodationItems} />
        </div>
      </div>
    </Section>
  );
};
