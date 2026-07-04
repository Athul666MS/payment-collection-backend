"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerSchema = void 0;
const zod_1 = require("zod");
exports.getCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        accountNumber: zod_1.z.string().trim().min(1, 'Account number is required'),
    }),
});
