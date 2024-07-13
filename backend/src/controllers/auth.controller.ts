import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error.util';
import { AuthService } from '../services/auth.service';
import { IUser } from '../types/global';
import {
    LoginReqBody,
} from '../types/request/auth.request';

export class AuthController {

    static async userLogin(req: Request, res: Response) {
        try {
            const loginReqBody: LoginReqBody = req.body;
            if (!loginReqBody) throw new ApiError(StatusCodes.BAD_REQUEST, 'MISSING REQUEST');
            const { accessToken, refreshToken } = await AuthService.userLogin(loginReqBody);
            res.status(StatusCodes.OK).json({ accessToken, refreshToken });
        } catch (error: any) {
            console.log(error);
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });

        }
    }

    static async userRegister(req: Request, res: Response) {
        try {
            const registerReqBody: IUser = req.body;
            if (!registerReqBody) throw new ApiError(StatusCodes.BAD_REQUEST, 'MISSING REQUEST');
            const newUser = await AuthService.userRegister(registerReqBody);
            res.status(StatusCodes.CREATED).json({ newUser });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async logout(req: Request, res: Response) {
        try {
            const userId = req.user._id;
            await AuthService.logout(userId);
            res.status(StatusCodes.OK).json({ message: 'Logout success' });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const message = await AuthService.forgotPassword(email);
            res.status(StatusCodes.OK).json(message);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async resetPassword(req: Request, res: Response) {
        try {
            const tokenResetPassword = req.params.token as string;
            const newPassword = req.body.password
            await AuthService.resetPassword(tokenResetPassword, newPassword);
            console.log(req.body);
            res.status(StatusCodes.OK).json({ message: 'Reset password success' });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

}
