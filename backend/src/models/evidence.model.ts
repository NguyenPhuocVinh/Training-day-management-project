import mongoose, { Document, Schema, model } from 'mongoose'
import { IEvidence } from '../types/global'

interface EvidenceDocument extends IEvidence, Document { }

const EvidenceSchema = new Schema<EvidenceDocument>({
    participationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Participation'
    },
    image: {
        type: String,
        required: true
    },
    submitDate: {
        type: Date,
        default: Date.now
    },
    feedback: {
        type: String
    },
    feedbackDate: {
        type: Date
    },
    status: {
        type: String,
        required: true,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected'],
    },
    feedbackAdminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

export const Evidence = model<EvidenceDocument>('Evidence', EvidenceSchema);
