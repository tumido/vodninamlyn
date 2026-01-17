import { WEDDING_INFO } from "@/app/lib/constants";
import Icon from "../ui/Icon";

export const Footer = () => {
  return (
    <footer className="overflow-hidden bg-neutral-900 py-16 text-white">
      <div className="z-10 mx-auto max-w-4xl px-6 text-center">
        <div className="mx-auto flex flex-col items-center justify-center gap-4 md:flex-row">
          <div className="space-y-2">
            <h3>
              <span className="font-serif text-3xl font-semibold text-amber-200/40 [word-spacing:.3em]">
                {WEDDING_INFO.couple.groom}
                <span className="text-palette-beige/50 align-middle text-xl">
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
          <div className="m-4 h-32 w-32 shrink md:ml-20">
            <Icon icon="clover" className="stroke-palette-beige/50" />
          </div>
          <div className="max-w-3xs space-y-2">
            <a
              href={`mailto:${WEDDING_INFO.contact.email}`}
              className="hover:text-palette-orange text-palette-beige/50 block transition-colors"
            >
              {WEDDING_INFO.contact.email}
            </a>
            <span className="text-palette-beige/30">
              {WEDDING_INFO.contact.other}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
