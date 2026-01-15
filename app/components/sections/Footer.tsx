import { WEDDING_INFO } from "@/app/lib/constants";
import Icon from "../ui/Icon";

export const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-16 overflow-hidden">
      <div className="z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="space-y-2">
            <h3>
              <span className="text-amber-200/40 text-3xl font-semibold font-serif [word-spacing:.3em]">
                {WEDDING_INFO.couple.groom}
                <span className="text-xl text-palette-beige/50 align-middle">
                  {" "}
                  &{" "}
                </span>
                {WEDDING_INFO.couple.bride}
              </span>
            </h3>

            <div className="text-palette-beige/50">
              {WEDDING_INFO.date.display}
            </div>
          </div>
          <div className="w-52 h-52 m-4">
            <Icon
              icon="mill"
              duration={3}
              className="stroke-palette-beige/50"
            />
          </div>
          <div className="space-y-2">
            <a
              href={`mailto:${WEDDING_INFO.contact.email}`}
              className="hover:text-palette-orange text-palette-beige/50 transition-colors block"
            >
              {WEDDING_INFO.contact.email}
            </a>
            <a
              href={`tel:${WEDDING_INFO.contact.phone.replace(/\s/g, "")}`}
              className="hover:text-palette-orange text-palette-beige/50 transition-colors block"
            >
              {WEDDING_INFO.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
