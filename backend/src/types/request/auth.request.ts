import { ObjectId } from "mongoose"

// * Add info Request
declare module 'express' {
    interface Request {
        user?: any;
        file?: any;
        files?: any;
    }
}


// * Login user
export interface LoginReqBody {
    MSSV: string
    password: string
}

// * Register user
export interface RegisterReqBody {
    MSSV: string
    fullName: string
    email: string
    password: string
    birthDay: Date
    gender: Boolean
}

// * Register admin
export interface RegisterAdminReqBody {
    fullName: string
    email: string
    password: string
    facilityId: ObjectId
    roleId: ObjectId
}

// * Login admin   
export interface LoginAdminReqBody {
    email: string
    password: string
}

// * Token payload
export interface TokenPayload {
    _id: any
    roleId?: any
}


