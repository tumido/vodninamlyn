"use client";
import Mill from "../ui/Mill";

export const Hero = () => {
  return (
    <section className=" relative hero-gradient h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Main content */}
      <div className="w-full grow flex items-center min-w-7xl max-w-7xl">
        <Mill />
      </div>

      {/* Scroll indicator */}
      <div className="mb-8 animate-bounce absolute bottom-0">
        <svg
          className="w-6 h-6 mx-auto text-amber-200"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};
