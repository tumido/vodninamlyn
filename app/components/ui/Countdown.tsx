"use client";

import { useEffect, useState } from "react";
import Icon from "./Icon";

interface CountdownProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface FlipDigitProps {
  prevValue: number;
  value: number;
}

const FlipDigit = ({ prevValue, value }: FlipDigitProps) => {
  const shouldAnimate = prevValue !== value;
  const digitClasses =
    "absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-palette-green";

  return (
    <div className="relative h-16 w-8 overflow-hidden">
      <div
        key={`new-${value}`}
        className={`${digitClasses} ${shouldAnimate ? "animate-slide-up" : ""}`}
      >
        {value}
      </div>
      {shouldAnimate && (
        <div
          key={`old-${prevValue}`}
          className={`${digitClasses} animate-slide-down`}
        >
          {prevValue}
        </div>
      )}
    </div>
  );
};

export const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [prevTimeRemaining, setPrevTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining((prev) => {
          setPrevTimeRemaining(prev);
          return { days, hours, minutes, seconds };
        });
        setIsPast(false);
      } else {
        setTimeRemaining((prev) => {
          setPrevTimeRemaining(prev);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        });
        setIsPast(true);
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    {
      label: "dní",
      prevValue: prevTimeRemaining.days,
      value: timeRemaining.days,
    },
    {
      label: "hodin",
      prevValue: prevTimeRemaining.hours,
      value: timeRemaining.hours,
    },
    {
      label: "minut",
      prevValue: prevTimeRemaining.minutes,
      value: timeRemaining.minutes,
    },
    {
      label: "sekund",
      prevValue: prevTimeRemaining.seconds,
      value: timeRemaining.seconds,
    },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6">
      <div className="grid w-full grid-cols-4 gap-0 md:gap-6">
        {timeUnits.map((unit, index) => {
          const digits = unit.value.toString().padStart(2, "0").split("");
          const prevDigits = unit.prevValue
            .toString()
            .padStart(2, "0")
            .split("");
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-lg py-6"
            >
              <div className="mb-2 flex gap-1 md:gap-2">
                {digits.map((digit, digitIndex) => (
                  <FlipDigit
                    key={digitIndex}
                    value={parseInt(digit)}
                    prevValue={parseInt(prevDigits[digitIndex])}
                  />
                ))}
              </div>
              <div className="text-sm tracking-wider text-neutral-600 uppercase md:text-base">
                {unit.label}
              </div>
            </div>
          );
        })}
      </div>
      {isPast && (
        <div className="mb-12 h-24 w-80">
          <Icon icon="arrow-heart" />
        </div>
      )}
    </div>
  );
};
