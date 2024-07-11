import moment from 'moment-timezone'
import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Admin } from '../models/admin/admin.model'
import { LoginAdminReqBody } from '../types/request/auth.request'
import { TokenService } from './token.service'
import { IAdmin } from '../types/global'


export class AdminService {
    static async adminRegister(registerAdminReqBody: IAdmin) {
        const { email } = registerAdminReqBody
        const existedAdmin = await Admin.findOne({ email })
        if (existedAdmin) throw new ApiError(StatusCodes.CONFLICT, 'Admin is existed')
        const hassedPassword = await bcrypt.hash(registerAdminReqBody.password, 10)
        await Admin.create(
            {
                ...registerAdminReqBody,
                password: hassedPassword,
            }
        )
        return { message: 'Register success' }
    }

    static async adminLogin({ email, password }: LoginAdminReqBody) {
        const admin = await Admin.findOne({ email })
        if (!admin) throw new ApiError(StatusCodes.NOT_FOUND, 'Wrong email')
        if (admin.roleId === null) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'You are not allowed to login')
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Wrong password')
        const accessToken = await TokenService.SignAccessToken({ _id: admin._id, roleId: admin.roleId })

        const refreshToken = await TokenService.SignRefreshToken({ _id: admin._id, roleId: admin.roleId })
        const token = await TokenService.SaveAdminToken({
            adminId: admin._id,
            token: refreshToken,
            type: 'refresh_token',
            expiresTime: moment().add(14, 'days').toDate()
        })

        return { accessToken, refreshToken }
    }



}