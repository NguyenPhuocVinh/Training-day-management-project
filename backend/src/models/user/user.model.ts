import mongoose, { Schema, Document, model } from 'mongoose';
import { IUser } from '../../types/global';

interface UserDocument extends IUser, Document {
    attendanceRecord: {
        checkIn: Date;
        checkOut: Date;
    };
}

// * Hàm setter cho trường gender
const genderSetter = (value: string | boolean): number => {
    if (typeof value === 'string') return value.toLowerCase() === 'female' ? 1 : 0;
    return value ? 1 : 0;
}

const UserSchema = new Schema<UserDocument>({
    MSSV: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    birthDay: {
        type: Date,
        required: true
    },
    gender: {
        type: Boolean,
        required: true,
        set: genderSetter,
        description: 'Gender of the user: 0 for male, 1 for female'
    },
    point: {
        type: Number,
        required: true,
        default: 0,
        select: false
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
}, { timestamps: true });

export const User = model<UserDocument>('User', UserSchema);
