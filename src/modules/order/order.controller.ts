import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { orderService } from './order.service';
import httpStatus from 'http-status';

const newOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.newOrder(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Order created successfully',
    data: result,
  });
});

const orderHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await orderService.orderHistory({
    userId,
    query: req.query,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order history fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});
const buyerOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.userId;

  const result = await orderService.buyerOrderHistory({
    userId,
    query: req.query,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Order history fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

const getTopSellingProducts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const result = await orderService.getTopSellingProducts({
      userId,
      query: req.query,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Top selling products fetched successfully',
      data: result,
    });
  },
);

export const orderController = {
  newOrder,
  orderHistory,
  getTopSellingProducts,
  buyerOrderHistory,
};
