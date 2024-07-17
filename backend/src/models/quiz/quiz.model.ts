import mongoose, { Document, Schema, model } from 'mongoose'
import { IQuiz } from '../../types/global'

interface QuizDocument extends IQuiz, Document {
    checkStartEnd: () => boolean
}

const QuizSchema = new Schema<QuizDocument>({
    quizName: {
        type: String,
        required: true
    },
    programId: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    quantityQuestion: {
        type: Number,
        required: true
    },
    requiredCorrectAnswer: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'unactive']
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, { timestamps: true });

QuizSchema.method('checkStartEnd', function checkStartEnd(this: QuizDocument) {
    const today = new Date();
    if (today < this.startTime || today > this.endTime) {
        return false;
    }
    return true;
});

export const Quiz = model<QuizDocument>('Quiz', QuizSchema);


