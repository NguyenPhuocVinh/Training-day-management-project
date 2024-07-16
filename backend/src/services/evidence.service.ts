import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { Evidence } from '../models/evidence.model'
import { IEvidence } from '../types/global'
import { Program } from '../models/program.model'
import { Participation } from '../models/participation.model'
import { IPointTransaction } from '../types/global'
import { PointTransactionService } from './point_transaction.service'

export class EvidenceService {
    static async create(evidence: IEvidence) {
        const participationId = evidence.participationId;

        const evidenceExist = await Evidence.findOne({ participationId: participationId });
        if (evidenceExist) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Evidence already submitted');
        }

        const participation = await Participation.findOne({ _id: participationId }).select('programId');

        if (!participation) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Participation not found');
        }

        const program = await Program.findOne({ _id: participation.programId }).populate('categoryId');

        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        if (program.startDate > new Date()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Program has not started yet');
        }

        if (program.isEvidenceCategory()) {
            const newEvidence = await Evidence.create(evidence);
            return newEvidence;
        } else {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'This program is not a propose program');
        }
    }

    static async feedback(evidenceId: string, evidenceReq: IEvidence) {
        const { feedback, status, feedbackAdminId } = evidenceReq;

        const evidence = await Evidence.findById(evidenceId);
        if (!evidence) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Evidence not found');
        }

        if (evidence.status !== 'pending') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'This evidence has been reviewed');
        }

        const updatedEvidence = await Evidence.findByIdAndUpdate(
            evidenceId,
            {
                feedback,
                status,
                feedbackAdminId,
                feedbackDate: new Date()
            },
            { new: true }
        );
        return updatedEvidence;
    }
}