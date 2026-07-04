import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import * as paymentService from '../services/payment.service';

export const makePayment = catchAsync(async (req: Request, res: Response) => {
  const { accountNumber, amount } = req.body;
  
  const receipt = await paymentService.processPayment(accountNumber, amount);

  res.status(201).json({
    status: 'success',
    data: {
      receipt,
    },
  });
});

export const getPaymentHistory = catchAsync(async (req: Request, res: Response) => {
  const { accountNumber } = req.params;
  const history = await paymentService.getPaymentHistory(accountNumber);

  res.status(200).json({
    status: 'success',
    data: {
      history,
    },
  });
});
