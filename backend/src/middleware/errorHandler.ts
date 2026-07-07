import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { sendError } from '../utils/response';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  console.error('Unhandled error:', err);
  sendError(res, 'Internal server error', 500);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};
