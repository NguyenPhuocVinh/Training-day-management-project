import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { AdminService } from '../services/admin.service'
import { IAdmin } from '../types/global'
import {
    LoginAdminReqBody
} from '../types/request/auth.request'

export class AdminControler {
    static async adminRegister(req: Request, res: Response) {
        try {
            const registerAdminReqBody: IAdmin = req.body;
            const newAdmin = await AdminService.adminRegister(registerAdminReqBody);
            res.status(StatusCodes.CREATED).json({ newAdmin });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async adminLogin(req: Request, res: Response) {
        try {
            const loginAdminReqBody: LoginAdminReqBody = req.body;
            if (!loginAdminReqBody.email || !loginAdminReqBody.password) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'MISSING REQUEST');
            }
            const { accessToken, refreshToken } = await AdminService.adminLogin(loginAdminReqBody);
            res.status(StatusCodes.OK).json({ accessToken, refreshToken });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

}