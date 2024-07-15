import mongoose, { Schema, Document, model } from 'mongoose'
import { IProgram } from '../types/global'
import validator from 'validator'


interface ProgramDocument extends IProgram, Document {
    validateProgram(): boolean;
    checkRegistrationDates(): boolean;
    isAttendanceCategory(categoryId: any): boolean;
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

// ProgramSchema.method('validateProgram', function validateProgram() {
//     if (!this || this.status === 'rejected' || this.status === 'pending') {
//         return false;
//     }
//     if (this.quantity === 0) {
//         return false;
//     }
//     return true;
// }
// );

// ProgramSchema.method('checkRegistrationDates', function checkRegistrationDates() {
//     const today = new Date();
//     const registerDate = new Date(this.registerDate);
//     const endRegisterDate = new Date(this.endRegisterDate);

//     if (registerDate > today || endRegisterDate < today) {
//         return false;
//     }
//     return true;
// });

ProgramSchema.method('isAttendanceCategory', function isAttendanceCategory(categoryId: any) {
    return this.categoryId.equals(categoryId);
});

export const Program = model<ProgramDocument>('Program', ProgramSchema)