import { checkAuth } from './../../middlewares/checkAuth';
import express from 'express';
import { upload } from '../../utils/multer';
import { productController } from './product.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { productValidation } from './product.validation';

const router = express.Router();

// upload product image
router.post(
  '/upload',
  checkAuth(),
  upload.single('image'),
  productController.uploadImage,
);

// add new product
router.post(
  '/',
  checkAuth('seller'),
  validateRequest(productValidation.addProductSchema),
  productController.addProduct,
);

// get products
router.get('/', checkAuth(), productController.getProducts);

// get top selling product
router.get(
  '/top-selling',
  checkAuth('buyer'),
  productController.getTopSellingProducts,
);

// overview data
router.get('/overview', checkAuth(), productController.overviewData);

// get single product
router.get('/:id', checkAuth(), productController.getProduct);

// get current user products
router.get(
  '/all/:userId',
  checkAuth('seller'),
  productController.getCurrentUserProducts,
);

// get related product
router.get(
  '/related/:id',
  checkAuth('buyer'),
  productController.getRelatedProducts,
);
// delete products
router.put('/delete', checkAuth('seller'), productController.deleteProducts);

// update product
router.put(
  '/:id',
  checkAuth('seller'),
  validateRequest(productValidation.addProductSchema),
  productController.updateProduct,
);

// delete product
router.delete('/:id', checkAuth('seller'), productController.deleteProduct);

export const productRouter = router;
