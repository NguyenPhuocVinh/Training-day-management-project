import mongoose, { Document, Schema, model } from 'mongoose'
import { IQuestion } from '../../types/global'

interface QuestionDocument extends IQuestion, Document { }

const QuestionSchema = new Schema<QuestionDocument>({
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    imageQuestion: {
        type: String
    },
    answers: {
        type: [String],
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const Question = model<QuestionDocument>('Question', QuestionSchema);