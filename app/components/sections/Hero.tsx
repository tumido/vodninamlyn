import { WEDDING_INFO } from "@/app/lib/constants";

export const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-white to-neutral-50">
      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-light text-neutral-900 mb-4">
          {WEDDING_INFO.couple.bride}
          <span className="block text-pastel-orange my-4">&</span>
          {WEDDING_INFO.couple.groom}
        </h1>

        <div className="mt-8 space-y-2">
          <p className="text-2xl md:text-3xl text-neutral-700">
            {WEDDING_INFO.date.display}
          </p>
          <p className="text-xl text-neutral-600">{WEDDING_INFO.date.time}</p>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <svg
            className="w-6 h-6 mx-auto text-pastel-blue"
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
