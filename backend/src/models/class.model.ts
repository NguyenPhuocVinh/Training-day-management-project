import mongoose, { Document, Schema, model } from 'mongoose';
import { IClass } from '../types/global';

interface ClassDocument extends IClass, Document { }

const ClassSchema = new Schema<ClassDocument>({
    className: {
        type: String,
        required: true,
        unique: true
    },
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    }
}, { timestamps: true });

export const Class = model<ClassDocument>('Class', ClassSchema);
