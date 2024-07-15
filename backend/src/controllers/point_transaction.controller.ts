import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { PointTransactionService } from '../services/point_transaction.service'

export class PointTransactionController {
    static async create(req: Request, res: Response) {
        try {
            const pointTransaction = await PointTransactionService.create(req.body)
            res.status(StatusCodes.CREATED).json({ pointTransaction })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }


    static async penalizeNonParticipants(req: Request, res: Response) {
        try {
            const participationId = req.body.participationId
            const nonParticipants = await PointTransactionService.penalizeNonParticipants(participationId)
            res.status(StatusCodes.OK).json({ nonParticipants })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async rewardParticipants(req: Request, res: Response) {
        try {
            const participationId = req.body.participationId
            const participants = await PointTransactionService.rewardParticipants(participationId)
            res.status(StatusCodes.OK).json({ participants })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}