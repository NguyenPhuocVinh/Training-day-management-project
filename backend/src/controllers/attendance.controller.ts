import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { AttendanceService } from '../services/attendance.service'

export class AttendanceController {
    static async scanQRCodeCheckIn(req: Request, res: Response) {
        try {
            const { userId, programId } = req.body
            const attendance = await AttendanceService.scanQRCodeCheckIn(userId, programId)
            res.status(StatusCodes.OK).json({ attendance })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async scanQRCodeCheckOut(req: Request, res: Response) {
        try {
            const { userId, programId } = req.body
            const attendance = await AttendanceService.scanQRCodeCheckOut(userId, programId)
            res.status(StatusCodes.OK).json({ attendance })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async manualCheckIn(req: Request, res: Response) {
        try {
            const participationId = req.body.participationId
            const attendance = await AttendanceService.manualCheckIn(participationId)
            res.status(StatusCodes.OK).json({ attendance })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async manualCheckOut(req: Request, res: Response) {
        try {
            const participationId = req.body.participationId
            const attendance = await AttendanceService.manualCheckOut(participationId)
            res.status(StatusCodes.OK).json({ attendance })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}