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
  value: number;
  prevValue: number;
}

const FlipDigit = ({ value, prevValue }: FlipDigitProps) => {
  const shouldAnimate = prevValue !== value;
  const digitClasses =
    "absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold text-palette-green";

  return (
    <div className="relative w-8 h-16 overflow-hidden">
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
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
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
      value: timeRemaining.days,
      prevValue: prevTimeRemaining.days,
      label: "dní",
    },
    {
      value: timeRemaining.hours,
      prevValue: prevTimeRemaining.hours,
      label: "hodin",
    },
    {
      value: timeRemaining.minutes,
      prevValue: prevTimeRemaining.minutes,
      label: "minut",
    },
    {
      value: timeRemaining.seconds,
      prevValue: prevTimeRemaining.seconds,
      label: "sekund",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-4 md:gap-6 gap-0 w-full">
        {timeUnits.map((unit, index) => {
          const digits = unit.value.toString().padStart(2, "0").split("");
          const prevDigits = unit.prevValue
            .toString()
            .padStart(2, "0")
            .split("");
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center py-6 rounded-lg"
            >
              <div className="flex gap-1 md:gap-2 mb-2">
                {digits.map((digit, digitIndex) => (
                  <FlipDigit
                    key={digitIndex}
                    value={parseInt(digit)}
                    prevValue={parseInt(prevDigits[digitIndex])}
                  />
                ))}
              </div>
              <div className="text-sm md:text-base text-neutral-600 uppercase tracking-wider">
                {unit.label}
              </div>
            </div>
          );
        })}
      </div>
      {isPast && (
        <div className="w-80 h-24 mb-12">
          <Icon icon="arrow-heart" />
        </div>
      )}
    </div>
  );
};
