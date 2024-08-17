import {
  IForgetPassword,
  ILogin,
  IRegister,
  IResetPassword,
} from './auth.interface';
import { isAfter } from 'date-fns';
import { User } from '../user/user.model';
import config from '../../config';
import bcrypt from 'bcrypt';
import { AppError } from '../../errors/appError';
import httpStatus from 'http-status';
import { generateToken } from '../../utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { VerifyToken } from './auth.model';
import sendMail from '../../utils/mailer';

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

// forget user password
const forgetPassword = async (payload: IForgetPassword) => {
  const { email } = payload;

  const isUserExist = await User.findOne({
    email,
  });
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!', null);
  }

  await VerifyToken.deleteMany({
    userId: isUserExist._id,
  });

  const token = crypto.randomUUID();
  const resetToken = await VerifyToken.create({
    token,
    tokenType: 'Reset',
    expireAt: new Date(Date.now() + 1000 * 60 * 60 * 6),
    userId: isUserExist._id,
  });

  const resetLink = `${config.client_url}/reset-password?token=${resetToken.token}`;

  const emailTemplate = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 0;
                  color: #333;
              }
              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                  background-color: #007BFF;
                  padding: 20px;
                  text-align: center;
                  color: #ffffff;
              }
              .email-body {
                  padding: 30px;
              }
              .email-body p {
                  margin: 0 0 20px;
                  line-height: 1.6;
              }
              .email-footer {
                  padding: 20px;
                  text-align: center;
                  background-color: #f4f4f4;
                  font-size: 12px;
                  color: #777;
              }
              .reset-button {
                  display: inline-block;
                  padding: 12px 25px;
                  background-color: #007BFF;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: bold;
              }
              .reset-button:hover {
                  background-color: #0056b3;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">
                  <h1>Reset Your Password</h1>
              </div>
              <div class="email-body">
                  <p>Hi ${isUserExist.name},</p>
                  <p>We received a request to reset your password. Click the button below to reset it:</p>
                  <p style="text-align: center;">
                      <a href="${resetLink}" class="reset-button">Reset Password</a>
                  </p>
                  <p>If you didn't request a password reset, you can safely ignore this email.</p>
                  <p>Thanks,<br>The CIM Team</p>
              </div>
              <div class="email-footer">
                  <p>&copy; 2024 CIM. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
  `;

  sendMail(isUserExist.email, 'Reset your account password', emailTemplate);

  return token;
};

// reset user password
const resetPassword = async (token: string, payload: IResetPassword) => {
  const verifyToken = await VerifyToken.findOne({
    token,
    tokenType: 'Reset',
  });
  if (!verifyToken) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid verification token!',
      null,
    );
  }

  const isTokenExpire = isAfter(new Date(), new Date(verifyToken.expireAt));
  if (isTokenExpire) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token already expired!', null);
  }

  if (payload.password !== payload.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Confirm password does not match!',
      null,
    );
  }

  const hashedPassword = bcrypt.hash(
    payload.password,
    Number(config.hash_round),
  );

  const user = await User.findByIdAndUpdate(
    verifyToken.userId,
    {
      hashedPassword,
    },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!', null);
  }

  return user;
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
  forgetPassword,
  resetPassword,
  refreshToken,
};
