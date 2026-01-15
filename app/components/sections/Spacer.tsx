"use client";

import { Section } from "@/app/components/ui/Section";
import Icon from "../ui/Icon";

const Spacer = () => {
  return (
    <Section>
      <div className="h-20 md:h-40 max-w-2xl mx-auto aspect-20/4">
        <Icon icon="rings" />
      </div>
    </Section>
  );
};
export default Spacer;
