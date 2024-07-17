import { ApiError } from '../utils/api-error.util'
import { StatusCodes } from 'http-status-codes'
import { UserQuiz, UserAnswer } from '../models/user'
import { IUserQuiz, IUserAnswer } from '../types/global'
import { UserAnswerReq } from '../types/request/user_answer'
import { Question } from '../models/quiz/question.model'
import { Participation } from '../models/participation.model'
import { Quiz } from '../models/quiz/quiz.model'

export class UserQuizService {

    static async startQuiz(participationId: any, quizId: any) {
        const participation = await Participation.findById(participationId).populate('programId');
        if (participation?.programId.startDate > new Date()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Quiz has not started yet');
        }
        if (participation?.status === 'cancel') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Participation has been canceled');
        }
        const quiz = await Quiz.findById(quizId);
        if (quiz?.checkStartEnd() === false || quiz?.status === 'unactive') {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Quiz has not started yet');
        }
        const questions = this.getQuestionByQuizId(quizId);
        const userQuiz = await UserQuiz.create({ participationId, quizId });
        return questions;
    }

    static async submitQuiz(userQuizAnswer: UserAnswerReq) {
        const { userQuizId, answers } = userQuizAnswer;
        if (!userQuizId || !answers) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid request');
        }
        const userAnswerObjects = answers.map((answer: any) => ({
            userQuizId,
            questionId: answer.questionId,
            answer: answer.answer
        }));
        const userAnswers = await UserAnswer.insertMany(userAnswerObjects);
        return userAnswers;
    }

    static async getQuestionByQuizId(quizId: any) {
        const questions = await Question.find({ quizId });
        return questions;
    }
}
