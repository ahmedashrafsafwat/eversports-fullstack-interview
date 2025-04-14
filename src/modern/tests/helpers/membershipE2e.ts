import { z } from 'zod';

export const MembershipSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  name: z.string(),
  state: z.enum(['active', 'pending', 'expired']),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  user: z.number(),
  paymentMethod: z.enum(['cash', 'credit', 'debit', 'bank_transfer']),
  recurringPrice: z.number(),
  billingPeriods: z.number(),
  billingInterval: z.enum(['weekly', 'monthly', 'yearly'])
});

export const MembershipPeriodSchema = z.object({
  id: z.number(),
  uuid: z.string().uuid(),
  membershipId: z.number(),
  start: z.string().datetime(),
  end: z.string().datetime(),
  state: z.enum(['planned', 'active', 'expired'])
});

export const MembershipCreationResponseSchema = z.object({
  membership: MembershipSchema,
  membershipPeriods: z.array(MembershipPeriodSchema)
});
