import mongoose, { Schema, Document, model } from 'mongoose';
import { IUserQuiz } from '../../types/global';

interface UserQuizDocument extends IUserQuiz, Document { }

const UserQuizSchema = new Schema<UserQuizDocument>({
    participationId: {
        type: Schema.Types.ObjectId,
        ref: 'Participation',
        required: true
    },
    quizId: {
        type: Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    completed: {
        type: Date
    },
    correctAnswer: {
        type: Number,
    }

}, { timestamps: true });

export const UserQuiz = model<UserQuizDocument>('UserQuiz', UserQuizSchema);