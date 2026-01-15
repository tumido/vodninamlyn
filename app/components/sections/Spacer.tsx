"use client";

import { Section } from "@/app/components/ui/Section";
import Icon from "../ui/Icon";

const Spacer = () => {
  return (
    <Section>
      <div className="mx-auto lg:pb-32 flex items-center">
        <div className="h-40 w-full max-w-2xl mx-auto">
          <Icon icon="rings" />
        </div>
      </div>
    </Section>
  );
};
export default Spacer;
