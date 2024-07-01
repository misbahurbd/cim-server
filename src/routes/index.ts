import express, { Router } from 'express';
import { authRouter } from '../modules/auth/auth.route';
import { categoryRouter } from '../modules/category/category.router';
import { brandRouter } from '../modules/brand/brand.router';
import { productRouter } from '../modules/product/product.router';
import { orderRouter } from '../modules/order/order.router';
import { couponRouter } from '../modules/coupon/coupon.router';
import { requestRouter } from '../modules/request/request.router';

const router = express.Router();

const routers: { path: string; router: Router }[] = [
  {
    path: '/auth',
    router: authRouter,
  },
  {
    path: '/categories',
    router: categoryRouter,
  },
  {
    path: '/brands',
    router: brandRouter,
  },
  {
    path: '/products',
    router: productRouter,
  },
  {
    path: '/orders',
    router: orderRouter,
  },
  {
    path: '/coupons',
    router: couponRouter,
  },
  {
    path: '/requests',
    router: requestRouter,
  },
];

routers.forEach((route) => {
  router.use(route.path, route.router);
});

export default router;
