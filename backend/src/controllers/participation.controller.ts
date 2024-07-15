import { Request, Response } from 'express'
import moment from 'moment'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { ParticipationService } from '../services/participation.service'
import { IParticipation } from '../types/global'

export class ParticipationController {
    static async create(req: Request, res: Response) {
        try {
            const userId = req.user._id as string;
            const participationReqBody: IParticipation = req.body;
            participationReqBody.userId = userId;
            const participation = await ParticipationService.create(participationReqBody);
            res.status(StatusCodes.CREATED).json({ participation })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const userId = req.user._id as string;
            const programId = req.query.programId as string;
            const message = await ParticipationService.cancel(userId, programId);
            res.status(StatusCodes.OK).json({ message })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });

        }
    }

    static async getNonParticipants(req: Request, res: Response) {
        try {
            const programId = req.query.programId
            const nonParticipants = await ParticipationService.getNonParticipants(programId)
            res.status(StatusCodes.OK).json({ nonParticipants })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async getAllParticipations(req: Request, res: Response) {
        try {
            const participations = await ParticipationService.getAllParticipations();
            res.status(StatusCodes.OK).json({ participations });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async getParticipants(req: Request, res: Response) {
        try {
            const programId = req.query.programId
            const participants = await ParticipationService.getParticipants(programId)
            res.status(StatusCodes.OK).json({ participants })
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}