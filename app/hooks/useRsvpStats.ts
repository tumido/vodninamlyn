"use client";

import { useMemo } from "react";
import type { RsvpSubmission } from "@/app/lib/types";

export interface RsvpStats {
  totalAttending: number;
  drinkCounts: Record<string, number>;
  accommodationCounts: Record<string, number>;
}

export const useRsvpStats = (rsvps: RsvpSubmission[]): RsvpStats => {
  return useMemo(() => {
    const attendingRsvps = rsvps.filter((rsvp) => rsvp.attending === "yes");
    const totalAttending = attendingRsvps.length;

    const drinkCounts: Record<string, number> = {};
    attendingRsvps.forEach((rsvp) => {
      const drink =
        rsvp.drinkChoice === "other" && rsvp.customDrink
          ? rsvp.customDrink
          : rsvp.drinkChoice;
      if (drink) {
        drinkCounts[drink] = (drinkCounts[drink] || 0) + 1;
      }
    });

    const accommodationCounts: Record<string, number> = {};
    attendingRsvps.forEach((rsvp) => {
      const accommodation = rsvp.accommodation;
      if (accommodation) {
        accommodationCounts[accommodation] =
          (accommodationCounts[accommodation] || 0) + 1;
      }
    });

    return {
      totalAttending,
      drinkCounts,
      accommodationCounts,
    };
  }, [rsvps]);
};
