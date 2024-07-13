import mongoose, { Schema, Document, model } from 'mongoose'
import { IProgram } from '../types/global'
import validator from 'validator'
import { ApiError } from '../utils/api-error.util'
import { StatusCodes } from 'http-status-codes'

interface ProgramDocument extends IProgram, Document {
    // validateProgram(): void;
    // checkRegistrationDates(): void;
}

const ProgramSchema = new Schema<ProgramDocument>({
    programName: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validator.isURL(value),
            message: 'Invalid URL'
        }
    },
    quantity: {
        type: Number,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        required: true
    },
    endRegisterDate: {
        type: Date,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'approved', 'rejected']
    },
    point: {
        type: Number,
        required: true
    },
    isMinus: {
        type: Boolean,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
}, { timestamps: true });

// ProgramSchema.methods.validateProgram = function () {
//     if (this.status === 'rejected' || this.status === 'pending') {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is not approved yet');
//     }
//     if (this.quantity === 0) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Program is full');
//     }
// };

// ProgramSchema.methods.checkRegistrationDates = function () {
//     const today = new Date();
//     const registerDate = new Date(this.registerDate);
//     const endRegisterDate = new Date(this.endRegisterDate);

//     if (registerDate > today || endRegisterDate < today) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, 'Register date is over');
//     }
// };

export const Program = model<ProgramDocument>('Program', ProgramSchema)