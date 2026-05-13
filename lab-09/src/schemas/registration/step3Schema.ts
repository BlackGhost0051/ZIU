import { z } from 'zod';

export const step3Schema = z.object({
  rodoConsent: z.boolean().refine((val) => val === true, {
    message: 'Musisz zaakceptować zgodę RODO',
  }),
});

export type Step3Data = z.infer<typeof step3Schema>;
