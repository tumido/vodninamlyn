"use client";
import Mill from "@/app/components/ui/Mill";
import Icon from "../ui/Icon";

export const Hero = () => {
  return (
    <section className="hero-gradient relative flex h-screen flex-col items-center justify-center overflow-hidden">
      {/* Main content */}
      <div className="flex w-full max-w-7xl min-w-6xl grow items-center">
        <Mill />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-0 mb-8 w-8 animate-bounce">
        <Icon icon="arrow-down" animate={false} className="stroke-amber-200" />
      </div>
    </section>
  );
};
