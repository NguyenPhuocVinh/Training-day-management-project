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
        required: true

    },
    checkOut: {
        type: Date
    }
}, { timestamps: true });

export const Attendance = model<AttendanceDocument>('Attendance', AttendanceSchema);
