"use client";
import Mill from "@/app/components/ui/Mill";
import Icon from "../ui/Icon";

export const Hero = () => {
  return (
    <section className="relative hero-gradient h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Main content */}
      <div className="w-full grow flex items-center min-w-6xl max-w-7xl">
        <Mill />
      </div>

      {/* Scroll indicator */}
      <div className="mb-8 animate-bounce absolute bottom-0 w-8">
        <Icon icon="arrow-down" animate={false} className="stroke-amber-200" />
      </div>
    </section>
  );
};
