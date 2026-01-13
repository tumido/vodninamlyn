import { IconProps } from "../components/ui/Icon";

// RSVP Form Data
export interface RSVPFormData {
  name: string;
  email: string;
  attending: "ano" | "ne";
  plusOne: boolean;
  plusOneName?: string;
  mealPreference?: "maso" | "ryba" | "vegetarian" | "vegan";
  dietaryRestrictions?: string;
  message?: string;
}

export interface RSVPSubmission extends RSVPFormData {
  id: string;
  submittedAt: Date;
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
interface DetailItem {
  name: string;
  icon: IconProps["icon"];
  description: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  icon: string;
}

export interface ScheduleDay {
  day: string;
  date?: string;
  items: ScheduleItem[];
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
  schedule: ScheduleDay[];
  rsvpDeadline: Date;
  contact: {
    email: string;
    phone: string;
  };
}
