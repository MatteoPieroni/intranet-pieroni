import * as z from 'zod';
import { permissions } from './server/permissions';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  isAdmin: z.optional(z.boolean()),
  permissions: z.optional(z.array(z.enum(permissions))),
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

export const RiscossoDocSchema = z.object({
  number: z.string(),
  type: z.enum(['fattura', 'DDT', 'impegno']),
  total: z.number(),
  date: z.date(),
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
  docs: z.array(RiscossoDocSchema),
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

export const IssueActionSchema = z.object({
  id: z.string(),
  date: z.date(),
  content: z.string(),
  attachments: z.optional(z.array(z.string())),
  result: z.optional(z.string()),
});

export const IssueResultSchema = z.object({
  date: z.date(),
  summary: z.string(),
});

export const IssueSchema = z.object({
  id: z.string(),
  date: z.date(),
  commission: z.string(),
  client: z.string(),
  issueType: z.enum([
    'delay-preparation',
    'missing-article',
    'delay-arrival',
    'supplier-mistake',
    'client-return',
    'insufficient-order',
    'supplier-defect',
    'breakage',
    'not-conforming',
    'client-mistake',
    'plumber-mistake',
    'builder-mistake',
    'project-mistake',
  ]),
  summary: z.string(),
  supplierInfo: z.optional(
    z.object({
      supplier: z.optional(z.string()),
      documentType: z.optional(z.string()),
      documentDate: z.optional(z.date()),
      deliveryContext: z.optional(z.string()),
      product: z.optional(
        z.object({
          number: z.optional(z.string()),
          quantity: z.optional(z.number()),
          description: z.optional(z.string()),
        })
      ),
    })
  ),
  timeline: z.array(IssueActionSchema),
  result: z.optional(IssueResultSchema),
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
