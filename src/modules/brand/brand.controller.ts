import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { brandService } from './brand.service';
import httpStatus from 'http-status';

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.createBrand(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Brand created successfully',
    data: result,
  });
});

const getAllBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await brandService.getAllBrand();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand fetched successfully',
    data: result,
  });
});

export const brandController = {
  createBrand,
  getAllBrand,
};
