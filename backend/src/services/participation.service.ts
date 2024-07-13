import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Participation } from '../models/participation.model'
import { IParticipation } from '../types/global'
import { ProgramService } from './program.service'

export class ParticipationService {
    static async create(participation: IParticipation) {
        const programId = participation.programId;
        const userId = participation.userId;
        const program = await ProgramService.getProgramById(programId);

        if (program?.status === 'rejected' || program?.status === 'pending') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not approved yet');
        }
        if (program?.quantity === 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is full');
        }

        const today = new Date();

        if (program) {
            const registerDate = new Date(program.registerDate);
            const endRegisterDate = new Date(program.endRegisterDate);
            if (registerDate > today || endRegisterDate < today) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Register date is over');
            }
            const participationCheck = await Participation.findOne({ userId, programId });

            if (participationCheck && participationCheck.status === 'success') {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation already created');
            }
            if (participationCheck && participationCheck.status === 'cancel') {
                participationCheck.status = 'success';
                await Participation.updateOne({ userId, programId }, participationCheck);
                program.quantity = Number(program.quantity) - 1;
                await ProgramService.update(programId, program);
                return { message: 'Participation created successfully' }
            } else {
                program.quantity = Number(program.quantity) - 1;
                ProgramService.update(programId, program);
                Participation.create(participation);
                return { message: 'Participation created successfully' }
            }

        }

    }

    // static async create(participation: IParticipation) {
    //     const { programId, userId } = participation;

    //     // Fetch the program details
    //     const program = await ProgramService.getProgramById(programId);

    //     // Check program status
    //     if (program?.status === 'rejected' || program?.status === 'pending') {
    //         throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not approved yet');
    //     }

    //     // Check program capacity
    //     if (program?.quantity === 0) {
    //         throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is full');
    //     }

    //     const today = new Date();
    //     const registerDate = new Date(program?.registerDate);
    //     const endRegisterDate = new Date(program?.endRegisterDate);

    //     // Validate registration dates
    //     if (registerDate > today || endRegisterDate < today) {
    //         throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration date is over');
    //     }

    //     // Check existing participation
    //     const participationCheck = await Participation.findOne({ userId, programId });

    //     if (participationCheck) {
    //         if (participationCheck.status === 'success') {
    //             throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation already created');
    //         }

    //         if (participationCheck.status === 'cancel') {
    //             participationCheck.status = 'success';
    //             await Participation.updateOne({ userId, programId }, participationCheck);
    //         }
    //     } else {
    //         // Decrement program quantity and create participation
    //         program.quantity -= 1;
    //         await ProgramService.update(programId, program);
    //         await Participation.create(participation);
    //     }

    //     return { message: 'Participation created successfully' };
    // }


    static async cancel(userId: string, programId: string) {

        const participationCheck = await Participation.findOne({ userId, programId });

        if (participationCheck && participationCheck.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation already canceled');
        }
        const participation = await Participation.findOneAndUpdate({ userId, programId }, { status: 'cancel' });
        const program = await ProgramService.getProgramById(programId);
        if (program) {
            program.quantity = Number(program.quantity) + 1;
            await ProgramService.update(programId, program);
        }
        return { message: 'Participation canceled successfully' }
    }
}