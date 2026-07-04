"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.Customer = exports.sequelize = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.sequelize = database_1.default;
const Customer_1 = __importDefault(require("./Customer"));
exports.Customer = Customer_1.default;
const Payment_1 = __importDefault(require("./Payment"));
exports.Payment = Payment_1.default;
// Define Associations
Customer_1.default.hasMany(Payment_1.default, {
    foreignKey: 'customer_id',
    as: 'payments',
});
Payment_1.default.belongsTo(Customer_1.default, {
    foreignKey: 'customer_id',
    as: 'customer',
});
