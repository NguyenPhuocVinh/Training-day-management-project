import { Attendance } from '../models/attendance.model';
import { ApiError } from '../utils/api-error.util';
import { StatusCodes } from 'http-status-codes';
import { ParticipationService } from './participation.service';
import { ProgramService } from './program.service';
import { PointTransactionService } from './point_transaction.service';

export class AttendanceService {
    static async scanQRCodeCheckIn(userId: any, programId: any) {
        const program = await ProgramService.getProgramById(programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }
        if (!program.isAttendanceCategory(program.categoryId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not an attendance category');
        }

        const participation: any = await ParticipationService.getParticipationIdByUserIdProgramId(userId, programId);
        if (!participation || participation.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation is cancelled or does not exist');
        }

        return this.createOrUpdateAttendance(participation._id, 'checkIn');
    }

    static async scanQRCodeCheckOut(userId: any, programId: any) {
        const program = await ProgramService.getProgramById(programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }
        if (!program.isAttendanceCategory(program.categoryId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not an attendance category');
        }

        const participation: any = await ParticipationService.getParticipationIdByUserIdProgramId(userId, programId);
        if (!participation || participation.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation is cancelled or does not exist');
        }

        const pointTransaction = await PointTransactionService.create({
            participationId: participation._id,
            point: program.point,
            type: 'add',
            description: 'Finish program'
        });

        return this.createOrUpdateAttendance(participation._id, 'checkOut');
    }

    static async manualCheckIn(participationId: any) {
        const participation = await ParticipationService.getParticipationById(participationId);
        if (!participation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Participation not found');
        }
        const program = await ProgramService.getProgramById(participation.programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }
        if (!program.isAttendanceCategory(program.categoryId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not an attendance category');
        }
        if (participation.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation is cancelled');
        }

        return this.createOrUpdateAttendance(participationId, 'checkIn');
    }

    static async manualCheckOut(participationId: any) {
        const participation = await ParticipationService.getParticipationById(participationId);
        if (!participation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Participation not found');
        }
        const program = await ProgramService.getProgramById(participation.programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }
        if (!program.isAttendanceCategory(program.categoryId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not an attendance category');
        }
        if (participation.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation is cancelled');
        }

        return this.createOrUpdateAttendance(participationId, 'checkOut');
    }


    private static async createOrUpdateAttendance(participationId: any, type: 'checkIn' | 'checkOut') {
        const date = new Date();
        if (type === 'checkIn') {
            const attendance = await Attendance.findOne({ participationId });
            if (attendance) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Already checked in');
            }
            return await Attendance.create({ participationId, checkIn: date });

        } else {
            const attendance = await Attendance.findOneAndUpdate(
                { participationId },
                { checkOut: date },
                { new: true }
            );
            return attendance;
        }
    }
}
