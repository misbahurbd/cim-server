/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import config from '../../config';
import { Product } from './product.model';
import { IProduct } from './product.interface';
import {
  fillingMissingDay,
  getFilterPipeline,
  getLookupStage,
  getMatchStage,
  getUnwindStage,
  mergeByDay,
} from '../../utils';
import mongoose, { Types } from 'mongoose';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { Order } from '../order/order.model';
import { differenceInDays, subDays } from 'date-fns';
import { User } from '../user/user.model';
import { Request } from '../request/request.model';

// upload product image
const uploadImage = async (imageSrc: string) => {
  cloudinary.config({
    cloud_name: config.cloudinary_cloud_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
  });

  const options: UploadApiOptions = {
    folder: 'products',
  };
  const result = await cloudinary.uploader.upload(imageSrc, options);

  return result;
};

// add new product
const addProduct = async (productData: IProduct) => {
  const product = await Product.create(productData);
  return product;
};

// get single product
const getProduct = async (id: string) => {
  const product = await Product.findOne({ _id: id, isDeleted: false })
    .populate('createdBy')
    .populate('category')
    .populate('brand');

  if (!product)
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product not found',
      'Invalid product ID',
    );
  return product;
};

// get all product by userId
const getCurrentUserProducts = async (userId: string, payload: any) => {
  const page = payload?.page ? parseInt(payload.page) : 1;
  const limit = payload?.limit ? parseInt(payload.limit) : 6;
  const skip = (page - 1) * limit;

  const filter = getFilterPipeline(payload);

  const mainPipeline = [
    {
      $match: {
        isDeleted: false,
        createdBy: new mongoose.mongo.ObjectId(userId),
      },
    },
    getLookupStage('categories', 'category', '_id', 'category'),
    getLookupStage('brands', 'brand', '_id', 'brand'),
    getLookupStage('users', 'createdBy', '_id', 'createdBy'),
    getUnwindStage('category'),
    getUnwindStage('brand'),
    getUnwindStage('createdBy'),
    getMatchStage(filter),
    {
      $project: {
        ['createdBy.hashedPassword']: 0,
      },
    },
  ];

  if (payload.search) {
    mainPipeline.unshift({
      $match: {
        $text: { $search: payload.search },
      },
    });
  }

  const products = await Product.aggregate([
    ...mainPipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = await Product.aggregate([
    ...mainPipeline,
    {
      $group: {
        _id: null,
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        maxPrice: 1,
        minPrice: 1,
        total: 1,
      },
    },
  ]);

  const filterValue = await Product.aggregate([
    {
      $unwind: '$interface',
    },
    {
      $group: {
        _id: null,
        capacities: { $addToSet: '$capacity' },
        interfaces: { $addToSet: '$interface' },
      },
    },
    {
      $project: {
        _id: 0,
        capacities: 1,
        interfaces: 1,
      },
    },
  ]);

  const response = {
    data: products,
    meta: { total: 0, ...meta[0], page, limit, filterValue: filterValue[0] },
  };

  return response;
};

// get all product by userId
const getProducts = async (payload: any) => {
  const page = payload?.page ? parseInt(payload.page) : 1;
  const limit = payload?.limit ? parseInt(payload.limit) : 6;
  const skip = (page - 1) * limit;

  const filter = getFilterPipeline(payload);

  const mainPipeline = [
    {
      $match: {
        isDeleted: false,
      },
    },
    getLookupStage('categories', 'category', '_id', 'category'),
    getLookupStage('brands', 'brand', '_id', 'brand'),
    getLookupStage('users', 'createdBy', '_id', 'createdBy'),
    getUnwindStage('category'),
    getUnwindStage('brand'),
    getUnwindStage('createdBy'),
    getMatchStage(filter),
    {
      $project: {
        ['createdBy.hashedPassword']: 0,
      },
    },
  ];

  if (payload.search) {
    mainPipeline.unshift({
      $match: {
        $text: { $search: payload.search },
      },
    });
  }

  const products = await Product.aggregate([
    ...mainPipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  const meta = await Product.aggregate([
    ...mainPipeline,
    {
      $group: {
        _id: null,
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
        total: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        maxPrice: 1,
        minPrice: 1,
        total: 1,
      },
    },
  ]);

  const filterValue = await Product.aggregate([
    {
      $unwind: '$interface',
    },
    {
      $group: {
        _id: null,
        capacities: { $addToSet: '$capacity' },
        interfaces: { $addToSet: '$interface' },
      },
    },
    {
      $project: {
        _id: 0,
        capacities: 1,
        interfaces: 1,
      },
    },
  ]);

  const response = {
    data: products,
    meta: { total: 0, ...meta[0], page, limit, filterValue: filterValue[0] },
  };

  return response;
};

// get related product
const getRelatedProducts = async (id: string) => {
  const product = await Product.findById(id)
    .populate('brand')
    .populate('category');
  if (!product) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Product not found',
      'Invalid product ID',
    );
  }

  const relatedProducts = await Product.find({
    $or: [
      { brand: product.brand },
      { category: product.category },
      { compatibility: { $in: product.compatibility } },
    ],
    isDeleted: false,
    _id: { $ne: id },
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate('category')
    .populate('brand');

  return relatedProducts;
};

// delete single product
const deleteProduct = async (id: string, currentUser: JwtPayload) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, createdBy: currentUser.id },
    { isDeleted: true },
    {
      new: true,
    },
  );

  return product;
};

// delete multiple product
const deleteProducts = async (ids: string[], currentUser: JwtPayload) => {
  const result = await Product.updateMany(
    { _id: { $in: ids }, createdBy: currentUser.id },
    { $set: { isDeleted: true } },
  );

  return result;
};

// update product
const updateProduct = async (id: string, updateData: any) => {
  const product = await Product.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
  });
  return product;
};

