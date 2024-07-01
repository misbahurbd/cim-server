import { Request, Response } from 'express';
import { catchAsync, sendResponse } from '../../utils';
import { authService } from './auth.service';
import httpStatus from 'http-status';
import config from '../../config';

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
  refreshToken,
};
