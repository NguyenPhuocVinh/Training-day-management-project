import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { appConfig } from '../configs/app.config'
import { TokenPayload } from '../types/request/auth.request'

export const signToken = ({
    payload,
    privateKey,
    options = {
        algorithm: 'HS256',
    }
}: {
    payload: string | object | Buffer,
    privateKey: string,
    options?: SignOptions
}) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (_err, _token) => {
            if (_err) return reject(_err)
            return resolve(_token as string)
        })
    })
}

export const verifyToken = ({
    token,
    secretOrPublicKey = appConfig.jwt.secret as string
}: {
    token: string,
    secretOrPublicKey?: string
}) => {
    return new Promise<TokenPayload>((resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) return reject(err);
            return resolve(decoded as TokenPayload);
        });
    });
};