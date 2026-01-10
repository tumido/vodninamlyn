"use client";

import { WEDDING_INFO } from "@/app/lib/constants";
import { RotatingText } from "@/app/components/animations/RotatingText";
import { FloralBackground } from "@/app/components/animations/FloralBackground";

export const Hero = () => {
  return (
    <section className="relative hero-gradient min-h-screen flex items-center justify-center overflow-hidden">
      {/* Floral background layer */}
      <FloralBackground />

      {/* Main content */}
      <div className="relative z-10 text-center w-full h-screen flex flex-col">
        {/* Centered content wrapper */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Names with rotating text - using absolute positioning to center ampersand */}
          <div className="mb-8 w-full mx-auto uppercase relative font-bilbo">
            {/* Desktop layout */}
            <div className="hidden md:block relative">
              {/* Ampersand - absolutely centered (rendered first for z-index) */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <span className="text-4xl md:text-5xl lg:text-6xl text-amber-100">
                  &
                </span>
              </div>

              {/* Left side: Groom prefix + name - positioned right of center */}
              <div className="absolute right-1/2 top-1/2 -translate-y-1/2 pr-8 md:pr-12">
                <div className="flex gap-2 justify-end">
                  <RotatingText
                    texts={WEDDING_INFO.couple.groomPrefixes}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-amber-50/80"
                    direction="right"
                    delay={0}
                  />
                  <h1 className="text-5xl md:text-7xl lg:text-8xl text-amber-50 font-semibold">
                    {WEDDING_INFO.couple.groom}
                  </h1>
                </div>
              </div>

              {/* Right side: Bride name + suffix - positioned left of center */}
              <div className="absolute left-1/2 top-1/2 -translate-y-1/2 pl-8 md:pl-12">
                <div className="flex gap-2">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl text-amber-50 font-semibold">
                    {WEDDING_INFO.couple.bride}
                  </h1>
                  <RotatingText
                    texts={WEDDING_INFO.couple.brideSuffixes}
                    className="text-5xl md:text-7xl lg:text-8xl font-light text-amber-50/80"
                    direction="left"
                    delay={100}
                  />
                </div>
              </div>

              {/* Invisible spacer to maintain height */}
              <div className="invisible flex items-center gap-2">
                <span className="text-5xl md:text-7xl lg:text-8xl font-light">
                  {WEDDING_INFO.couple.groom}
                </span>
              </div>
            </div>

            {/* Mobile layout - stacked vertically */}
            <div className="md:hidden flex flex-col items-center gap-4 font-bilbo">
              <div className="flex flex-col items-center gap-2">
                <RotatingText
                  texts={WEDDING_INFO.couple.groomPrefixes}
                  className="text-3xl font-light text-amber-50/80"
                  delay={0}
                />
                <h1 className="text-5xl font-semibold text-amber-50">
                  {WEDDING_INFO.couple.groom}
                </h1>
              </div>

              <span className="text-amber-100 text-4xl my-2">&</span>

              <div className="flex flex-col items-center gap-2">
                <h1 className="text-5xl font-semibold text-amber-50">
                  {WEDDING_INFO.couple.bride}
                </h1>
                <RotatingText
                  texts={WEDDING_INFO.couple.brideSuffixes}
                  className="text-3xl font-light text-amber-50/80"
                  delay={100}
                />
              </div>
            </div>
          </div>

          {/* Date and time */}
          <div className="mt-8 uppercase">
            <p className="text-2xl md:text-3xl text-amber-100/90 font-offside">
              {WEDDING_INFO.date.display} · {WEDDING_INFO.venue.name}
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mb-8 animate-bounce">
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
      </div>
    </section>
  );
};
