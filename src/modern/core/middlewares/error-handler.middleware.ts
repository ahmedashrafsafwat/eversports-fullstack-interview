import { ErrorRequestHandler } from 'express';
import { ApiError } from '../errors/apiError';
import { StatusCodes } from 'http-status-codes';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error(err);

  // Handle ApiError instances
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: 'Internal Server Error',
    message: err.message
  });
};
