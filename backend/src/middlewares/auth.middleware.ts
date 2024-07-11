import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verifyToken } from '../utils/jwt.util'
import { ApiError } from '../utils/api-error.util'
import { appConfig } from '../configs/app.config'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) throw new ApiError(StatusCodes.UNAUTHORIZED, 'No token provided');
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await verifyToken({ token, secretOrPublicKey: appConfig.jwt.secret as string });
        req.user = decoded;
        next();
    } catch (error: any) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};