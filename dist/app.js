"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const rateLimiter_1 = require("./middlewares/rateLimiter");
const AppError_1 = __importDefault(require("./utils/AppError"));
const app = (0, express_1.default)();
// Set security HTTP headers
app.use((0, helmet_1.default)());
// Enable CORS
app.use((0, cors_1.default)());
// Limit requests from same API
app.use('/api', rateLimiter_1.apiLimiter);
// Body parser, reading data from body into req.body
app.use(express_1.default.json({ limit: '10kb' }));
// Routes
app.use('/api', routes_1.default);
// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handling Middleware
app.use(errorHandler_1.default);
exports.default = app;
