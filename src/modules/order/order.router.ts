import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { orderValidation } from './order.validation';
import { orderController } from './order.controller';

const router = express.Router();

router.post(
  '/create',
  checkAuth(),
  validateRequest(orderValidation.newOrderSchema),
  orderController.newOrder,
);
router.get(
  '/history/:userId',
  checkAuth('seller'),
  orderController.orderHistory,
);
router.get(
  '/buyerHistory/:userId',
  checkAuth('buyer'),
  orderController.buyerOrderHistory,
);
router.get(
  '/top-products/:userId',
  checkAuth('seller'),
  orderController.getTopSellingProducts,
);

export const orderRouter = router;
