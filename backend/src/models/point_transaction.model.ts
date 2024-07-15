import mongoose, { Schema, Document, model } from 'mongoose'
import { IPointTransaction } from '../types/global'

interface IPointTransactionModel extends IPointTransaction, Document { }

const pointTransactionSchema = new Schema<IPointTransactionModel>({
    participationId: {
        type: Schema.Types.ObjectId,
        ref: 'Participation',
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['add', 'subtract', 'none']
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

export const PointTransaction = model<IPointTransactionModel>('PointTransaction', pointTransactionSchema)

