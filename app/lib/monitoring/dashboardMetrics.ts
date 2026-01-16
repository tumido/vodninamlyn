/**
 * Dashboard-specific metrics utilities for tracking business metrics with gauge metrics.
 * Provides helpers for tracking RSVP statistics, user engagement, and system health.
 */

import { setGauge } from './core/performance';
import type { RsvpSubmission } from '../types';

/**
 * Track total RSVP submissions count
 */
export function trackTotalRsvps(count: number): void {
  setGauge('rsvp.total', count);
}

/**
 * Track attending guests count
 */
export function trackAttendingGuests(count: number): void {
  setGauge('rsvp.attending', count);
}

/**
 * Track not attending guests count
 */
export function trackNotAttendingGuests(count: number): void {
  setGauge('rsvp.not_attending', count);
}

/**
 * Track attendance rate percentage (0-100)
 */
export function trackAttendanceRate(percentage: number): void {
  setGauge('rsvp.attendance_rate', percentage);
}

/**
 * Track total guest count (including plus ones)
 */
export function trackTotalGuests(count: number): void {
  setGauge('rsvp.total_guests', count);
}

/**
 * Track guests with dietary restrictions
 */
export function trackDietaryRestrictions(count: number): void {
  setGauge('rsvp.dietary_restrictions', count);
}

/**
 * Track guests needing accommodation
 */
export function trackAccommodationNeeded(count: number): void {
  setGauge('rsvp.accommodation_needed', count);
}

/**
 * Track children count
 */
export function trackChildrenCount(count: number): void {
  setGauge('rsvp.children_count', count);
}

/**
 * Track pets count
 */
export function trackPetsCount(count: number): void {
  setGauge('rsvp.pets_count', count);
}

/**
 * Update all RSVP-related gauges at once from RSVP data
 */
export function updateRsvpGauges(rsvps: RsvpSubmission[]): void {
  const totalRsvps = rsvps.length;
  const attendingRsvps = rsvps.filter(r => r.attending === 'yes');
  const notAttendingRsvps = rsvps.filter(r => r.attending === 'no');
  const dietaryRestrictions = rsvps.filter(r => r.dietaryRestrictions).length;
  const accommodationNeeded = rsvps.filter(r => r.accommodation !== null).length;
  const childrenCount = rsvps.reduce((sum, r) => sum + (r.childrenCount || 0), 0);
  const petsCount = rsvps.reduce((sum, r) => sum + (r.petsCount || 0), 0);
  const totalGuests = attendingRsvps.length + childrenCount;
  const attendanceRate = totalRsvps > 0 ? (attendingRsvps.length / totalRsvps) * 100 : 0;

  trackTotalRsvps(totalRsvps);
  trackAttendingGuests(attendingRsvps.length);
  trackNotAttendingGuests(notAttendingRsvps.length);
  trackAttendanceRate(Math.round(attendanceRate * 10) / 10); // Round to 1 decimal
  trackTotalGuests(totalGuests);
  trackDietaryRestrictions(dietaryRestrictions);
  trackAccommodationNeeded(accommodationNeeded);
  trackChildrenCount(childrenCount);
  trackPetsCount(petsCount);
}

/**
 * Track drink choice distribution
 */
export function trackDrinkChoices(rsvps: RsvpSubmission[]): void {
  const drinkCounts: Record<string, number> = {};

  rsvps.forEach(rsvp => {
    if (rsvp.drinkChoice) {
      drinkCounts[rsvp.drinkChoice] = (drinkCounts[rsvp.drinkChoice] || 0) + 1;
    }
  });

  Object.entries(drinkCounts).forEach(([choice, count]) => {
    setGauge(`rsvp.drink.${choice}`, count);
  });
}

/**
 * Track accommodation type distribution
 */
export function trackAccommodationTypes(rsvps: RsvpSubmission[]): void {
  const accommodationCounts: Record<string, number> = {};

  rsvps.forEach(rsvp => {
    if (rsvp.accommodation) {
      accommodationCounts[rsvp.accommodation] = (accommodationCounts[rsvp.accommodation] || 0) + 1;
    }
  });

  Object.entries(accommodationCounts).forEach(([type, count]) => {
    setGauge(`rsvp.accommodation.${type}`, count);
  });
}
