import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { couponService } from './coupon.service';
import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';

// add coupon
const addCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.addCoupon(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Coupon added successfully',
    data: result,
  });
});

// getCoupons
const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized', null);
  }
  const result = await couponService.getCoupons(userId, req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupons fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

// validate coupon
const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.validateCoupon({
    code: req.params.coupon,
    productId: req.query.productId,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Coupon validated successfully',
    data: result,
  });
});

export const couponController = {
  addCoupon,
  getCoupons,
  validateCoupon,
};
