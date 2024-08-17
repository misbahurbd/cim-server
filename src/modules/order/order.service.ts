/* eslint-disable @typescript-eslint/no-explicit-any */
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import { Product } from '../product/product.model';
import { getLookupStage, getUnwindStage } from '../../utils';
import { Coupon } from '../coupon/coupon.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const newOrder = async (orderData: IOrder) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const {
      product: productId,
      customerName,
      customerEmail,
      seller,
      price,
      discountPrice,
      quantity,
      orderAt,
      coupon,
    } = orderData;

    const totalPrice = discountPrice
      ? Number(quantity) * Number(discountPrice)
      : Number(quantity) * Number(price);

    const order = await Order.create(
      [
        {
          product: productId,
          customerName,
          customerEmail,
          seller,
          quantity: Number(quantity),
          price: Number(price),
          totalPrice,
          coupon: coupon || undefined,
          discountPrice: discountPrice ? Number(discountPrice) : undefined,
          orderAt,
        },
      ],
      { session },
    );

    if (!order) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Bad request',
        'Failed to create order',
      );
    }

    if (coupon) {
      const couponCheck = await Coupon.findOne({
        code: coupon,
      });
      if (couponCheck?.quantity == 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Bad request',
          'Coupon is expired',
        );
      }

      const couponData = await Coupon.findOneAndUpdate(
        { code: coupon },
        { $inc: { totalUsed: 1, quantity: -1 } },
        { new: true, session },
      );
      if (!couponData) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Bad request',
          'Failed to update coupon',
        );
      }
      if (couponData.quantity == 0) {
        await Coupon.findOneAndUpdate(
          { code: coupon },
          { isValid: false },
          { new: true, session },
        );
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { quantity: -Number(quantity) } },
      { new: true, session },
    );

    if (!product) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Bad request',
        'Failed to update product quantity',
      );
    }

    if (product.quantity === 0) {
      await Product.findOneAndUpdate(
        { _id: productId },
        { isDeleted: true, deletedAt: new Date() },
        { new: true, session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      null,
    );
  }
};

const orderHistory = async ({
  userId,
  query,
}: {
  userId: string;
  query: any;
}) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const orders = await Order.aggregate([
    {
      $match: {
        seller: new mongoose.mongo.ObjectId(userId),
      },
    },
    {
      $sort: {
        orderAt: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    getLookupStage('products', 'product', '_id', 'product'),
    getUnwindStage('product'),
  ]);

  // Calculate totalSold count
  const totalSold = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Calculate total order
  const totalOrder = await Order.countDocuments({ seller: userId });

  // Calculate totalProduct count
  const totalProduct = await Product.countDocuments({
    isDeleted: false,
    createdBy: userId,
  });

  // Calculate totalRevenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return {
    data: orders,
    meta: {
      page,
      limit,
      skip,
      totalOrder,
      totalSold,
      totalProduct,
      totalRevenue,
    },
  };
};

const buyerOrderHistory = async ({
  userId,
  query,
}: {
  userId: string;
  query: any;
}) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', null);
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        customerEmail: currentUser?.email,
      },
    },
  ];

  const orders = await Order.aggregate([
    ...pipeline,
    {
      $sort: {
        orderAt: -1,
      },
    },
    { $skip: skip },
    { $limit: limit },
    getLookupStage('products', 'product', '_id', 'product'),
    getUnwindStage('product'),
    getLookupStage('brands', 'product.brand', '_id', 'product.brand'),
    getUnwindStage('product.brand'),
    getLookupStage('users', 'seller', '_id', 'seller'),
    getUnwindStage('seller'),
  ]);

  // Calculate totalSold count
  const totalSold = orders.reduce((sum, order) => sum + order.quantity, 0);

  // Calculate total order
  const totalOrder = await Order.aggregate([
    ...pipeline,
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
      },
    },
  ]);

  // Calculate totalProduct count
  const totalProduct = await Product.countDocuments({ isDeleted: false });

  // Calculate totalRevenue
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  return {
    data: orders,
    meta: {
      page,
      limit,
      skip,
      totalOrder: totalOrder[0].total || 0,
      totalSold,
      totalProduct,
      totalRevenue,
    },
  };
};

export const getTopSellingProducts = async ({
  userId,
  query,
}: {
  userId: string;
  query: any;
}) => {
  let dateFilter = {};

  if (query?.dateRange) {
    const currentDate = new Date();
    switch (query?.dateRange) {
      case 'weekly':
        currentDate.setDate(currentDate.getDate() - 7);
        break;
      case 'daily':
        currentDate.setDate(currentDate.getDate() - 1);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() - 1);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        break;
      default:
        break;
    }

    dateFilter = {
      orderAt: { $gte: currentDate.toISOString() },
    };
  }

  const topSellingProducts = await Order.aggregate([
    {
      $match: dateFilter,
    },
    {
      $match: {
        seller: new mongoose.mongo.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: '$product',
        totalQuantitySold: { $sum: '$quantity' },
        totalPrice: { $sum: '$totalPrice' },
      },
    },
    {
      $sort: { totalQuantitySold: -1 },
    },
    {
      $limit: 6,
    },
    getLookupStage('products', '_id', '_id', 'productInfo'),
    {
      $unwind: '$productInfo',
    },
    {
      $project: {
        _id: '$productInfo._id',
        title: '$productInfo.title',
        price: '$productInfo.price',
        image: '$productInfo.image',
        category: '$productInfo.category',
        brand: '$productInfo.brand',
        totalQuantitySold: 1,
        totalPrice: 1,
      },
    },
    getLookupStage('categories', 'category', '_id', 'category'),
    getLookupStage('brands', 'brand', '_id', 'brand'),
    getUnwindStage('category'),
    getUnwindStage('brand'),
  ]);

  return topSellingProducts;
};

export const orderService = {
  newOrder,
  orderHistory,
  getTopSellingProducts,
  buyerOrderHistory,
};
