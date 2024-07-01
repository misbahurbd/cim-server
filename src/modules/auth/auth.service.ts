import { ILogin, IRegister } from './auth.interface';
import { User } from '../user/user.model';
import config from '../../config';
import bcrypt from 'bcrypt';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import { generateToken } from '../../utils';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Register new user account
const registerUser = async (payload: IRegister) => {
  const { password, ...remainingData } = payload;

  const hashedPassword = await bcrypt.hash(password, Number(config.hash_round));

  const user = await User.create({
    ...remainingData,
    hashedPassword,
  });

  return user;
};

// Login user account
const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const currentUser = await User.findOne({
    email,
  }).select('+hashedPassword');

  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, 'Not found', 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    currentUser.hashedPassword,
  );
  if (!isPasswordValid) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Invalid credentials',
      'Invalid credentials',
    );
  }

  const jwtPayload = {
    id: currentUser._id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret!,
    '7d',
  );
  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret!,
    '30d',
  );

  return {
    accessToken,
    refreshToken,
  };
};

// Generate refresh token
const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid token', null);
  }

  const decoded = jwt.verify(token, config.jwt_refresh_secret!);
  const { id, name, email, role } = decoded as JwtPayload;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found', null);
  }

  const accessToken = generateToken(
    { id, name, email, role },
    config.jwt_access_secret!,
    '1d',
  );

  return {
    accessToken,
  };
};

export const authService = {
  registerUser,
  loginUser,
  refreshToken,
};
