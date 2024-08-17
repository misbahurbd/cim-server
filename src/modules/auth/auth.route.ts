import express from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';

const router = express.Router();

// register new user
router.post(
  '/register',
  validateRequest(authValidation.registerUserSchema),
  authController.registerUser,
);

// login existed user
router.post(
  '/login',
  validateRequest(authValidation.loginUserSchema),
  authController.loginUser,
);

// forget user password
router.post(
  '/forget-password',
  validateRequest(authValidation.forgetPasswordSchema),
  authController.forgetPassword,
);

// forget user password
router.post(
  '/reset-password/:token',
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword,
);

// refresh token
router.get('/refresh-token', authController.refreshToken);

export const authRouter = router;
