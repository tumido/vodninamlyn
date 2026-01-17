import { Section } from "@/app/components/ui/Section";
import { WEDDING_INFO } from "@/app/lib/constants";
import { Accordion } from "../ui/Accordion";

export const FAQ = () => {
  const faqItems = WEDDING_INFO.faq.map((item) => ({
    content: item.answer,
    title: item.question,
  }));

  return (
    <Section id="faq" animate={true}>
      <h2 className="mb-16">Možná se chcete zeptat</h2>

      <Accordion items={faqItems} className="mx-auto max-w-3xl" />
    </Section>
  );
};
