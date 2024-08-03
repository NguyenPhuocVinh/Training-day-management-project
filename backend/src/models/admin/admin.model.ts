import mongoose, { Document, Schema, model } from 'mongoose';
import validator from 'validator'
import { IAdmin } from '../../types/global';

interface AdminDocument extends IAdmin, Document { }

const AdminSchema = new Schema<AdminDocument>({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
            message: 'Invalid email format'
        },
        select: false
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    facilityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Facility'
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    }
}, { timestamps: true });

export const Admin = model<AdminDocument>('Admin', AdminSchema);
