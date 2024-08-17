import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { authService } from './auth.service';
import httpStatus from 'http-status';
import config from '../../config';
import { AppError } from '../../errors/appError';

// register new user
const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendResponse(res, {
    message: 'User registered successfully',
    statusCode: httpStatus.CREATED,
    data: result,
  });
});

// login existed user
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });

  sendResponse(res, {
    message: 'User login successful',
    statusCode: httpStatus.OK,
    data: {
      accessToken,
    },
  });
});

// forget user password
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.forgetPassword(req.body);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Internal Server Error', null);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset email sent. Please check your inbox.',
    data: null,
  });
});

// reset your password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.params;
  const result = await authService.resetPassword(token, req.body);
  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      null,
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Password reset successfully!',
    data: null,
  });
});

// refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.refreshToken(req.cookies.refreshToken);

  sendResponse(res, {
    message: 'Token refreshed successfully',
    statusCode: httpStatus.OK,
    data: result,
  });
});

export const authController = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  refreshToken,
};
