import { IconProps } from "@/app/components/ui/Icon";

// Error Handling
export type ErrorType = "toast" | "inline";

export interface AppError {
  message: string;
  type: ErrorType;
  timestamp: number;
}

// RSVP Enums - Single source of truth
export const AttendingStatus = {
  YES: 'yes',
  NO: 'no',
} as const;

export const AccommodationType = {
  ROOF: 'roof',
  OWN_TENT: 'own-tent',
  NO_SLEEP: 'no-sleep',
} as const;

export const DrinkChoice = {
  PIVO: 'pivo',
  VINO: 'vino',
  NEALKO: 'nealko',
  OTHER: 'other',
} as const;

// Derived types from enums
export type AttendingStatusValue = typeof AttendingStatus[keyof typeof AttendingStatus];
export type AccommodationTypeValue = typeof AccommodationType[keyof typeof AccommodationType];
export type DrinkChoiceValue = typeof DrinkChoice[keyof typeof DrinkChoice];

// Base RSVP data - shared fields between form and database
export interface BaseRsvpData {
  attending: AttendingStatusValue;
  accommodation: AccommodationTypeValue | null;
  drinkChoice: DrinkChoiceValue | null;
  customDrink: string | null;
  dietaryRestrictions: string | null;
}

// RSVP Form Data - extends base with form-specific fields
export interface RSVPFormData {
  names: string[];
  attending: AttendingStatusValue | "";
  accommodation: AccommodationTypeValue | "";
  drinkChoice: DrinkChoiceValue | "";
  customDrink?: string;
  dietaryRestrictions?: string;
  message?: string;
}

// Database view type - represents a single attendee from rsvp_submissions view
export interface RsvpSubmission extends BaseRsvpData {
  attendee_id: string;
  attendee_name: string;
  created_at: string;
  primary_rsvp_id: string;
  primary_name: string;
  message: string | null;
  is_primary: boolean;
}

// Wedding Information
export interface Address {
  street: string;
  city: string;
  zip: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Venue {
  name: string;
  address: Address;
  coordinates: Coordinates;
  googleMapsUrl: string;
  web: string;
}
export interface DetailItem {
  name: string;
  icon: IconProps["icon"];
  description: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  icon: string;
  highlight?: boolean;
}

export interface WeddingInfo {
  couple: {
    groom: string;
    bride: string;
    heading: string;
  };
  date: {
    full: Date;
    display: string;
    time: string;
  };
  venue: Venue;
  details: DetailItem[];
  schedule: ScheduleItem[];
  rsvpDeadline: string;
  contact: {
    email: string;
    phone: string;
  };
}
