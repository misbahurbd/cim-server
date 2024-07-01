/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICoupon } from './coupon.interface';
import { Coupon } from './coupon.model';
import { Product } from '../product/product.model';

// add new coupon
const addCoupon = async (couponData: ICoupon) => {
  const { code, discount, discountType, quantity, seller } = couponData;

  const coupon = await Coupon.create({
    code,
    discount,
    discountType,
    quantity,
    seller,
  });

  return coupon;
};

// get coupons
const getCoupons = async (userId: string, query: any) => {
  const page = query?.page ? parseInt(query.page) : 1;
  const limit = query?.limit ? parseInt(query.limit) : 6;
  const skip = (page - 1) * limit;

  const coupons = await Coupon.find({
    seller: userId,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const totalCoupon = await Coupon.countDocuments({ seller: userId });

  return {
    data: coupons,
    meta: {
      page,
      limit,
      total: totalCoupon,
    },
  };
};

// validate coupon code
// TODO: Complete validation
const validateCoupon = async ({
  code,
  productId,
}: {
  code: string;
  productId: any;
}) => {
  // validate product
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  // validate coupon
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new Error('Invalid coupon code');
  if (coupon.seller.toString() !== product.createdBy.toString()) {
    throw new Error('Coupon code is not valid for this product');
  }
  if (coupon.quantity === 0) {
    throw new Error('Coupon code is expired');
  }

  const productPrice = product.price;
  const discountPrice =
    coupon.discountType === 'percentage'
      ? Number(productPrice) -
        (Number(productPrice) * Number(coupon.discount)) / 100
      : Number(product.price) - Number(coupon.discount);

  return {
    productId: product._id,
    coupon: code,
    price: product.price,
    discountPrice,
  };
};

export const couponService = {
  addCoupon,
  getCoupons,
  validateCoupon,
};
