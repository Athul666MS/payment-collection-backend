"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.processPayment = void 0;
const uuid_1 = require("uuid");
const models_1 = require("../models");
const AppError_1 = __importDefault(require("../utils/AppError"));
const processPayment = async (accountNumber, amount) => {
    // Use a transaction to ensure ACID compliance
    const transaction = await models_1.sequelize.transaction();
    try {
        const customer = await models_1.Customer.findOne({
            where: { account_number: accountNumber },
            transaction,
            lock: true, // Lock the row to prevent race conditions (double clicks)
        });
        if (!customer) {
            throw new AppError_1.default('Customer not found with this account number', 404);
        }
        if (amount > customer.remaining_balance) {
            throw new AppError_1.default('Payment amount exceeds remaining balance', 400);
        }
        // Process the payment
        const newBalance = Number(customer.remaining_balance) - amount;
        await customer.update({ remaining_balance: newBalance }, { transaction });
        const payment = await models_1.Payment.create({
            customer_id: customer.id,
            transaction_id: (0, uuid_1.v4)(),
            payment_amount: amount,
            status: 'SUCCESS',
        }, { transaction });
        await transaction.commit();
        return {
            transactionId: payment.transaction_id,
            accountNumber: customer.account_number,
            customerName: customer.customer_name,
            paymentAmount: payment.payment_amount,
            paymentDate: payment.payment_date,
            status: payment.status,
            previousBalance: Number(customer.remaining_balance) + amount, // customer instance already has the updated balance
            newBalance: Number(customer.remaining_balance),
        };
    }
    catch (error) {
        await transaction.rollback();
        throw error;
    }
};
exports.processPayment = processPayment;
const getPaymentHistory = async (accountNumber) => {
    const customer = await models_1.Customer.findOne({
        where: { account_number: accountNumber },
    });
    if (!customer) {
        throw new AppError_1.default('Customer not found with this account number', 404);
    }
    const payments = await models_1.Payment.findAll({
        where: { customer_id: customer.id },
        order: [['payment_date', 'DESC']],
        attributes: ['transaction_id', 'payment_date', 'payment_amount', 'status'],
    });
    return payments;
};
exports.getPaymentHistory = getPaymentHistory;
