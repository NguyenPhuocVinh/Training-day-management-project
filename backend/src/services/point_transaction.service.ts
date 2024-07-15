import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/api-error.util';
import { IPointTransaction } from '../types/global';
import { PointTransaction } from '../models/point_transaction.model';
import { ParticipationService } from './participation.service';
import { Participation } from '../models/participation.model';
import { Attendance } from '../models/attendance.model';
import { User } from '../models/user/user.model';
import { Program } from '../models/program.model';


export class PointTransactionService {
    static async create(pointTransactionReq: IPointTransaction) {
        const { participationId, point, type, description } = pointTransactionReq;
        const existingPointTransaction = await PointTransaction.findOne({ participationId });
        if (existingPointTransaction) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Point transaction already exists');
        }
        return await PointTransaction.create(pointTransactionReq);
    }

    static async penalizeNonParticipants(participationId: any) {
        const participation = await Participation.findById(participationId);
        if (!participation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Participation not found');
        }

        if (participation.penalized) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participant has already been penalized');
        }

        const nonParticipants = await ParticipationService.getNonParticipants(participation.programId);

        const program = await Program.findById(participation.programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        const pointsToDeduct = program.isMinus ? - program.point : program.point;
        console.log('pointsToDeduct', pointsToDeduct);

        const foundParticipant = nonParticipants.find(participant => participant && (participant.participationId as any).toString() === participationId.toString());
        if (!foundParticipant) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation ID does not belong to non-participants');
        }

        const pointTransactionReq: IPointTransaction = {
            participationId: participationId,
            point: pointsToDeduct,
            type: 'subtract',
            description: `Deducted ${pointsToDeduct} points for not participating in program ${program.programName}`
        };

        await PointTransaction.create(pointTransactionReq);

        if (foundParticipant.user && foundParticipant.user._id) {
            console.log('foundParticipant.user._id', foundParticipant.user._id);
            await User.updateOne(
                { _id: foundParticipant.user._id },
                { $inc: { point: pointsToDeduct } }
            );

            // Đánh dấu là đã bị trừ điểm
            participation.penalized = true;
            await participation.save();
        } else {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User ID not found for the participant');
        }

        return nonParticipants.length;
    }

    static async rewardParticipants(participationId: any) {
        const participation = await Participation.findById(participationId);
        if (!participation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Participation not found');
        }

        if (participation.pointsRewarded) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Points have already been rewarded for this participation');
        }

        const participants = await ParticipationService.getParticipants(participation.programId);

        const isParticipantValid = participants.some(
            (participant) => (participant.participationId as any).toString() === participationId.toString()
        );

        if (!isParticipantValid) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation ID is not valid for reward');
        }

        const program = await Program.findById(participation.programId);
        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        const pointsToAdd = Math.abs(program.point as number);

        const pointTransactionReq: IPointTransaction = {
            participationId: participationId,
            point: pointsToAdd,
            type: 'add',
            description: `Added ${pointsToAdd} points for participating in program ${program.programName}`
        };

        await PointTransaction.create(pointTransactionReq);

        if (participation.userId) {
            const userUpdateResult = await User.updateOne(
                { _id: participation.userId },
                { $inc: { point: pointsToAdd } }
            );

            if (userUpdateResult.modifiedCount === 0) {
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to add points to the user');
            }

            participation.pointsRewarded = true;
            await participation.save();
        } else {
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User ID not found for the participant');
        }

        return participants.length;
    }


}
