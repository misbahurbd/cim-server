import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { categoryService } from './category.service';
import httpStatus from 'http-status';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategory();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategory,
};
