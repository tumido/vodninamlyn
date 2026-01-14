export interface RsvpSubmission {
  attendee_id: string;
  attendee_name: string;
  created_at: string;
  primary_rsvp_id: string;
  primary_name: string;
  attending: "yes" | "no";
  accommodation: string | null;
  drinkChoice: string | null;
  customDrink: string | null;
  dietaryRestrictions: string | null;
  message: string | null;
  is_primary: boolean;
}
