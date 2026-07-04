"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistorySchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        accountNumber: zod_1.z.string().trim().min(1, 'Account number is required'),
        amount: zod_1.z.number().positive('Amount must be greater than zero'),
    }),
});
exports.getPaymentHistorySchema = zod_1.z.object({
    params: zod_1.z.object({
        accountNumber: zod_1.z.string().trim().min(1, 'Account number is required'),
    }),
});
