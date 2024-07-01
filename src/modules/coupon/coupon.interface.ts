import { Types } from 'mongoose';

export interface ICoupon {
  quantity: number;
  seller: Types.ObjectId;
  discount: number;
  discountType: 'percentage' | 'amount';
  totalUsed: number;
  code: string;
  isValid?: boolean;
}
