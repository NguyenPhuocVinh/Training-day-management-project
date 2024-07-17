import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { QuizService } from '../services/quiz.service'
import { IQuestion, IQuiz } from '../types/global'
import { UserAnswerReq } from '../types/request/user_answer'
import { UserQuizService } from '../services/user_quiz.service'

export class UserQuizController {

    static async startQuiz(req: Request, res: Response) {
        try {
            const { participationId, quizId } = req.body;
            const result = await UserQuizService.startQuiz(participationId, quizId);
            res.status(StatusCodes.CREATED).json({ userQuiz: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async submitQuiz(req: Request, res: Response) {
        try {
            const userQuizAnswer: UserAnswerReq = req.body;
            const result = await UserQuizService.submitQuiz(userQuizAnswer);
            res.status(StatusCodes.CREATED).json({ userAnswers: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async getQuestionByQuizId(req: Request, res: Response) {
        try {
            const quizId = req.query.quizId;
            const result = await UserQuizService.getQuestionByQuizId(quizId);
            res.status(StatusCodes.OK).json({ questions: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }


}