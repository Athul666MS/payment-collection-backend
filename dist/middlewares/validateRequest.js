"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const AppError_1 = __importDefault(require("../utils/AppError"));
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                }));
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors,
                });
            }
            return next(new AppError_1.default('Internal Server Error', 500));
        }
    };
};
exports.validateRequest = validateRequest;
