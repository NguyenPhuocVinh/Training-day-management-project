import { appConfig } from '../configs/app.config'
import { TokenPayload } from '../types/request/auth.request'
import { signToken } from '../utils/jwt.util'
import { ITokenAdmin } from '../types/global'
import { IToken } from '../types/global'
import { TokenModel } from '../models/token.model'

export class TokenService {

    static async SignAccessToken(payload: TokenPayload) {
        const { secret, expiresIn } = appConfig.jwt
        return signToken({
            payload,
            privateKey: secret as string,
            options: { expiresIn }
        })
    }

    static async SignRefreshToken(payload: TokenPayload) {
        const { secret } = appConfig.jwt
        return signToken({
            payload,
            privateKey: secret as string
        })
    }

    static async resetPasswordToken(payload: TokenPayload) {
        const { secret } = appConfig.jwt
        return signToken({
            payload,
            privateKey: secret as string
        })
    }

    static async SaveAdminToken(payload: IToken) {
        return TokenModel.create(payload)
    }

    static async SaveUserToken(payload: IToken) {
        return TokenModel.create(payload)
    }

    static async Delete(userIdOrAdminId: string) {
        await TokenModel.deleteMany({ userId: userIdOrAdminId })
    }
}