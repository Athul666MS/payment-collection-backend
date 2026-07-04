import { v4 as uuidv4 } from 'uuid';
import { sequelize, Customer, Payment } from '../models';
import AppError from '../utils/AppError';

export const processPayment = async (accountNumber: string, amount: number) => {
  // Use a transaction to ensure ACID compliance
  const transaction = await sequelize.transaction();

  try {
    const customer = await Customer.findOne({
      where: { account_number: accountNumber },
      transaction,
      lock: true, // Lock the row to prevent race conditions (double clicks)
    });

    if (!customer) {
      throw new AppError('Customer not found with this account number', 404);
    }

    if (amount > customer.remaining_balance) {
      throw new AppError('Payment amount exceeds remaining balance', 400);
    }

    // Process the payment
    const newBalance = Number(customer.remaining_balance) - amount;

    await customer.update({ remaining_balance: newBalance }, { transaction });

    const payment = await Payment.create(
      {
        customer_id: customer.id,
        transaction_id: uuidv4(),
        payment_amount: amount,
        status: 'SUCCESS',
      },
      { transaction }
    );

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
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getPaymentHistory = async (accountNumber: string) => {
  const customer = await Customer.findOne({
    where: { account_number: accountNumber },
  });

  if (!customer) {
    throw new AppError('Customer not found with this account number', 404);
  }

  const payments = await Payment.findAll({
    where: { customer_id: customer.id },
    order: [['payment_date', 'DESC']],
    attributes: ['transaction_id', 'payment_date', 'payment_amount', 'status'],
  });

  return payments;
};
