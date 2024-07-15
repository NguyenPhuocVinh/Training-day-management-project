import mongoose, { Schema, Document, model } from 'mongoose'
import { ICategory } from '../types/global'
import validator from 'validator'

interface CategoryDocument extends ICategory, Document { }

const CategorySchema = new Schema<CategoryDocument>({
    categoryName: {
        type: String,
        required: true,
        unique: true,
        enum: ['quiz', 'attendance', 'propose']
    },
    isPropose: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

export const Category = model<CategoryDocument>('Category', CategorySchema);