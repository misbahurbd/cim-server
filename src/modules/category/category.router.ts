import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';

const router = express.Router();

router.post(
  '/',
  checkAuth('seller'),
  validateRequest(categoryValidation.createCategory),
  categoryController.createCategory,
);

router.get('/', checkAuth(), categoryController.getAllCategory);

export const categoryRouter = router;
