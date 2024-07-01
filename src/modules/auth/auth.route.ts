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

// refresh token
router.get('/refresh-token', authController.refreshToken);

export const authRouter = router;
