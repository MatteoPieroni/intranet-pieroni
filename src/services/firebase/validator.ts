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
  icon: z.optional(z.string()),
});

export const RiscossoSchema = z.object({
  id: z.string(),
  date: z.date(),
  total: z.number(),
  client: z.string(),
  company: z.enum(['pieroni', 'pieroni-mostra', 'pellet']),
  paymentMethod: z.enum(['assegno', 'contanti', 'bancomat']),
  // TODO: superRefine these to be dependent on payment method
  paymentChequeValue: z.optional(z.number()),
  paymentChequeNumber: z.optional(z.string()),
  docs: z.array(
    z.object({
      number: z.string(),
      type: z.enum(['fattura', 'DDT', 'impegno']),
      total: z.number(),
      date: z.date(),
    })
  ),
  meta: z.object({
    createdAt: z.date(),
    author: z.string(),
  }),
  verification: z.discriminatedUnion('isVerified', [
    z.object({
      isVerified: z.literal(true),
      verifiedAt: z.date(),
      verifyAuthor: z.string(),
    }),
    z.object({
      isVerified: z.literal(false),
      verifiedAt: z.optional(z.date()),
      verifiedAuthor: z.optional(z.string()),
    }),
  ]),
});
