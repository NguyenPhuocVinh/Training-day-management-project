import mongoose, { Schema, Document, model } from 'mongoose'
import { IParticipation } from '../types/global'
import validator from 'validator'

interface ParticipationDocument extends IParticipation, Document { }
const ParticipationSchema = new Schema<ParticipationDocument>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    programId: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    status: {
        type: String,
        default: 'success',
        enum: ['success', 'cancel']
    }
}, { timestamps: true })

export const Participation = model<ParticipationDocument>('Participation', ParticipationSchema)