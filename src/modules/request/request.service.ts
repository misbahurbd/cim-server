/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { User } from '../user/user.model';
import { IRequest } from './request.interface';
import { Request } from './request.model';

// add new request
const addRequest = async ({
  userId,
  requestData,
}: {
  userId: string;
  requestData: IRequest;
}) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please provide valid user id',
      null,
    );
  }
  if (currentUser.role !== 'buyer') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only buyers can add request',
      null,
    );
  }

  const request = await Request.create(requestData);
  return request;
};

// get all buyer request by ID
const getBuyerRequests = async ({
  userId,
  query,
}: {
  userId: string;
  query: any;
}) => {
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please provide valid user id',
      null,
    );
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const requests = await Request.find({ requestFrom: userId })
    .populate('requestFrom')
    .populate('provider')
    .sort({
      createdAt: -1,
    })
    .limit(limit)
    .skip(skip);

  const totalRequest = await Request.countDocuments({ requestFrom: userId });

  return {
    data: requests,
    meta: {
      page,
      limit,
      skip,
      totalRequest,
    },
  };
};

// get all pending request
const getPendingRequests = async ({ query }: { query: any }) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 6;
  const skip = (page - 1) * limit;

  const requests = await Request.find({ status: 'pending' })
    .populate('requestFrom')
    .populate('provider')
    .limit(limit)
    .skip(skip);

  const totalRequest = await Request.countDocuments({ status: 'pending' });

  return {
    data: requests,
    meta: {
      page,
      limit,
      skip,
      totalRequest,
    },
  };
};

// update request
const updateRequest = async ({
  requestId,
  requestData,
}: {
  requestId: string;
  requestData: any;
}) => {
  const request = await Request.findByIdAndUpdate(
    requestId,
    {
      schedule: requestData.schedule,
      provider: requestData.provider,
      status: 'solved',
    },
    { new: true },
  );

  return request;
};

export const requestService = {
  addRequest,
  getBuyerRequests,
  getPendingRequests,
  updateRequest,
};
