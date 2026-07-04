import { z } from 'zod';

export const getCustomerSchema = z.object({
  params: z.object({
    accountNumber: z.string().trim().min(1, 'Account number is required'),
  }),
});
