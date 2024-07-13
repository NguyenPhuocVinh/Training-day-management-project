import mongoose, { Schema, Document, model } from 'mongoose';
import validator from 'validator';
import { IAttendance } from '../types/global';

interface AttendanceDocument extends IAttendance, Document { }

const AttendanceSchema = new Schema<AttendanceDocument>({
    participationId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Participation'
    },
    checkIn: {
        type: Date,
        required: true,
        validate: {
            validator: (value: Date) => validator.isDate(value.toISOString()),
            message: 'Invalid check-in date format'
        }
    },
    checkOut: {
        type: Date,
        required: true,
        validate: {
            validator: (value: Date) => validator.isDate(value.toISOString()),
            message: 'Invalid check-out date format'
        }
    }
}, { timestamps: true });

export const Attendance = model<AttendanceDocument>('Attendance', AttendanceSchema);
