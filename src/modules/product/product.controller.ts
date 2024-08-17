import httpStatus from 'http-status';
import { AppError } from '../../errors/appError';
import { catchAsync, sendResponse } from '../../utils';
import { productService } from './product.service';
import { Request, Response } from 'express';

// upload product image
const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file || !req.file.buffer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please upload an image', null);
  }
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

  const result = await productService.uploadImage(dataURI);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Image uploaded successfully',
    data: result,
  });
});

// add new product
const addProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.addProduct(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Product added successfully',
    data: result,
  });
});

// get single product
const getProduct = catchAsync(async (req: Request, res: Response) => {
  if (!req.params.id) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please provide product id',
      null,
    );
  }

  const result = await productService.getProduct(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product fetched successfully',
    data: result,
  });
});

// get current user order
const getCurrentUserProducts = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (!userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please provide user id',
        null,
      );
    }

    const currentUser = req.user;
    if (currentUser.id !== userId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid current user id',
        null,
      );
    }

    const result = await productService.getCurrentUserProducts(
      currentUser.id,
      req.query,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: 'Products fetched successfully',
      data: result.data,
      meta: result.meta,
    });
  },
);

// get current user order
const getProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.query);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'Products fetched successfully',
    data: result.data,
    meta: result.meta,
  });
});

// get related product
const getRelatedProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.getRelatedProducts(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Related products fetched successfully',
    data: result,
  });
});

// delete single product
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login your account',
      null,
    );
  }
  const result = await productService.deleteProduct(req.params.id, currentUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product Delete successfully',
    data: result,
  });
});

// delete multiple products
const deleteProducts = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login your account',
      null,
    );
  }
  await productService.deleteProducts(req.body.ids, currentUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products deleted successfully',
    data: null,
  });
});

// update products
const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await productService.updateProduct(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product updated successfully',
    data: result,
  });
});

// get top selling product
const getTopSellingProducts = catchAsync(
  async (req: Request, res: Response) => {
    const result = await productService.getTopSellingProducts();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: 'Top selling products fetched successfully',
      data: result,
    });
  },
);

const overviewData = catchAsync(async (req: Request, res: Response) => {
  const currentUser = req.user;
  if (!currentUser || !currentUser.id) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login your account',
      null,
    );
  }


  const result = await productService.overviewData(currentUser.id, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Overview data retrive successfully!',
    data: result,
  });
});

export const productController = {
  uploadImage,
  addProduct,
  getCurrentUserProducts,
  getTopSellingProducts,
  getRelatedProducts,
  deleteProduct,
  deleteProducts,
  updateProduct,
  getProduct,
  getProducts,
  overviewData,
};
