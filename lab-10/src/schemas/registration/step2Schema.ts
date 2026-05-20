import { z } from 'zod';

export const step2Schema = z.object({
  categories: z
    .array(z.string())
    .min(1, 'Wybierz co najmniej jedną kategorię'),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
  newsletter: z.boolean().optional(),
});

export type Step2Data = z.infer<typeof step2Schema>;
