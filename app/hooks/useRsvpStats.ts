"use client";

import { useMemo } from "react";
import type { RsvpSubmission } from "@/app/lib/types";
import { countByField } from "@/app/lib/utils/stats";

export interface RsvpStats {
  totalAttending: number;
  drinkCounts: Record<string, number>;
  accommodationCounts: Record<string, number>;
}

export const useRsvpStats = (rsvps: RsvpSubmission[]): RsvpStats => {
  return useMemo(() => {
    const attendingRsvps = rsvps.filter((rsvp) => rsvp.attending === "yes");
    const totalAttending = attendingRsvps.length;

    const drinkCounts = countByField(attendingRsvps, (rsvp) =>
      rsvp.drinkChoice === "other" && rsvp.customDrink
        ? rsvp.customDrink
        : rsvp.drinkChoice
    );

    const accommodationCounts = countByField(
      attendingRsvps,
      (rsvp) => rsvp.accommodation
    );

    return {
      totalAttending,
      drinkCounts,
      accommodationCounts,
    };
  }, [rsvps]);
};
