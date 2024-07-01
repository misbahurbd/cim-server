/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Payload } from '../interfaces';

// global response sender
export const sendResponse = <T, M>(
  res: Response,
  options: {
    statusCode: number;
    success?: boolean;
    data: T;
    meta?: M;
    message: string;
  },
) => {
  res.status(options.statusCode).json({
    success: options.success ?? true,
    ...options,
  });
};

// handle async function globally
export const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// generate aut token
export const generateToken = (
  payload: Payload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// get filter pipeline
export const getFilterPipeline = (payload: any) => {
  const filter: any = {};
  if (payload.category) {
    filter['category.name'] = {
      $in: payload.category.split(','),
    };
  }
  if (payload.brand) {
    filter['brand.name'] = {
      $in: payload.brand.split(','),
    };
  }
  if (payload.interface) {
    filter.interface = {
      $in: payload.interface.split(','),
    };
  }
  if (payload.condition) {
    filter.condition = {
      $in: payload.condition.split(','),
    };
  }
  if (payload.compatibility) {
    filter.compatibility = {
      $in: payload.compatibility.split(','),
    };
  }
  if (payload.capacity) {
    filter.capacity = {
      $in: payload.capacity.split(','),
    };
  }
  if (payload.minPrice && !payload.maxPrice) {
    filter.price = { $gte: parseFloat(payload.minPrice) };
  }
  if (payload.maxPrice && !payload.minPrice) {
    filter.price = { $lte: parseFloat(payload.maxPrice) };
  }
  if (payload.minPrice && payload.maxPrice) {
    filter.price = {
      $gte: parseFloat(payload.minPrice),
      $lte: parseFloat(payload.maxPrice),
    };
  }
  return filter;
};

export const getLookupStage = (
  from: string,
  localField: string,
  foreignField: string,
  as: string,
) => {
  return {
    $lookup: {
      from,
      localField,
      foreignField,
      as,
    },
  };
};

export const getUnwindStage = (field: string) => ({
  $unwind: `$${field}`,
});

export const getMatchStage = (filter: any) => ({ $match: filter });
export const getSkipStage = (skip: number) => ({ $skip: skip });
export const getLimitStage = (limit: number) => ({ $limit: limit });
