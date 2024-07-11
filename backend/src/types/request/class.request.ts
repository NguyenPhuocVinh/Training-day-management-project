import { ObjectId } from 'mongoose'

export interface ClassRequestBody {
    className: string
    facilityId: ObjectId
}