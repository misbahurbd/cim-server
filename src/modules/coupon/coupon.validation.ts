import { z } from 'zod';
import { DISCOUNT_TYPE } from './coupon.constants';

const addCouponSchema = z.object({
  quantity: z.number().min(1, { message: 'Coupon quantity is required' }),
  code: z
    .string()
    .min(1, { message: 'Coupon code is required' })
    .trim()
    .toUpperCase(),
  discount: z.number().min(1, { message: 'Coupon discount is required' }),
  discountType: z
    .enum(['percentage', 'amount'])
    .refine((value) => Object.values(DISCOUNT_TYPE).includes(value), {
      message: 'Discount type must be Percentage or Amount',
    }),
  seller: z.string().min(1, { message: 'Seller is required' }).trim(),
  isValid: z.boolean().default(true),
});

export const couponValidation = {
  addCouponSchema,
};
