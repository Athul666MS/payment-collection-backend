import { Op } from 'sequelize';
import { Customer, Payment } from '../models';
import AppError from '../utils/AppError';

export const getAllCustomers = async () => {
  return await Customer.findAll({
    attributes: { exclude: ['created_at', 'updated_at'] },
  });
};

export const getCustomerByAccountNumber = async (accountNumber: string) => {
  const customer = await Customer.findOne({
    where: { account_number: accountNumber },
    attributes: { exclude: ['created_at', 'updated_at'] },
  });

  if (!customer) {
    throw new AppError('Customer not found with this account number', 404);
  }

  // Calculate current billing cycle (1st of current month to end of current month)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  // Find the latest successful payment in the current billing cycle
  const currentMonthPayment = await Payment.findOne({
    where: {
      customer_id: customer.id,
      status: 'SUCCESS',
      payment_date: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    order: [['payment_date', 'DESC']],
    attributes: ['transaction_id', 'payment_amount', 'payment_date'],
  });

  // Find the most recent successful payment overall (for "Last Payment" info)
  const lastPayment = await Payment.findOne({
    where: {
      customer_id: customer.id,
      status: 'SUCCESS',
    },
    order: [['payment_date', 'DESC']],
    attributes: ['transaction_id', 'payment_amount', 'payment_date'],
  });

  const currentEmiStatus = currentMonthPayment ? 'PAID' : 'PENDING';

  return {
    id: customer.id,
    account_number: customer.account_number,
    customer_name: customer.customer_name,
    issue_date: customer.issue_date,
    interest_rate: customer.interest_rate,
    tenure: customer.tenure,
    emi_due: customer.emi_due,
    remaining_balance: customer.remaining_balance,
    current_emi_status: currentEmiStatus,
    last_payment_amount: lastPayment ? lastPayment.payment_amount : null,
    last_payment_date: lastPayment ? lastPayment.payment_date : null,
    last_transaction_id: lastPayment ? lastPayment.transaction_id : null,
  };
};
