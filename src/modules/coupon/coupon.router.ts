import express from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { couponController } from './coupon.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { couponValidation } from './coupon.validation';

const router = express.Router();

// add coupon
router.post(
  '/',
  checkAuth('seller'),
  validateRequest(couponValidation.addCouponSchema),
  couponController.addCoupon,
);

// get coupons
router.get('/:userId', checkAuth('seller'), couponController.getCoupons);

// validate coupon
router.put('/:coupon', checkAuth(), couponController.validateCoupon);

export const couponRouter = router;