// get top selling product
const getTopSellingProducts = async () => {
  const topSellingProducts = await Order.aggregate([
    {
      $group: {
        _id: '$product',
        totalQuantitySold: { $sum: '$quantity' },
      },
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
        isDeleted: '$productInfo.isDeleted',
        totalQuantitySold: 1,
      },
    },
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $sort: { totalQuantitySold: -1 },
    },
    {
      $limit: 3,
    },
    getLookupStage('categories', 'category', '_id', 'category'),
    getLookupStage('brands', 'brand', '_id', 'brand'),
    getUnwindStage('category'),
    getUnwindStage('brand'),
  ]);

  return topSellingProducts;
};

// get overview data
const overviewData = async (userId: string, query: any) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized', null);
  }

  const fatchOverviewData = async (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => {
    const matchCondition =
      user.role == 'buyer'
        ? {
            customerEmail: user.email,
            orderAt: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          }
        : {
            seller: new Types.ObjectId(userId),
            orderAt: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
          };

    const pipeline = [
      {
        $match: matchCondition,
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalProductsSold: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalProductsSold: 1,
        },
      },
    ];

    // Execute the aggregation
    const [result] = await Order.aggregate(pipeline).exec();

    const condition =
      user.role === 'seller'
        ? {
            updatedAt: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
            status: 'solved',
            provider: new Types.ObjectId(userId),
          }
        : {
            createdAt: {
              $gte: startDate.toISOString(),
              $lte: endDate.toISOString(),
            },
            requestFrom: new Types.ObjectId(userId),
          };
    const requestCount = await Request.countDocuments(condition).exec();

    return {
      revenue: result?.totalRevenue || 0,
      productSold: result?.totalProductsSold || 0,
      request: requestCount || 0,
    };
  };

  const range =
    query?.range === 'weekly'
      ? 7
      : query?.range === 'monthly'
        ? 30
        : query?.range === '90-day'
          ? 90
          : query?.range === 'yearly'
            ? 365
            : 90;

  const startDate = subDays(new Date(), range);
  const endDate = new Date();

  const periodLength = differenceInDays(endDate, startDate) + 1;
  const lastPeriodStart = subDays(startDate, periodLength);
  const lastPeriodEnd = subDays(endDate, periodLength);

  const currentPeriod = await fatchOverviewData(userId, startDate, endDate);
  const lastPeriod = await fatchOverviewData(
    userId,
    lastPeriodStart,
    lastPeriodEnd,
  );

  const chartMatcher =
    user.role === 'seller'
      ? {
          seller: new Types.ObjectId(userId),
        }
      : {
          customerEmail: user.email,
        };

  const orderCount = await Order.aggregate([
    {
      $match: chartMatcher,
    },
    {
      $match: {
        orderAt: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      },
    },
    {
      $group: {
        _id: '$orderAt', // Group by the order date
        totalProductsSold: { $sum: '$quantity' }, // Sum the quantities sold per day
      },
    },
    {
      $sort: { _id: 1 }, // Sort by date in ascending order
    },
  ]).exec();

  const orderChart = orderCount.map((order) => ({
    date: order._id,
    sold: order.totalProductsSold,
  }));

  const formatedOrderChart = mergeByDay(orderChart);

  const chartData = fillingMissingDay(formatedOrderChart, startDate, endDate);

  const productCondtion =
    user.role === 'seller'
      ? {
          createdBy: new Types.ObjectId(userId),
          quantity: { $gte: 0 },
          isDeleted: false,
        }
      : {
          quantity: { $gte: 0 },
          isDeleted: false,
        };
  const product = await Product.countDocuments(productCondtion);

  return {
    currentPeriod,
    lastPeriod,
    chartData,
    product,
    period: {
      startDate,
      endDate,
    },
  };
};

export const productService = {
  uploadImage,
  addProduct,
  getCurrentUserProducts,
  getTopSellingProducts,
  getRelatedProducts,
  deleteProduct,
  deleteProducts,
  updateProduct,
  getProduct,
  getProducts,
  overviewData,
};
