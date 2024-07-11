import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { ClassRequestBody } from '../types/request/class.request'
import { ClassService } from '../services/class.service'

export class ClassController {
    static async Create(req: Request, res: Response) {
        try {
            const classRequestBody: ClassRequestBody = req.body
            const newFacility = await ClassService.Create(classRequestBody)
            res.status(StatusCodes.CREATED).json({ newFacility })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Update(req: Request, res: Response) {
        try {
            const classId = req.query.classId as string
            if (!classId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required Class Id')
            const payload: ClassRequestBody = req.body
            const updatedClass = await ClassService.Update(classId, payload)
            res.status(StatusCodes.OK).json({ updatedClass })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Delete(req: Request, res: Response) {
        try {
            const classId = req.query.classId as string
            if (!classId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required Class Id')
            const deletedClass = await ClassService.Delete(classId)
            res.status(StatusCodes.OK).json({ deletedClass, message: 'Success' })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Get(req: Request, res: Response) {
        try {
            const classId = req.params.classId as string
            const classed = await ClassService.Get(classId)
            res.status(StatusCodes.OK).json({ classed })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async GetAll(req: Request, res: Response) {
        try {
            const classes = await ClassService.GetAll()
            res.status(StatusCodes.OK).json({ classes })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}