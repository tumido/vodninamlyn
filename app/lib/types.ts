import { IconProps } from "@/app/components/ui/Icon";

// Error Handling
export type ErrorType = "toast" | "inline";

export interface AppError {
  message: string;
  timestamp: number;
  type: ErrorType;
}

// RSVP Enums - Single source of truth
export const AttendingStatus = {
  NO: "no",
  YES: "yes",
} as const;

export const AccommodationType = {
  NO_SLEEP: "no-sleep",
  OWN_TENT: "own-tent",
  ROOF: "roof",
} as const;

export const DrinkChoice = {
  NEALKO: "nealko",
  OTHER: "other",
  PIVO: "pivo",
  VINO: "vino",
} as const;

// Derived types from enums
export type AttendingStatusValue =
  (typeof AttendingStatus)[keyof typeof AttendingStatus];
export type AccommodationTypeValue =
  (typeof AccommodationType)[keyof typeof AccommodationType];
export type DrinkChoiceValue = (typeof DrinkChoice)[keyof typeof DrinkChoice];

// Base RSVP data - shared fields between form and database
export interface BaseRsvpData {
  accommodation: AccommodationTypeValue | null;
  attending: AttendingStatusValue;
  childrenCount: number;
  customDrink: string | null;
  dietaryRestrictions: string | null;
  drinkChoice: DrinkChoiceValue | null;
  petsCount: number;
}

// RSVP Form Data - extends base with form-specific fields
export interface RSVPFormData {
  accommodation: AccommodationTypeValue | "";
  attending: AttendingStatusValue | "";
  childrenCount: number;
  customDrink?: string;
  dietaryRestrictions?: string;
  drinkChoice: DrinkChoiceValue | "";
  message?: string;
  names: string[];
  petsCount: number;
}

// Database view type - represents a single attendee from rsvp_submissions view
export interface RsvpSubmission extends BaseRsvpData {
  attendee_id: string;
  attendee_name: string;
  created_at: string;
  is_primary: boolean;
  message: string | null;
  primary_name: string;
  primary_rsvp_id: string;
}

// Wedding Information
export interface Address {
  city: string;
  street: string;
  zip: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Venue {
  address: Address;
  coordinates: Coordinates;
  googleMapsUrl: string;
  name: string;
  text: string;
  web: string;
}
export interface DetailItem {
  description: string;
  icon: IconProps["icon"];
  name: string;
}

export interface ScheduleItem {
  description?: string;
  time: string;
  title: string;
}

export interface FAQItem {
  answer: string;
  question: string;
}

export interface AccommodationOption {
  beds?: number;
  content: string;
  title: string;
}

export interface WeddingInfo {
  accommodation: {
    heading: string;
    description: string;
    options: AccommodationOption[];
  };
  contact: {
    email: string;
    other: string;
  };
  couple: {
    groom: string;
    bride: string;
    heading: string;
  };
  date: {
    full: Date;
    display: string;
    time: string;
    text: string;
  };
  details: DetailItem[];
  faq: FAQItem[];
  leading: string;
  rsvpDeadline: string;
  schedule: ScheduleItem[];
  venue: Venue;
}
