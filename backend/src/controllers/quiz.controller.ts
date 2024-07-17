import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { QuizService } from '../services/quiz.service'
import { IQuestion, IQuiz } from '../types/global'

export class QuizController {
    static async create(req: Request, res: Response) {
        try {
            const quizData: IQuiz = req.body.quiz;
            const questions: IQuestion[] = req.body.questions;
            const result = await QuizService.create(quizData, questions);
            res.status(StatusCodes.CREATED).json({ quiz: result.createdQuiz, questions: result.createdQuestions });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async updateQuiz(req: Request, res: Response) {
        try {
            const quizId = req.query.quizId;
            const quizData: IQuiz = req.body;
            const result = await QuizService.updateQuiz(quizId, quizData);
            res.status(StatusCodes.OK).json({ quiz: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async updateQuestion(req: Request, res: Response) {
        try {
            const questionId = req.query.questionId;
            const questionData: IQuestion = req.body;
            const result = await QuizService.updateQuestion(questionId, questionData);
            res.status(StatusCodes.OK).json({ question: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async getQuizByProgramId(req: Request, res: Response) {
        try {
            const programId = req.query.programId;
            const result = await QuizService.getQuizByProgramId(programId);
            res.status(StatusCodes.OK).json({ quiz: result });
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }
}
