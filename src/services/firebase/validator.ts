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
  theme: z.optional(z.nullable(z.enum(['light', 'dark']))),
  teams: z.optional(z.array(z.string())),
});

export const TeamSchema = z.object({
  name: z.string(),
});

export const LinkSchema = z.object({
  description: z.string(),
  link: z.url(),
  id: z.string(),
  teams: z.array(z.string()),
});
