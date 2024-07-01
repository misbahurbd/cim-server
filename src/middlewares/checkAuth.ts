import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../errors/appError';
import httpStatus from 'http-status';
import config from '../config';
import { User } from '../modules/user/user.model';

export const checkAuth = (...role: ('buyer' | 'seller')[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Unauthenticated',
        'You do not have the necessary permissions to access this resource.',
      );
    }

    try {
      const decoded = jwt.verify(token, config.jwt_access_secret as string);
      const { id } = decoded as JwtPayload;
      const user = await User.findById(id);

      if (!user) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Unauthenticated',
          'You are not authenticated',
        );
      }

      if (role.length > 0 && !role.includes(user.role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          'Unauthorized Access',
          'You do not have the necessary permissions to access this resource.',
        );
      }

      req.user = decoded as JwtPayload;
    } catch (error) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Unauthenticated',
        'You are not authenticated',
      );
    }

    next();
  });
};
