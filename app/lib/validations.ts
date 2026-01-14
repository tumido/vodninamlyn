import { z } from 'zod';

// Base schema with shared RSVP fields and validation logic
const baseRsvpSchema = z.object({
  attending: z.enum(['yes', 'no'], {
    message: 'Prosím potvrďte, zda se zúčastníte',
  }),
  accommodation: z.enum(['roof', 'own-tent', 'no-sleep'], {
    message: 'Prosím vyberte ubytování',
  }).or(z.literal('')),
  drinkChoice: z.enum(['pivo', 'vino', 'nealko', 'other'], {
    message: 'Prosím vyberte nápoj',
  }).or(z.literal('')),
  customDrink: z.string().max(100, 'Maximálně 100 znaků').optional(),
  dietaryRestrictions: z.string().max(500, 'Maximálně 500 znaků').optional(),
})
.refine((data) => {
  if (data.attending === 'yes' && !data.accommodation) {
    return false;
  }
  return true;
}, {
  message: 'Prosím vyberte ubytování',
  path: ['accommodation'],
})
.refine((data) => {
  if (data.attending === 'yes' && !data.drinkChoice) {
    return false;
  }
  return true;
}, {
  message: 'Prosím vyberte nápoj',
  path: ['drinkChoice'],
})
.refine((data) => {
  if (data.attending === 'yes' && data.drinkChoice === 'other' && !data.customDrink?.trim()) {
    return false;
  }
  return true;
}, {
  message: 'Prosím specifikujte vlastní nápoj',
  path: ['customDrink'],
});

// Public RSVP form schema (adds names array and message)
export const rsvpSchema = baseRsvpSchema.extend({
  names: z.array(z.string().min(2, 'Jméno musí mít alespoň 2 znaky'))
    .min(1, 'Přidejte alespoň jedno jméno'),
  message: z.string().max(1000, 'Maximálně 1000 znaků').optional(),
});

export type RSVPFormValues = z.infer<typeof rsvpSchema>;

// Admin edit schema (same as base schema)
export const rsvpEditSchema = baseRsvpSchema;

export type RSVPEditValues = z.infer<typeof rsvpEditSchema>;
