import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Participation } from '../models/participation.model'
import { IParticipation } from '../types/global'
import { ProgramService } from './program.service'
import { generateQRCode } from '../utils/qrcode.util'
export class ParticipationService {

    private static async incrementProgramQuantity(programId: string, program: any) {
        program.quantity = Number(program.quantity) + 1;
        await ProgramService.update(programId, program);
    }

    private static checkRegistrationDates(program: any) {
        const today = new Date();
        const registerDate = new Date(program.registerDate);
        const endRegisterDate = new Date(program.endRegisterDate);

        if (registerDate > today || endRegisterDate < today) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Register date is over');
        }
    }

    private static validateProgram(program: any) {
        if (!program || program.status === 'rejected' || program.status === 'pending') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not approved yet');
        }
        if (program.quantity === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is full');
        }
    }

    private static async reactivateParticipation(participationCheck: any, participation: IParticipation, programId: string, program: any) {
        participationCheck.status = 'success';
        participationCheck.qrCode = await generateQRCode(participation);
        await Participation.updateOne({ userId: participation.userId, programId }, participationCheck);
        await this.decrementProgramQuantity(programId, program);
        return { qrCode: participationCheck.qrCode };
    }

    private static async createNewParticipation(participation: IParticipation, programId: string, program: any) {
        participation.qrCode = await generateQRCode(participation);
        await Participation.create(participation);
        await this.decrementProgramQuantity(programId, program);
        return { qrCode: participation.qrCode };
    }

    private static async decrementProgramQuantity(programId: string, program: any) {
        program.quantity = Number(program.quantity) - 1;
        await ProgramService.update(programId, program);
    }

    static async create(participation: IParticipation) {
        const { programId, userId } = participation;
        const program = await ProgramService.getProgramById(programId);

        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        this.validateProgram(program);
        this.checkRegistrationDates(program);

        const participationCheck = await Participation.findOne({ userId, programId });

        if (participationCheck) {
            if (participationCheck.status === 'success') {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation already created');
            } else if (participationCheck.status === 'cancel') {
                return await this.reactivateParticipation(participationCheck, participation, programId, program);
            }
        }

        return await this.createNewParticipation(participation, programId, program);
    }

    static async cancel(userId: string, programId: string) {
        const participationCheck = await Participation.findOne({ userId, programId });

        if (participationCheck && participationCheck.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation already canceled');
        }
        const participation = await Participation.findOneAndUpdate({ userId, programId }, { status: 'cancel', qrCode: '' });
        this.incrementProgramQuantity(programId, participation);
        return { message: 'Participation canceled successfully' }
    }

    static async getParticipations() {
        return await Participation.find()
    }

    static async getParticipationIdByUserIdProgramId(userId: string, programId: string) {
        const participation = await Participation.findOne({ userId, programId });
        return participation?._id;
    }
}