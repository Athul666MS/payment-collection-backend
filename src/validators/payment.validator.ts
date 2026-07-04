import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    accountNumber: z.string().trim().min(1, 'Account number is required'),
    amount: z.number().positive('Amount must be greater than zero'),
  }),
});

export const getPaymentHistorySchema = z.object({
  params: z.object({
    accountNumber: z.string().trim().min(1, 'Account number is required'),
  }),
});
