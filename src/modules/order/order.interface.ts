import { Types } from 'mongoose';

export interface IOrder {
  product: Types.ObjectId;
  customerName: string;
  customerEmail: string;
  seller: Types.ObjectId;
  quantity: number;
  price: number;
  coupon?: string;
  discountPrice?: number;
  totalPrice: number;
  orderAt: string;
}
