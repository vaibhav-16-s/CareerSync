import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { sendError } from '../utils/ApiResponse';
import { logger } from '../config/logger';
import { env } from '../config/env';

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`);
}

interface MongoServerError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Known operational errors
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 400, 'VALIDATION_ERROR', 'Invalid request data', details);
    return;
  }

  // Mongoose validation
  if (err instanceof MongooseError.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    sendError(res, 400, 'VALIDATION_ERROR', 'Validation failed', details);
    return;
  }

  // Mongoose cast (bad ObjectId)
  if (err instanceof MongooseError.CastError) {
    sendError(res, 400, 'VALIDATION_ERROR', `Invalid ${err.path}: ${err.value}`);
    return;
  }

  // Mongo duplicate key
  const mongoErr = err as MongoServerError;
  if (mongoErr.code === 11000) {
    const field = mongoErr.keyValue ? Object.keys(mongoErr.keyValue)[0] : 'field';
    sendError(res, 409, 'CONFLICT', `Duplicate value for ${field}`);
    return;
  }

  // Unknown / programming errors
  logger.error('Unhandled error', {
    message: (err as Error)?.message,
    stack: (err as Error)?.stack,
    path: req.originalUrl,
  });

  sendError(
    res,
    500,
    'INTERNAL',
    env.isProduction ? 'Something went wrong' : (err as Error)?.message || 'Internal server error'
  );
}
