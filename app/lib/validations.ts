import { z } from 'zod';

export const rsvpSchema = z.object({
  names: z.array(z.string().min(2, 'Jméno musí mít alespoň 2 znaky'))
    .min(1, 'Přidejte alespoň jedno jméno'),
  attending: z.enum(['yes', 'no'], {
    message: 'Prosím potvrďte, zda se zúčastníte',
  }),
  accommodation: z.enum(['roof', 'own-tent', 'no-sleep'], {
    message: 'Prosím vyberte ubytování',
  }),
  drinkChoice: z.enum(['pivo', 'vino', 'nealko', 'other'], {
    message: 'Prosím vyberte nápoj',
  }),
  customDrink: z.string().max(100, 'Maximálně 100 znaků').optional(),
  dietaryRestrictions: z.string().max(500, 'Maximálně 500 znaků').optional(),
  message: z.string().max(1000, 'Maximálně 1000 znaků').optional(),
}).refine((data) => {
  // If attending is "yes", validate accommodation and drinkChoice
  if (data.attending === 'yes') {
    if (!data.accommodation || !data.drinkChoice) {
      return false;
    }
    if (data.drinkChoice === 'other' && !data.customDrink?.trim()) {
      return false;
    }
  }
  return true;
}, {
  message: 'Prosím vyplňte všechna povinná pole',
  path: ['attending'],
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

export type RSVPFormValues = z.infer<typeof rsvpSchema>;
