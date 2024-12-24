/* eslint-disable @typescript-eslint/no-explicit-any */

import { ZodError } from "zod";
import { ErrorRequestHandler, Request, Response, NextFunction } from "express";
import { IErrorResponse, IGenericErrorMessage } from "../interface/error";
import handlerZodError from "../errors/handleZodError";
import mongoose from "mongoose";
import handleValidationError from "../errors/handleValidationError";
import handlerCastError from "../errors/handleCastError";

import AppError from "../errors/AppError";

import { errorLogger } from "../shared/logger";

 const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  process.env.NODE_ENV === 'development'
    ? console.log(`globalErrorHandler ~`, error)
    : errorLogger.error(`globalErrorHandler ~`, error);

  let statusCode = 500;
  let message = 'Something went wrong !';
  let errorMessage: IGenericErrorMessage[] = [];

  if (error?.name === 'validationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = [{ path: '', message: simplifiedError.errorMessage }];
  } else if (error instanceof ZodError) {
    const simplifiedError = handlerZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = [{ path: '', message: simplifiedError.errorMessage }];
  } else if (error?.name === 'CastError') {
    const simplifiedError = handlerCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessage = [{ path: '', message: simplifiedError.errorMessage }];
  } else if (error instanceof AppError) {
    statusCode = error?.statusCode;
    message = error.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessage = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessage,
    stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
  });
  next();
};

export default globalErrorHandler;