import express from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { checkAuth } from '../../middlewares/checkAuth';
import { brandValidation } from './brand.validation';
import { brandController } from './brand.controller';

const router = express.Router();

router.post(
  '/',
  checkAuth('seller'),
  validateRequest(brandValidation.createBrand),
  brandController.createBrand,
);

router.get('/', checkAuth(), brandController.getAllBrand);

export const brandRouter = router;
