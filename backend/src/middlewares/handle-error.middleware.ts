import { Response, Request, NextFunction } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { ApiError } from '../utils/api-error.util';

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = err.statusCode;
    let message = err.message || getReasonPhrase(statusCode);
    let isOperational = err.isOperational || true;

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }
    return res.status(statusCode).json({
        statusCode,
        message,
        isOperational,
    });
};
