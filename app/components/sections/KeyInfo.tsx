import { Section } from "@/app/components/ui/Section";
import Icon from "@/app/components/ui/Icon";
import { WEDDING_INFO } from "@/app/lib/constants";
import { Countdown } from "@/app/components/ui/Countdown";

export const KeyInfo = () => {
  return (
    <Section id="o-svatbe" className="flex flex-col" animate={true}>
      <h2>Slavíme spolu</h2>
      <p className="mx-auto mb-12 max-w-2xl text-center text-xl leading-relaxed">
        {WEDDING_INFO.leading}
      </p>

      <div className="mt-16">
        <Countdown targetDate={WEDDING_INFO.date.full} />
      </div>

      <div className="flex flex-col justify-center gap-8 py-12 md:flex-row md:gap-16 md:pt-56 md:pb-0">
        <div className="flex flex-col items-center text-center">
          <div className="m-4 h-24 w-24 lg:hidden">
            <Icon icon="clock" />
          </div>
          <h4 className="text-3xl">{WEDDING_INFO.date.display}</h4>
          <p className="text-lg">{WEDDING_INFO.date.time}</p>
        </div>

        <div className="hidden aspect-square h-96 w-96 shrink-0 -translate-y-2/5 lg:mr-0 lg:block">
          <Icon icon="mill" />
        </div>

        <div className="flex flex-col items-center text-center">
          <a
            href={WEDDING_INFO.venue.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mb-24 flex cursor-pointer flex-col items-center pb-4 lg:mb-0"
          >
            <div className="m-4 h-24 w-24 lg:hidden">
              <Icon icon="globe" />
            </div>
            <h4 className="text-3xl">{WEDDING_INFO.venue.name}</h4>
            <p className="text-lg">{WEDDING_INFO.venue.address.city}</p>
            <div className="absolute top-full left-1/2 h-12 w-40 lg:left-1/3 lg:h-24 lg:w-80">
              <Icon
                icon="arrow-map"
                className="group-hover:stroke-palette-orange stroke-palette-dark-green"
              />
            </div>
          </a>
        </div>
      </div>

      <p className="mx-auto max-w-2xl text-center text-xl leading-relaxed">
        {WEDDING_INFO.venue.text}
      </p>
      <p className="mx-auto mt-12 max-w-2xl text-center text-xl leading-relaxed">
        {WEDDING_INFO.date.text}
      </p>
    </Section>
  );
};
