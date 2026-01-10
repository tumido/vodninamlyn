import { z } from 'zod';

export const rsvpSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky'),
  email: z.string().email('Neplatný email'),
  attending: z.enum(['ano', 'ne'], {
    required_error: 'Prosím vyberte, zda se zúčastníte',
  }),
  plusOne: z.boolean().default(false),
  plusOneName: z.string().optional(),
  mealPreference: z.enum(['maso', 'ryba', 'vegetarian', 'vegan']).optional(),
  dietaryRestrictions: z.string().max(500, 'Maximálně 500 znaků').optional(),
  message: z.string().max(1000, 'Maximálně 1000 znaků').optional(),
}).refine((data) => {
  // If plusOne is true, plusOneName should be provided
  if (data.plusOne && (!data.plusOneName || data.plusOneName.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: 'Prosím uveďte jméno doprovodu',
  path: ['plusOneName'],
}).refine((data) => {
  // If attending 'ano', meal preference should be provided
  if (data.attending === 'ano' && !data.mealPreference) {
    return false;
  }
  return true;
}, {
  message: 'Prosím vyberte preferovaný oběd',
  path: ['mealPreference'],
});

export type RSVPFormValues = z.infer<typeof rsvpSchema>;
