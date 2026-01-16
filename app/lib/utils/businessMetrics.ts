/**
 * Business metrics utilities for analyzing RSVP data and trends
 */

import type { RsvpSubmission } from '@/app/lib/types';

export interface AttendanceMetrics {
  total: number;
  attending: number;
  notAttending: number;
  attendanceRate: number;
  totalGuests: number;
}

export interface DietaryMetrics {
  totalWithRestrictions: number;
  restrictionBreakdown: Record<string, number>;
}

export interface AccommodationMetrics {
  total: number;
  accommodationBreakdown: Record<string, number>;
}

export interface DrinkMetrics {
  total: number;
  drinkBreakdown: Record<string, number>;
}

export interface ChildrenPetsMetrics {
  totalWithChildren: number;
  totalChildren: number;
  totalWithPets: number;
  totalPets: number;
}

export interface SubmissionTrends {
  byDay: Record<string, number>;
  byWeek: Record<string, number>;
  cumulativeByDay: Record<string, number>;
}

/**
 * Calculate attendance metrics from RSVP submissions
 */
export const calculateAttendanceMetrics = (rsvps: RsvpSubmission[]): AttendanceMetrics => {
  const attending = rsvps.filter(r => r.attending === 'yes').length;
  const notAttending = rsvps.filter(r => r.attending === 'no').length;
  const total = rsvps.length;

  // Calculate total number of guests (people attending)
  // Each RSVP submission represents one attendee
  const totalGuests = rsvps
    .filter(r => r.attending === 'yes')
    .length;

  return {
    total,
    attending,
    notAttending,
    attendanceRate: total > 0 ? (attending / total) * 100 : 0,
    totalGuests,
  };
};

/**
 * Calculate dietary restriction metrics
 */
export const calculateDietaryMetrics = (rsvps: RsvpSubmission[]): DietaryMetrics => {
  const attendingRsvps = rsvps.filter(r => r.attending === 'yes');
  const withRestrictions = attendingRsvps.filter(r => r.dietaryRestrictions && r.dietaryRestrictions.trim() !== '');

  // Break down restrictions by type (simplified grouping)
  const restrictionBreakdown: Record<string, number> = {};
  withRestrictions.forEach(r => {
    const restriction = r.dietaryRestrictions?.toLowerCase() || '';
    if (restriction.includes('vegetar')) {
      restrictionBreakdown['Vegetarian'] = (restrictionBreakdown['Vegetarian'] || 0) + 1;
    }
    if (restriction.includes('vegan')) {
      restrictionBreakdown['Vegan'] = (restrictionBreakdown['Vegan'] || 0) + 1;
    }
    if (restriction.includes('gluten')) {
      restrictionBreakdown['Gluten-free'] = (restrictionBreakdown['Gluten-free'] || 0) + 1;
    }
    if (restriction.includes('lactose') || restriction.includes('dairy')) {
      restrictionBreakdown['Lactose-free'] = (restrictionBreakdown['Lactose-free'] || 0) + 1;
    }
    if (!restriction.includes('vegetar') && !restriction.includes('vegan') &&
        !restriction.includes('gluten') && !restriction.includes('lactose') && !restriction.includes('dairy')) {
      restrictionBreakdown['Other'] = (restrictionBreakdown['Other'] || 0) + 1;
    }
  });

  return {
    totalWithRestrictions: withRestrictions.length,
    restrictionBreakdown,
  };
};

/**
 * Calculate accommodation metrics
 */
export const calculateAccommodationMetrics = (rsvps: RsvpSubmission[]): AccommodationMetrics => {
  const attendingRsvps = rsvps.filter(r => r.attending === 'yes' && r.accommodation);

  const accommodationBreakdown: Record<string, number> = {};
  attendingRsvps.forEach(r => {
    const accommodation = r.accommodation || 'Unknown';
    accommodationBreakdown[accommodation] = (accommodationBreakdown[accommodation] || 0) + 1;
  });

  return {
    total: attendingRsvps.length,
    accommodationBreakdown,
  };
};

/**
 * Calculate drink choice metrics
 */
export const calculateDrinkMetrics = (rsvps: RsvpSubmission[]): DrinkMetrics => {
  const attendingRsvps = rsvps.filter(r => r.attending === 'yes' && r.drinkChoice);

  const drinkBreakdown: Record<string, number> = {};
  attendingRsvps.forEach(r => {
    const drink = r.drinkChoice || 'Unknown';
    drinkBreakdown[drink] = (drinkBreakdown[drink] || 0) + 1;
  });

  return {
    total: attendingRsvps.length,
    drinkBreakdown,
  };
};

/**
 * Calculate children and pets metrics
 */
export const calculateChildrenPetsMetrics = (rsvps: RsvpSubmission[]): ChildrenPetsMetrics => {
  const attendingRsvps = rsvps.filter(r => r.attending === 'yes');

  const withChildren = attendingRsvps.filter(r => r.childrenCount > 0);
  const totalChildren = attendingRsvps.reduce((sum, r) => sum + (r.childrenCount || 0), 0);

  const withPets = attendingRsvps.filter(r => r.petsCount > 0);
  const totalPets = attendingRsvps.reduce((sum, r) => sum + (r.petsCount || 0), 0);

  return {
    totalWithChildren: withChildren.length,
    totalChildren,
    totalWithPets: withPets.length,
    totalPets,
  };
};

/**
 * Calculate submission trends over time
 */
export const calculateSubmissionTrends = (rsvps: RsvpSubmission[]): SubmissionTrends => {
  const byDay: Record<string, number> = {};
  const byWeek: Record<string, number> = {};
  const cumulativeByDay: Record<string, number> = {};

  // Sort by submission date
  const sortedRsvps = [...rsvps].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateA - dateB;
  });

  let cumulative = 0;

  sortedRsvps.forEach(r => {
    if (!r.created_at) return;

    const date = new Date(r.created_at);
    const dayKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

    // Week number (simple calculation)
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0];

    byDay[dayKey] = (byDay[dayKey] || 0) + 1;
    byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;

    cumulative++;
    cumulativeByDay[dayKey] = cumulative;
  });

  return {
    byDay,
    byWeek,
    cumulativeByDay,
  };
};

/**
 * Get all business metrics in one call
 */
export const getAllBusinessMetrics = (rsvps: RsvpSubmission[]) => {
  return {
    attendance: calculateAttendanceMetrics(rsvps),
    dietary: calculateDietaryMetrics(rsvps),
    accommodation: calculateAccommodationMetrics(rsvps),
    drinks: calculateDrinkMetrics(rsvps),
    childrenPets: calculateChildrenPetsMetrics(rsvps),
    trends: calculateSubmissionTrends(rsvps),
  };
};

/**
 * Format percentage for display
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get top N items from a breakdown
 */
export const getTopItems = <T extends Record<string, number>>(
  breakdown: T,
  count: number = 5
): Array<{ key: string; value: number }> => {
  return Object.entries(breakdown)
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
};
