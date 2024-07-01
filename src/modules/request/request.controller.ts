import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { requestService } from './request.service';
import httpStatus from 'http-status';

// add new request
const addRequest = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const result = await requestService.addRequest({
    userId: user.id,
    requestData: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Request added successfully',
    data: result,
  });
});

// get buyer requests
const getBuyerRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.getBuyerRequests({
    userId: req.params.id,
    query: req.query,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Requests fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

// get all pending request
const getPendingRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.getPendingRequests({
    query: req.query,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Requests fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

// update request
const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await requestService.updateRequest({
    requestId: req.params.id,
    requestData: req.body,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Request updated successfully',
    data: result,
  });
});

export const requestController = {
  addRequest,
  getBuyerRequests,
  getPendingRequests,
  updateRequest,
};
