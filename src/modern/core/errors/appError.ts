import { StatusCodes } from 'http-status-codes';

export default class AppError extends Error {
    status: string;
  
    constructor(public statusCode: number = 500, public message: string) {
      super(message);
  
      this.statusCode = statusCode;
      // adds stack property to the error object
      Error.captureStackTrace(this, this.constructor);
    }
  }

export class InternalServerError extends AppError {
    constructor(message:string) {
      super(StatusCodes.INTERNAL_SERVER_ERROR, message);
    }
}