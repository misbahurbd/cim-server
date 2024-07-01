import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { validateRequest } from '../../middlewares/validateRequest';
import { requestController } from './request.controller';
import { requestValidation } from './request.validation';

const router = express.Router();

// create request
router.post(
  '/',
  checkAuth('buyer'),
  validateRequest(requestValidation.addRequestSchema),
  requestController.addRequest,
);

router.get(
  '/pending',
  checkAuth('seller'),
  requestController.getPendingRequests,
);

// get buyer requests
router.get(
  '/buyer/:id',
  checkAuth('buyer'),
  requestController.getBuyerRequests,
);

router.put('/:id', checkAuth('seller'), requestController.updateRequest);

export const requestRouter = router;
