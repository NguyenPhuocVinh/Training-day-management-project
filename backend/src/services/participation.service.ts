import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Participation } from '../models/participation.model'
import { IParticipation } from '../types/global'
import { generateQRCode } from '../utils/qrcode.util'
import { ProgramService } from './program.service'
import { Attendance } from '../models/attendance.model'
import { User } from '../models/user/user.model'
import { Evidence } from '../models/evidence.model'
import { Program } from '../models/program.model'
export class ParticipationService {

    private static async incrementProgramQuantity(programId: string) {
        const program = await ProgramService.getProgramById(programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }
        program.quantity = Number(program.quantity) + 1;
        await ProgramService.update(programId, program);

    }
    private static checkRegistrationDates(program: any) {
        const today = new Date();
        const registerDate = new Date(program.registerDate);
        const endRegisterDate = new Date(program.endRegisterDate);

        if (today < registerDate || today > endRegisterDate) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Registration period is over');
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
        this.incrementProgramQuantity(programId);
        return { message: 'Participation canceled successfully' }
    }

    static async getAllParticipations() {
        return await Participation.find()
    }

    static async getParticipationById(participationId: string) {
        return await Participation.findById(participationId)
    }

    static async getParticipationIdByUserIdProgramId(userId: string, programId: string) {
        const participation = await Participation.findOne({ userId, programId });
        return participation?._id;
    }

    static async getNonParticipants(programId: any) {
        const registeredUsers = await Participation.find({ programId, status: 'success' }).select('userId');

        const nonParticipants = await Promise.all(registeredUsers.map(async (participation) => {
            const userId = participation.userId;

            const userData = await User.findById(userId).select('-password -point').exec();

            if (!userData) {
                throw new Error(`User with ID ${userId} not found`);
            }

            const attendanceRecord = userData.attendanceRecord;

            if (!attendanceRecord || (attendanceRecord.checkIn && !attendanceRecord.checkOut)) {
                return {
                    participationId: participation._id,
                    user: userData

                }
                // const isNonParticipant = !attendanceRecord || (attendanceRecord.checkIn && !attendanceRecord.checkOut);

                // return {
                //     participationId: participation._id,
                //     user: userData,
                //     isNonParticipant
                // };
            }
        }));
        return nonParticipants;
    }




    static async getParticipants(programId: any) {
        const program = await Program.findById(programId).populate('categoryId');
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        if (program.isAttendanceCategory()) {
            return this.getAttendanceParticipants(programId);
        } else if (program.isEvidenceCategory()) {
            return this.getEvidenceParticipants(programId);
        } else {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program category not recognized');
        }
    }

    private static async getAttendanceParticipants(programId: any) {
        const registeredUsers = await Participation.find({ programId, status: 'success' })
            .select('userId')
            .populate('userId');

        const participationIds = registeredUsers.map(participation => participation._id);

        const attendedParticipations = await Attendance.find({
            participationId: { $in: participationIds },
            checkIn: { $ne: null },
            checkOut: { $ne: null }
        }).distinct('participationId');

        return registeredUsers
            .filter(participation => attendedParticipations.some(id => id.toString() === (participation._id as any).toString()))
            .map(participation => ({
                participationId: participation._id,
                user: participation.userId
            }));
    }

    private static async getEvidenceParticipants(programId: any) {
        const registeredUsers = await Participation.find({ programId, status: 'success' })
            .select('userId')
            .populate('userId');

        const participationIds = registeredUsers.map(participation => participation._id);

        const submittedEvidenceParticipations = await Evidence.find({
            participationId: { $in: participationIds },
            status: 'approved'
        }).distinct('participationId');

        return registeredUsers
            .filter(participation => submittedEvidenceParticipations.some(id => id.toString() === (participation._id as any).toString()))
            .map(participation => ({
                participationId: participation._id,
                user: participation.userId
            }));
    }

}