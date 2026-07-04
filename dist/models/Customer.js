"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Customer extends sequelize_1.Model {
}
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    account_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    customer_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    issue_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    interest_rate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    tenure: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    emi_due: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    remaining_balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
exports.default = Customer;
