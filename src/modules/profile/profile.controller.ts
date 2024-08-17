import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import { profileService } from './profile.service';

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthrized', null);
  }

  const result = await profileService.updateProfile(currentUser.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile update successfully!',
    data: result,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.id) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthrized', null);
  }

  const result = await profileService.getProfile(currentUser.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile data retrive successfully!',
    data: result,
  });
});

export const profileController = {
  updateProfile,
  getProfile,
};
