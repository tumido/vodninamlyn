import { Section } from "@/app/components/ui/Section";
import { WEDDING_INFO } from "@/app/lib/constants";
import { Accordion } from "../ui/Accordion";

export const FAQ = () => {
  const faqItems = WEDDING_INFO.faq.map((item) => ({
    title: item.question,
    content: item.answer,
  }));

  return (
    <Section id="faq" animate={true}>
      <h2 className="mb-16">Možná se chcete zeptat</h2>

      <Accordion items={faqItems} className="max-w-3xl mx-auto" />
    </Section>
  );
};
