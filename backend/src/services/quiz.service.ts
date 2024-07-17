import { StatusCodes } from 'http-status-codes'
import { ApiError } from '../utils/api-error.util'
import { IQuiz, IQuestion } from '../types/global'
import { Quiz } from '../models/quiz/quiz.model'
import { Question } from '../models/quiz/question.model'
import { ProgramService } from './program.service'
import { Program } from '../models/program.model'

export class QuizService {
    static async create(quizReq: IQuiz, questions: IQuestion[]) {
        const { programId } = quizReq;

        const program = await Program.findById(programId).populate('categoryId');

        if (!program) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'Program not found');
        }

        // Kiểm tra xem chương trình có phải là loại "quiz" hay không
        if (!program.isQuizCategory()) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'This program is not a quiz program');
        }

        // Kiểm tra xem đã tồn tại quiz cho chương trình này chưa
        const quizExists = await Quiz.findOne({ programId: programId });
        if (quizExists) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Quiz already created');
        }

        // Tạo quiz mới
        const createdQuiz = await Quiz.create(quizReq);

        // Tạo các câu hỏi cho quiz
        const createdQuestions = await Question.insertMany(
            questions.map(question => ({
                ...question,
                quizId: createdQuiz._id
            }))
        );

        return { createdQuiz, createdQuestions };
    }

    static async updateQuiz(quizId: any, quizReq: IQuiz) {
        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            {
                ...quizReq
            },
            { new: true }
        )
        return quiz;
    }

    static async updateQuestion(questionId: any, questionReq: IQuestion) {
        const question = await Question.findByIdAndUpdate(
            questionId,
            {
                ...questionReq
            },
            { new: true }
        )
        return question;
    }

    static getQuizByProgramId(programId: any) {
        return Quiz.findOne({ programId });
    }



}