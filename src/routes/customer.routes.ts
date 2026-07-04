import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { getCustomerSchema } from '../validators/customer.validator';

const router = Router();

router.get('/', customerController.getCustomers);
router.get('/:accountNumber', validateRequest(getCustomerSchema), customerController.getCustomerDetails);

export default router;
