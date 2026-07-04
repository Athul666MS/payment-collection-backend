"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./config/database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
const startServer = async () => {
    try {
        await database_1.default.authenticate();
        console.log('DB connection successful!');
        const server = app_1.default.listen(PORT, () => {
            console.log(`App running on port ${PORT}...`);
        });
        process.on('unhandledRejection', (err) => {
            console.log('UNHANDLED REJECTION! 💥 Shutting down...');
            console.log(err.name, err.message);
            server.close(() => {
                process.exit(1);
            });
        });
    }
    catch (error) {
        console.error('errorrr Customers fetched successfully : Unable to connect to the database:', error);
        process.exit(1);
    }
};
startServer();
