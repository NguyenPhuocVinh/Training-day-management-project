import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Class } from '../models/class.model'
import { ClassRequestBody } from '../types/request/class.request'

export class ClassService {
    static async Create(classRequestBody: ClassRequestBody) {
        const exitedClass = await Class.findOne({ className: classRequestBody.className })
        if (exitedClass) throw new ApiError(StatusCodes.CONFLICT, 'Class is exited')
        const newClass = await Class.create(
            classRequestBody
        )
        return newClass
    }

    static async Update(classId: string, payload: any) {
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            payload,
            {
                new: true,
            }
        );
        if (!updatedClass) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
        }
        return updatedClass;
    }

    static async Delete(classId: string) {
        const deletedClass = await Class.findByIdAndDelete(classId)
        if (!deletedClass) throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
        return deletedClass
    }

    static async Get(classId: string) {
        const classed = await Class.findById(classId)
        if (!classed) throw new ApiError(StatusCodes.NOT_FOUND, 'Class not found')
        return classed
    }

    static async GetAll() {
        return Class.find().lean()
    }
}