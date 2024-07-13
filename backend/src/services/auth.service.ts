import moment from 'moment-timezone'

import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { User } from '../models/user/user.model'
import { Admin } from '../models/admin/admin.model'
import { LoginReqBody } from '../types/request/auth.request'
import { TokenService } from './token.service'
import { TokenModel } from '../models/token.model'
import { IUser } from '../types/global'
import { EmailService } from './email.service'
import { hash } from 'crypto'

export class AuthService {
    static async userLogin({ MSSV, password }: LoginReqBody) {
        // Find the user by MSSV and select the password
        const user = await User.findOne({ MSSV }).select('+password');
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found with this MSSV');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');
        }

        // Generate access and refresh tokens
        const accessToken = await TokenService.SignAccessToken({ _id: user._id });
        const refreshToken = await TokenService.SignRefreshToken({ _id: user._id });

        // Save the refresh token with an expiration time
        await TokenService.SaveUserToken({
            userId: user._id,
            token: refreshToken,
            type: 'refresh_token',
            expiresTime: moment().add(14, 'days').toDate(),
        });

        return { accessToken, refreshToken };
    }

    static async userRegister(registerReqBody: IUser) {
        console.log(registerReqBody)
        const { MSSV, password } = registerReqBody
        const existedUser = await User.findOne({ MSSV })
        if (existedUser) throw new ApiError(StatusCodes.CONFLICT, 'User is existed')
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword)
        await User.create(
            {
                ...registerReqBody,
                password: hashedPassword
            }
        )
        return { message: 'Register success' }
    }

    static async logout(userOrAdminId: string) {
        const user = await User.findById(userOrAdminId)
        if (user) {
            const result = await TokenModel.deleteOne({ userId: userOrAdminId })
            return result
        }

        const admin = await Admin.findById(userOrAdminId)
        if (admin) {
            const result = await TokenModel.deleteOne({ adminId: userOrAdminId })
            return result
        }

        return null;
    }

    static async forgotPassword(email: string) {
        const user = await User.findOne({ email })
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found')
        const resetPasswordToken = await TokenService.resetPasswordToken({ _id: user._id })

        Promise.all([
            TokenService.SaveUserToken({
                userId: user._id,
                token: resetPasswordToken,
                type: 'reset_password',
                expiresTime: moment().add(10, 'minutes').toDate()
            }),
            EmailService.sendResetPasswordToken(user.email, resetPasswordToken)
        ])
        return { message: 'Email sent' }
    }

    static async resetPassword(tokenResetPassword: string, newPassword: string) {

        const token = await TokenModel.findOneAndDelete(
            {
                token: tokenResetPassword,
                type: 'reset_password',
            }
        ).populate('userId');

        if (!token || !token.checkExpires()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Token expired');
        }

        if (!token.userId && !token.adminId) {
            throw new ApiError(StatusCodes.FORBIDDEN, 'Token invalid');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        if (token.userId) {
            await User.findByIdAndUpdate(token.userId, { password: hashedPassword });
        } else if (token.adminId) {
            await Admin.findByIdAndUpdate(token.adminId, { password: hashedPassword });
        }

        return { message: 'Reset password success' };
    }
}