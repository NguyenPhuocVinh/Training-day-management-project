import mongoose, { Schema, Document, model } from 'mongoose';
import { IUserAnswer } from '../../types/global';

interface UserAnswerDocument extends IUserAnswer, Document { }

const UserAnswerSchema = new Schema<UserAnswerDocument>({
    userQuizId: {
        type: Schema.Types.ObjectId,
        ref: 'UserQuiz',
        required: true
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { timestamps: true });

export const UserAnswer = model<UserAnswerDocument>('UserAnswer', UserAnswerSchema);
