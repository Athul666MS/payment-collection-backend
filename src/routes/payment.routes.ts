import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { createPaymentSchema, getPaymentHistorySchema } from '../validators/payment.validator';

const router = Router();

router.post('/', validateRequest(createPaymentSchema), paymentController.makePayment);
router.get('/:accountNumber', validateRequest(getPaymentHistorySchema), paymentController.getPaymentHistory);

export default router;
