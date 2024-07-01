import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Something went wrong';
  let errorMessage = err.errorMessage || null;
  let errorDetails = err || null;
  const stack = config.NODE_ENV === 'development' ? err.stack || null : null;

  if (err instanceof mongoose.Error.CastError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID!';
    errorMessage = `${err.value} is not a valid ID!`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Invalid ID!';
  } else if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorMessage = err.issues.map((issue) => issue.message).join('. ');
  } else if (err.code && err.code === 11000) {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Duplicate Entry';
    if (err.keyValue) {
      errorMessage = `${Object.keys(err.keyValue)} is already exist`;
    }
  } else {
    errorDetails = null;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    errorDetails,
    stack,
  });
  next();
};

export default globalErrorHandler;
