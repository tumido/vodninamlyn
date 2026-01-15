import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";
import { Countdown } from "@/app/components/ui/Countdown";

export const KeyInfo = () => {
  return (
    <Section id="o-svatbe" className="flex flex-col" animate={true}>
      <h2>Slavíme spolu</h2>
      <p className="text-xl leading-relaxed mb-12 max-w-2xl text-center mx-auto">
        {WEDDING_INFO.leading}
      </p>

      <div className="mt-16">
        <Countdown targetDate={WEDDING_INFO.date.full} />
      </div>

      <div className="flex flex-col md:flex-row md:pt-56 justify-center gap-8 md:gap-16 py-12 md:pb-0">
        <div className="flex flex-col items-center text-center">
          <div className="lg:hidden w-24 h-24 m-4">
            <Icon icon="clock" />
          </div>
          <h4 className="text-3xl">{WEDDING_INFO.date.display}</h4>
          <p className="text-lg">{WEDDING_INFO.date.time}</p>
        </div>

        <div className="hidden lg:block h-96 w-96 lg:mr-0 aspect-square shrink-0 -translate-y-2/5">
          <Icon icon="mill" />
        </div>

        <div className="flex flex-col items-center text-center">
          <a
            href={WEDDING_INFO.venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer relative pb-4 flex flex-col items-center group mb-24 lg:mb-0"
          >
            <div className="lg:hidden w-24 h-24 m-4">
              <Icon icon="globe" />
            </div>
            <h4 className="text-3xl">{WEDDING_INFO.venue.name}</h4>
            <p className="text-lg">{WEDDING_INFO.venue.address.city}</p>
            <div className="absolute top-full lg:left-1/3 left-1/2 lg:w-80 lg:h-24 w-40 h-12">
              <Icon
                icon="arrow-map"
                className="group-hover:stroke-palette-orange stroke-palette-dark-green"
              />
            </div>
          </a>
        </div>
      </div>

      <p className="text-xl leading-relaxed max-w-2xl text-center mx-auto">
        {WEDDING_INFO.venue.text}
      </p>
      <p className="text-xl mt-12 leading-relaxed max-w-2xl text-center mx-auto">
        {WEDDING_INFO.date.text}
      </p>
    </Section>
  );
};
