import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';
import { DISCOUNT_TYPE } from './coupon.constants';

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    totalUsed: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: Object.values(DISCOUNT_TYPE),
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Coupon = model<ICoupon>('Coupon', couponSchema);
