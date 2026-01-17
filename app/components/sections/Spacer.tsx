"use client";

import { Section } from "@/app/components/ui/Section";
import Icon from "../ui/Icon";

const Spacer = () => {
  return (
    <Section>
      <div className="mx-auto aspect-20/4 h-20 max-w-2xl md:h-40">
        <Icon icon="rings" />
      </div>
    </Section>
  );
};
export default Spacer;
