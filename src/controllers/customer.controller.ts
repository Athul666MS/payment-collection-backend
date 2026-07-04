import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as customerService from '../services/customer.service';

export const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const customers = await customerService.getAllCustomers();

  res.status(200).json({
    status: 'success',
    data: {
      customers,
    },
  });
});

export const getCustomerDetails = catchAsync(async (req: Request, res: Response) => {
  const { accountNumber } = req.params;
  const customer = await customerService.getCustomerByAccountNumber(accountNumber);

  res.status(200).json({
    status: 'success',
    data: {
      customer,
    },
  });
});
