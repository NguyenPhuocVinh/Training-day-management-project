import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { FacilityRequestBody } from '../types/request/facility.request'
import { FacilityService } from '../services/facility.service'

export class FacilityController {
    static async Create(req: Request, res: Response) {
        try {
            const facilityRequestBody: FacilityRequestBody = req.body
            if (!facilityRequestBody.facilityName) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields')
            }
            const newFacility = await FacilityService.Create(facilityRequestBody)
            res.status(StatusCodes.CREATED).json({ newFacility })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Update(req: Request, res: Response) {
        try {
            const facilityId = req.query.facilityId as string
            if (!facilityId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required Facility Id')
            const payload: FacilityRequestBody = req.body
            const updatedFacility = await FacilityService.Update(facilityId, payload)
            res.status(StatusCodes.OK).json({ updatedFacility })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Delete(req: Request, res: Response) {
        try {
            const facilityId = req.query.facilityId as string
            if (!facilityId) throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required Facility Id')
            const deletedFacility = await FacilityService.Delete(facilityId)
            res.status(StatusCodes.OK).json({ deletedFacility, message: 'Success' })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async Get(req: Request, res: Response) {
        try {
            const facilityId = req.params.facilityId as string
            const facility = await FacilityService.Get(facilityId)
            res.status(StatusCodes.OK).json({ facility })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async GetAll(req: Request, res: Response) {
        try {
            const facilites = await FacilityService.GetAll()
            res.status(StatusCodes.OK).json({ facilites })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}