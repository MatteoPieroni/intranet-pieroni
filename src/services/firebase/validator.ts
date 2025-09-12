import * as z from 'zod';

export const UserSchema = z.object({
  nome: z.string(),
  cognome: z.string(),
  email: z.string(),
  isAdmin: z.boolean(),
  scopes: z.optional(
    z.object({
      gmb: z.optional(z.boolean()),
      config: z.optional(
        z.object({
          transport: z.optional(z.boolean()),
        })
      ),
    })
  ),
  theme: z.optional(z.enum(['light', 'dark'])),
  teams: z.optional(z.array(z.string())),
});

export const TeamSchema = z.object({
  name: z.string(),
});
