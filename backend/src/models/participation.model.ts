import mongoose, { Schema, Document, model } from 'mongoose';
import { IParticipation } from '../types/global';

interface ParticipationDocument extends IParticipation, Document { }

const ParticipationSchema = new Schema<ParticipationDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    programId: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true,
    },
    status: {
        type: String,
        default: 'success',
        enum: ['success', 'cancel'],
    },
    qrCode: {
        type: String,
        required: true
    },
    penalized: {
        type: Boolean,
        default: false
    },
    pointsRewarded: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Participation = model<ParticipationDocument>('Participation', ParticipationSchema);
