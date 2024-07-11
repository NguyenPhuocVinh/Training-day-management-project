import mongoose, { Schema, Document, model } from 'mongoose'
import { IProgram } from '../types/global'
import validator from 'validator'

interface ProgramDocument extends IProgram, Document { }

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
}, { timestamps: true })

export const Program = model<ProgramDocument>('Program', ProgramSchema)