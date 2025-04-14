import { StatusCodes } from 'http-status-codes';
import { components } from '../types/apiGenerated.interface';

export class ApiError extends Error {
  statusCode: number;
  error: string;
  constructor(statusCode: number = 500, message: string) {
    super(message);

    this.statusCode = statusCode;
    if (statusCode == StatusCodes.INTERNAL_SERVER_ERROR) {
      this.error = 'Internal Server Error';
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends ApiError {
  constructor(
    message: NonNullable<components['schemas']['ErrorResponse']['message']>
  ) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string) {
    super(StatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}
